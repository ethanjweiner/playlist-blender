import {playlistsString} from "./helpers.js";
import {CleanString, Account, Playlist, Track} from "./builderClasses";

const SPOTIFY_GET_ITEMS_LIMIT = 100;
const YOUTUBE_GET_ITEMS_LIMIT = 100;
const SPOTIFY_POST_ITEMS_LIMIT = 100;
const YOUTUBE_POST_ITEMS_LIMIT = 100;

// An APIInterface is one of:
// - SpotifyRequest
// - YoutubeRequest
// INTERPRETATION: An interface through which requests can be made to/from the account specificed by _token_ on platform _platform_
// Constructor: 
const apiInterface = (platform, token, user_id) => {
    switch (platform) {
        case "Spotify" : return new SpotifyRequest(token, user_id);
        case "Youtube" : return new YoutubeRequest(token, user_id);
        default : console.log("Invalid platform");
    }
}

class APIRequest {

    constructor(token, user_id) {
        this.token = token;
        // Only required if making user-specific requests
        this.user_id = user_id;
    }

    requestOptions(requestType, body) {
        var headers = new Headers();
        headers.append("Authorization", "Bearer "+this.token);
        
        var requestOptions = {
          method: requestType,
          headers,
          redirect: 'follow',
          body
        };
        return requestOptions;
    }

    async getAccount() {
        throw new Error ('Implement for specific platform')
    }

    // firstSearchResult : String String -> 
    // Provides the first search result of _searchTerm_ with _endpoint_
    async firstSearchResult(endpoint) {
        try {
            const options = this.requestOptions('GET');
            options.headers.append("Content-Type", "application/json");
            const response = await fetch(endpoint, options);
            if (response.ok) {
                const jsonData = await response.json();
                const track = this.parseTracksFromSearch(jsonData)[0];
                return track;
            }
            return null;
        }
        catch (err) {
            return null;
        }
    }

    // Abstract method
    // parseTracksFromSearch : JSON Object -> [List-of Tracks]
    // Parses the tracks from the _jsonData_ body of a search response
    parseTracksFromSearch(jsonData) {
        throw new Error ('Implement for specific platform');
    }

    // retrievePlaylists : String -> [List-of Playlists]
    // Fetches the playlists from _endpoint_ endpoint
    async retrievePlaylists(endpoint) {
          
        const response = await fetch(endpoint, this.requestOptions('GET'));

        if (response.ok) {
            const jsonData = await response.json();
            return this.parsePlaylists(jsonData);
        } else if (response.status === 404) {
            throw new Error('Please make sure all of the accounts you added contain playlists.');
        } else if (response.status === 403) {
            throw new Error('Your accounts did not properly authenticate');
        }
    }

    // Abstract method
    // parsePlaylists : JSON Object -> [List-of Playlists]
    // Parses the playlists from the _jsonData_ body of a playlist response
    parsePlaylists(jsonData) {
        throw new Error ('Implement for specific platform')
    }

    // retrievePlaylistTracks : String -> JSON Response
    // Fetches the tracks from a particular playlist as denoted by _endpoint_ endpoint
    async retrievePlaylistTracks(endpoint) {
        try {
            const response = await fetch(endpoint, this.requestOptions('GET'));
            if (response.ok) {
                return await response.json();
            } else {
                console.log(response.status);
                throw new Error ('Error: '+response.status)
            }
        }
        catch (err) {
            throw new Error (err.message);
        } 
    }

    // Abstract method
    // parseTracksFromPlayliset : JSON Object -> [List-of Tracks]
    // Parses the playlists from the _jsonData_ body of a playlist tracks response
    parseTracksFromPlaylist(jsonData) {
        throw new Error ('Implement for specific platform')
    }

    // createPlaylist : String [List-of Tracks] [List-of String] String -> String
    // Creates a playlist, whose name is _name_, whose description contains _playlistNames_, with _tracks_,
    // and provides the url of this playlist
    async createPlaylist(name, tracks, playlistNames, playlistUrl) {

        try {
            // Post request
            const response = await this.initializePlaylist(name, playlistNames);

            // Add tracks to that playlist
            if (response.ok) {
                const {id} = await response.json();
                await this.addTracksToPlaylist(id, tracks);
                return { url: playlistUrl+id };
            } else {
                console.log(response.status);
                throw new Error ('Error: '+response.status)
            }
        } catch (err) {
            throw new Error (err.message);
        }
    }

    // initializePlaylist : JSONObject String -> HTTPResponse
    // Creates a playlist using _endpoint_ with parameters from _body_
    async initializePlaylist(body, endpoint) {
        // Implement
        try {
            const response = await fetch(endpoint, this.requestOptions('POST', body));
            if (response) {
                return response;
            } else {
                throw new Error("You can not create a new playlist at this time, because the quota has been exceeded.");
            }
        } catch (err) {
            throw new Error (err.message);
        }
    }

