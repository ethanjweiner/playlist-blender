// Most of the logic comes in here

import apiInterface from "./APIRequest";
import commonTracksByTitle from "./merge_options/commonTracks";
import commonTracksByArtist from "./merge_options/commonArtists";
import union from "./merge_options/union";
import store from "../store";

// main : Account String -> ...
// Using the playlists selected in options, posts new playlist with the merged tracks
const main = async (destinationAccount, destinationName) => {

  const {state} = store;

  if (state.selectedPlaylists.length < 2) {
      throw new Error ("You must select at least 2 playlists to merge.");
  }

  if (state.selectedPlaylists.length > 5) {
      throw new Error ("You can only select at most 5 playlists. You selected "+state.selectedPlaylists.length+".");
  }

  store.toggleLoading();

  // Use the playlists, destination account info, & merge option to determine the tracks to post
  const playlistsToMerge = await playlistsWithTracks(state.selectedPlaylists);

  const tracksToPost = await merge({
      mergeOption: state.mergeOption,
      platform: destinationAccount.platform,
      token: destinationAccount.token,
      playlistsToMerge: playlistsToMerge,
      minCommon: state.minCommon
  });

  // Post the tracks on a newly created playlist
  const destinationRequest = apiInterface(destinationAccount.platform, destinationAccount.token, destinationAccount.id);
  try {
      const {url} = await destinationRequest.createPlaylist(destinationName, tracksToPost, playlistsToMerge.map(playlist => playlist.name));
      store.setDestinationUrl(url);
      store.toggleMerged();
  } catch (err) {
      store.toggleLoading();
      throw new Error (err.message);
  } finally {
      store.toggleLoading();
  }

}

// playlistsWithTracks : [List-of Playlists (Without Tracks)] -> [List-of Playlists (With Tracks)]
// Provides the inputted _playlists_ with their respective _tracks_ uploaded onto them
const playlistsWithTracks = async (playlists) => {
  var updatedPlaylists = [];

  for (var playlist of playlists) {
      const request = apiInterface(playlist.platform, playlist.token);
      let tracks = await request.retrievePlaylistTracks(playlist.id);
      updatedPlaylists.push({ ...playlist, tracks });
  }
  return updatedPlaylists;
}

// merge : String String Playlists -> [List-of Tracks]
// Given _playlistsToMerge_, generates a new list of tracks in _platform_ (to be posted in new playlist) based on _mergeOption_
const merge = async ({ mergeOption, platform, token, playlistsToMerge, minCommon }) => {
  switch (mergeOption) {
    case "common-songs" : return await commonTracksByTitle(platform, token, playlistsToMerge, minCommon); // Provide a better _minCommon_ at some point
    case "common-artists" : return await commonTracksByArtist(platform, token, playlistsToMerge, minCommon);
    case "union" : return await union(platform, token, playlistsToMerge);
    default: []
  }
}

// Parse parameters from hash for authentication purposes
const getHashParams = () => {
    const hashParams = {};
    const r = /([^&;=]+)=?([^&;]*)/g;
    const q = window.location.hash.substring(1);
    let e = r.exec(q);
    while (e) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
      e = r.exec(q);
    }
    return hashParams;
};

const removeHashParams = () => { 
  var uri = window.location.toString(); 

  if (uri.indexOf("#") > 0) { 
      var clean_uri = uri.substring(0,  
                      uri.indexOf("#")); 

      window.history.replaceState({},  
              document.title, clean_uri); 
      }
};

// tokenActive : Account -> Boolean
// Is the token of _account_ still active (hasn't yet expired)?
const tokenActive = (account) => {
  const differenceInMs = Date.now()-account.dateAdded;
  const differenceInMins = differenceInMs/60000;
  return (differenceInMins<60);
};

// playlistsString : [List-of String] -> String
// Reduces the strings in _playlistNames_ to a singular string with all the playlist names
const playlistsString = (playlistNames) => {
  let str = "";
  for (let i=0; i<playlistNames.length; i++) {
      // Add a comma for any playlists in between
      if (i!==0 && i!==playlistNames.length-1) {
          str+=', ';
      }
      // Add an & symbol in front of the last playlist
      if (i==playlistNames.length-1) {
          str+=' & '
      }
      // Add the actual name for all playlists
      str+= playlistNames[i];
  }
  return str;
}

// includesTrack : [List-of Track] Track -> Boolean
// Does _arr_ already contain _trackCmp_?
const includesTrack = (arr, trackCmp) => {
  // areSameTrack : Track Track -> Boolean
  // Do _track1_ and _track2_ contain the same contents?
  const areSameTrack = (track1, track2) => {
    return track1.name === track2.name && track1.platform === track2.platform;
  }

  for (const track of arr) {
    if (areSameTrack(track, trackCmp)) {
      return true;
    }
  }
  return false;
}

// removeDuplicateTracks : [List-of Track] -> [List-of Track]
// Removes duplicates tracks from _arr_
const removeDuplicateTracks = (arr) => {
  const length = arr.length;
  // Accumulator: _newArray_ represents the array without duplicates, and increases in length as _arr_ is iterated over
  // Accumulator: _index_ represents the current index of _arr_
  // Terminator statement: _index_ increases on the recursive call, and thus will eventually equal _length_
  const removeDuplicatesAccum = (newArray, index) => {
    if (index === length) {
      return newArray;
    }
    // If item is not already in array, add it to the new one
    if (!includesTrack(newArray, arr[index])) {
    	newArray.push(arr[index]);
    }
    return removeDuplicatesAccum(newArray, ++index);
  }
  return removeDuplicatesAccum([], 0);
}

// removeDuplicateArtists : [List-of String] -> [List-of String]
const removeDuplicateArtists = (arr) => {
  const length = arr.length;
  // Accumulator: _newArray_ represents the array without duplicates, and increases in length as _arr_ is iterated over
  // Accumulator: _index_ represents the current index of _arr_
  // Terminator statement: _index_ increases on the recursive call, and thus will eventually equal _length_
  const removeDuplicatesAccum = (newArray, index) => {
    if (index === length) {
      return newArray;
    }

    // If item is not already in array, add it to the new one
    if (!newArray.includes(arr[index])) {
    	newArray.push(arr[index]);
    }
    return removeDuplicatesAccum(newArray, ++index);
  }
  return removeDuplicatesAccum([], 0);
}

// grabTracks : [List-of Playlists] -> [List-of Tracks]
// get an array of ALL tracks from all _playlists_
const grabTracks = (playlists) => playlists.map(playlist => playlist.tracks).reduce((acc, curr) => acc.concat(curr), []);

// Change default toString method of arrays
Array.prototype.toString = function() {
  var str = ""
  this.forEach(element => {
    str += element.toString()+" ";
  });
  return str;
};


export {main, getHashParams, removeHashParams, union, playlistsString, merge, playlistsWithTracks, removeDuplicateTracks, removeDuplicateArtists, tokenActive, grabTracks, includesTrack};