    // Abstract method
    // addTracksToPlaylist : String [List-of Tracks] -> _
    // adds _tracks_ to the playlist specificed by _playlistId_
    async addTracksToPlaylist(playlistId, tracks) {
        throw new Error ('Implement for specific platform');
    }

}

class SpotifyRequest extends APIRequest {

    constructor(token, user_id) {
        super(token, user_id);
    }

    async getAccount() {
        let name, id, playlists, platform;
        const userInfo = await this.userInfo();
        name = userInfo.name;
        id = userInfo.id;
        platform = "Spotify";
        playlists = await this.retrievePlaylists(id);

        // Here, create a new account using Account class
        return new Account(playlists, platform, this.token, { name, id, });
    }

    // Spotify-specfic method (extending, not overriding)
    async userInfo() {

        try {
            const response = await fetch("https://api.spotify.com/v1/me", this.requestOptions('GET'));
            if (response.ok) {
                const jsonData = await response.json();
                return {
                    name: jsonData.display_name,
                    id: jsonData.id
                }
            } else {
                console.log(response.status);
                throw new Error ("Error: "+response.status);
            }
        } catch(err) {
            throw new Error (err.message);
        }
    }

    generateSpotifyQuery(name, artists) {
        const trackName = new CleanString(name).clean().removeFeatures().str.split(' ').join("%20");
        const artist = new CleanString(artists[0]).clean().str.split(' ').join("%20");
        return `${trackName}%20artist:%20${artist}`;
      }

    async firstSearchResult(name, artists) {
        const query = this.generateSpotifyQuery(name, artists);
        const resultOne = await super.firstSearchResult(`https://api.spotify.com/v1/search?q=${query}&type=track&limit=1`);
        if (resultOne) return resultOne;
        const trackName = new CleanString(name).clean().str.split(' ').join("%20");
        return await super.firstSearchResult(`https://api.spotify.com/v1/search?q=${trackName}&type=track&limit=1`);
    }

    parseTracksFromSearch(jsonData) {
        return jsonData.tracks.items.map(item => new Track(item.name, "Spotify", item.artists.map(artist => artist.name), {uri: item.uri}));
    }

    async retrievePlaylists(id) {
        return await super.retrievePlaylists(`https://api.spotify.com/v1/users/${id}/playlists?limit=50`);
    }

    parsePlaylists(jsonData) {
        return jsonData.items.map(item => new Playlist(item.id, item.name, "Spotify", { numTracks: item.tracks.total, url: item.external_urls.spotify }));
    }

    async retrievePlaylistTracks(playlistId) {

        // retrievePlaylistTracksAccum : [List-of Tracks] String -> [List-of Tracks]
        // Given an initial list of _tracks_, adds on the remaining tracks from _endpoint_ (if one is given)
        // ACCUMULATOR: _tracks_ represents the tracks collected so far
        // ACCUMULATOR: _endpoint_ represents the endpoint provided by the previous response
        const retrievePlaylistTracksAccum = async (tracks, endpoint) => {
            // If the end of the tracks has not been reached, fetch the next batch of tracks & recur
            if (endpoint) {
                const jsonData = await super.retrievePlaylistTracks(endpoint);
                return retrievePlaylistTracksAccum(tracks.concat(this.parseTracksFromPlaylist(jsonData)), jsonData.next);
            } else {
                return tracks;
            }
        }

        // Retrieves the first tracks (up to 100)
        const jsonData = await super.retrievePlaylistTracks(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`);
        const initialTracks = this.parseTracksFromPlaylist(jsonData);

        return retrievePlaylistTracksAccum(initialTracks, jsonData.next);
    }

    parseTracksFromPlaylist(jsonData) {
        return jsonData.items.filter(item => item.track).map(item => new Track(item.track.name, "Spotify", item.track.artists.map(artist => artist.name), {uri: item.track.uri}));
    }

    async createPlaylist(name, tracks, playlistNames) {
        return await super.createPlaylist(name, tracks, playlistNames, `https://open.spotify.com/playlist/`);
    }

    async initializePlaylist(name, playlistNames) {
        var body = JSON.stringify({"name":name,"description":`Playlist created from ${playlistsString(playlistNames)}`});
        var endpoint = `https://api.spotify.com/v1/users/${this.user_id}/playlists`;
        return await super.initializePlaylist(body, endpoint);
    }

    // Adds first 100 tracks from _tracks_ to playlist _playlistId_, & then adds the rest
    // TERMINATES: We remove the first 100 elements from _tracks_ for each iterations, so eventually its length will reach <100 (base case)
    async addTracksToPlaylist(playlistId, tracks) {
        if (tracks.length > 500) {
            throw new Error ('The resulting playlist can only contain a maximum of 500 tracks. Yours contained '+tracks.length+' tracks.');
        }

        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer "+this.token);
        myHeaders.append("Content-Type", "application/json");

        const uris = tracks.slice(0,100).map(track => track.uri);
        var urisObject = { "uris" : uris };
        var body = JSON.stringify(urisObject);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body,
            redirect: 'follow'
        };

        try {
            await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, requestOptions);
            console.log("Tracks added!");
        } catch (err) {
            throw new Error (err.message);
        }

        if (tracks.length > 100) {
            console.log(tracks, tracks.slice(100));
            await this.addTracksToPlaylist(playlistId, tracks.slice(100));
        }

    }

}

class YoutubeRequest extends APIRequest {

    constructor(token, user_id) {
        super(token, user_id)
    }

    async getAccount() {
        let playlists, platform;
        platform = "Youtube";
        playlists = await this.retrievePlaylists();

        // Here, create a new account using account class
        return new Account(playlists, platform, this.token, {});
    }

    generateYoutubeQuery(name, artists) {
        const trackName = new CleanString(name).clean().str.split(' ').join("%20");
        const artist = new CleanString(artists[0]).clean().str.split(' ').join("%20");
        return trackName+' '+artist;
    }

    async firstSearchResult(name, artists) {
        const query = this.generateYoutubeQuery(name, artists);
        const resultOne = await super.firstSearchResult(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&order=relevance&q=${query}&type=video`)
        if (resultOne) return resultOne;
        const trackName = new CleanString(name).clean().str.split(' ').join("%20");
        return await super.firstSearchResult(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&order=relevance&q=${trackName}&type=video`);
    }

    parseTracksFromSearch(jsonData) {
        return jsonData.items.map(item => new Track(item.snippet.title, "Youtube", this.extractArtists(item.snippet.title, item.snippet.channelTitle), {resourceId: { kind: item.id.kind, videoId: item.id.videoId }}));
    }

    async retrievePlaylists() {
        var playlists = await super.retrievePlaylists(`https://www.googleapis.com/youtube/v3/playlists?part=id&part=snippet&part=contentDetails&mine=true&maxResults=50`);
        // Add the liked playlist too
        playlists.unshift(new Playlist("liked-videos", "Liked Videos", "Youtube", { liked: true }));
        return playlists;
    }

    parsePlaylists(jsonData) {
        return jsonData.items.map(item => new Playlist(item.id, item.snippet.title, "Youtube", {numTracks: item.contentDetails ? item.contentDetails.itemCount : null}));
    }

    // extractArtists : String String -> [List-of Artists]
    // Extracts the likely names of artists using _channelName_ and _trackName_
    extractArtists(trackName, channelName) {
        // mainArtist : String -> String
        // Provides the name 
        let mainArtists = (trackName) => {
            const endingIndex = trackName.indexOf(' - ');
            if (endingIndex !== -1) return [trackName.substr(0, endingIndex)];
            return [];
        };

        // features : String -> [List-of String]
        // Provides an array of any features on the song
        let features = (trackName) => {

            // Possible starts of features
            const featureStrings = ['(feat. ', 'feat. ', '(ft. ', 'ft. '];
            // Attempt to find a feature start in the track name
            const potentialFeatureIndices = featureStrings.map(str => trackName.indexOf(str));

            const length = potentialFeatureIndices.length;
            
            // Search for a substring of features for each potential feature string
            for (let i = 0; i < length; i++) {

                const featureString = featureStrings[i];
                const beginningIndex = potentialFeatureIndices[i];
                
                // Add the length to the string so that the substring starts at the end of the feature introduction, not the beginning
                if (beginningIndex !== -1) {
                    // Determine ending index so 
                    var endingIndex;
                    if (featureString === '(feat. ' || featureString === '(ft. ') {
                        endingIndex = trackName.indexOf(')');
                    } else {
                        endingIndex = trackName.length;
                    }
                    return trackName.substring(beginningIndex + featureStrings[i].length, endingIndex).split(', ');
                }

            }

            return [];

        };

        console.log(trackName, features(trackName));

        return [].concat([channelName], mainArtists(trackName), features(trackName));
    }

    async retrievePlaylistTracks(playlistId) {
        if (playlistId === 'liked-videos') {
            // retrieveLikedTracksAccum : [List-of Tracks] String -> [List-of Tracks]
            // Given an initial list of _tracks_, adds on the remaining tracks from _endpoint_ (if one is given)
            // ACCUMULATOR: _tracks_ represents the tracks collected so far
            // ACCUMULATOR: _endpoint_ represents the endpoint provided by the previous response
            const retrieveLikedTracksAccum = async (tracks, endpoint) => {
                // If the end of the tracks has not been reached, fetch the next batch of tracks & recur
                if (endpoint) {
                    const jsonData = await this.retrieveLikedTracks(endpoint);
                    const nextEndpoint = jsonData.nextPageToken ? `https://www.googleapis.com/youtube/v3/videos?part=snippet&myRating=like&maxResults=50&pageToken=${jsonData.nextPageToken}` : null;
                    return retrieveLikedTracksAccum(tracks.concat(this.parseTracksFromLikedVideos(jsonData)), nextEndpoint);
                } else {
                    return tracks;
                }
            }
    
            // Retrieves the first tracks (up to 100)
            const jsonData = await this.retrieveLikedTracks(`https://www.googleapis.com/youtube/v3/videos?part=snippet&myRating=like&maxResults=50`);
            const initialTracks = this.parseTracksFromLikedVideos(jsonData);
            const nextEndpoint = jsonData.nextPageToken ? `https://www.googleapis.com/youtube/v3/videos?part=snippet&myRating=like&maxResults=50&pageToken=${jsonData.nextPageToken}` : null;
    
            return retrieveLikedTracksAccum(initialTracks, nextEndpoint);
        } else {

            // retrievePlaylistTracksAccum : [List-of Tracks] String -> [List-of Tracks]
            // Given an initial list of _tracks_, adds on the remaining tracks from _endpoint_ (if one is given)
            // ACCUMULATOR: _tracks_ represents the tracks collected so far
            // ACCUMULATOR: _endpoint_ represents the endpoint provided by the previous response
            const retrievePlaylistTracksAccum = async (tracks, endpoint) => {
                // If the end of the tracks has not been reached, fetch the next batch of tracks & recur
                if (endpoint) {
                    const jsonData = await super.retrievePlaylistTracks(endpoint);
                    const nextEndpoint = jsonData.nextPageToken ? `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50&pageToken=${jsonData.nextPageToken}` : null;
                    return retrievePlaylistTracksAccum(tracks.concat(this.parseTracksFromPlaylist(jsonData)), nextEndpoint);
                } else {
                    return tracks;
                }
            }
    
            // Retrieves the first tracks (up to 100)
            const jsonData = await super.retrievePlaylistTracks(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50`);
            const initialTracks = this.parseTracksFromPlaylist(jsonData);
            const nextEndpoint = jsonData.nextPageToken ? `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50&pageToken=${jsonData.nextPageToken}` : null;
    
            return retrievePlaylistTracksAccum(initialTracks, nextEndpoint);
        }
    }

    async retrieveLikedTracks(endpoint) {
        try {
            const response = await fetch(endpoint, this.requestOptions('GET'));
            if (response.ok) {
                return await response.json();
            } else {
                console.log(response.status);
                throw new Error ('Error: '+response.status)
            }

        }
        catch (err) {
            throw new Error (err.message);
        }

    }
    
    parseTracksFromPlaylist(jsonData) {
        return jsonData.items.map(item => new Track(item.snippet.title, "Youtube", this.extractArtists(item.snippet.title, item.snippet.videoOwnerChannelTitle), {resourceId: item.snippet.resourceId}));
    }

    parseTracksFromLikedVideos(jsonData) {
        return jsonData.items.map(item => new Track(item.snippet.title, "Youtube", this.extractArtists(item.snippet.title, item.snippet.channelTitle), {resourceId: {kind: item.kind, videoId: item.id}}));
    }

    async createPlaylist(name, tracks, playlistNames) {
        return await super.createPlaylist(name, tracks, playlistNames, `https://www.youtube.com/playlist?list=`);
    }

    async initializePlaylist(name, playlistNames) {
        var body = JSON.stringify({"snippet":{"title":name,"description":`Playlist created from ${playlistsString(playlistNames)}`}});
        var endpoint = `https://www.googleapis.com/youtube/v3/playlists?part=snippet`;
        return await super.initializePlaylist(body, endpoint);
    }

    async addTracksToPlaylist(playlistId, tracks) {

        if (tracks.length > 500) {
            throw new Error ('The resulting playlist can only contain a maximum of 500 tracks. Yours contained '+tracks.length+' tracks.');
        }

        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer "+this.token);
        myHeaders.append("Content-Type", "application/json");

        const addTracksHelper = async (index) => {
            if (tracks.length === index) {
                // End recursion
                return; 
            } else {
                var body = JSON.stringify({"snippet":{"playlistId":playlistId,"resourceId":tracks[index].resourceId}});
                var requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body,
                    redirect: 'follow'
                };
                console.log(body);
                try {
                    await fetch("https://www.googleapis.com/youtube/v3/playlistItems?part=snippet", requestOptions);
                } catch (err) {
                    throw new Error(error.message);
                }
                finally {
                    await addTracksHelper(++index);
                }
            }
        }
        // Initialize recursion & accumulator
        await addTracksHelper(0);
    }

}

export default apiInterface;