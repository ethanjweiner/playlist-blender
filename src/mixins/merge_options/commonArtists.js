

import stringSimilarity from "string-similarity";
import apiInterface from "@/mixins/APIRequest";
import {CleanString} from "../builderClasses";
import { removeDuplicateArtists, removeDuplicateTracks, grabTracks } from "../helpers";
import * as setFunctions from "../setFunctions";

const MIN_SIMILARITY = 0.8;

// A [List-of Artists] is an array that can contain:
// - directNames (name directly gotten from the artist/channel name)
// - parsedNames (name parsed from the title of the track)
// "parsedName" is important for platforms where the artist/channel name might not be accurate
// -- e.g. Youtube 

// commonTracksByArtist : String String Playlists Number -> [List-of Tracks]
// Provides all the tracks in (_platform_), which:
// 1. Are contained in _playlists_
// 2. The artist of which is common to at least _minCommon_ playlists
const commonTracksByArtist = async (platform, token, playlists, minCommon) => {
  // 1. Generate a list of common artists
  const _commonArtists = await commonArtists(playlists, minCommon);

  const allTracks = grabTracks(playlists);

  // 2. Filter all tracks so that they include those who contain an artist in _commonArtists
  const commonTracksByArtist = allTracks.filter(track => shareArtist(_commonArtists, track.artists));

  var tracksInPlatform = [];

  // 3. Get all the tracks that were found ready for posting (in the correct platform)
  for (const track of commonTracksByArtist) {
    // If the tracks only showed up in a different platform, search for the tracks in the desired platform
    const trackToAdd = track.platform === platform ? track : await apiInterface(platform, token).firstSearchResult(track.name, track.artists);
    if (trackToAdd) tracksInPlatform.push(trackToAdd);
  }

  // 4. Remove duplicate tracks
  return removeDuplicateTracks(tracksInPlatform);
};

// commonArtists: String String Playlists Number -> [List-of Tracks]
// Provides all the artists (in _platform_) that are common to at least _minCommon_ playlists
const commonArtists = async (playlists, minCommon) => {
  // Generate all possible combinations among the playlists (nested foreach loops? should we use a matrix?) --- Cartesian Product

  // For each combination, check if that combination is a "commonArtist" combination
  // If so, add this artist (the first one in the combination) to _commonTracks_, else continue
  var commonArtists = [];

  const artistArrays = playlists.map(playlist => 
    // 3. Remove duplicate artists in one playlist
    removeDuplicateArtists(
    // 1. Grab the artists for each track in playlist (each track should already have the artists parsed)
    playlist.tracks.map(track => track.artists)
    // 2. Concatenate each [List-of Artists] onto an accumulator, to create a list of all artists in the playlists
    .reduce((acc, curr) => acc.concat(curr), [])));

  const sets = setFunctions.products(artistArrays, minCommon);

  for (let i = 0; i < sets.length; i++) {
    if (allArtistsSimilar(sets[i])) {
      const artistToAdd = sets[i][0];
      if (artistToAdd && !commonArtists.includes(artistToAdd)) commonArtists.push(artistToAdd);
    }
  }

  if (!commonArtists.length) {
    throw new Error ("No common artists were found.");
  }

  console.log("Common Artists Found: ", commonArtists);

  return commonArtists;
};

// allArtistsSimilar : [List-of Artists] -> Boolean
// Determines if all artists are similar enough to be added to the intersection
// ** All similarity comparisons are made with reference to the first artist in the subset
const allArtistsSimilar = (artists) => {
  // My version of "ormap"
  const referenceArtist = artists[0];
  const artistsToCompare = artists;
  artistsToCompare.shift();
  
  return artistsToCompare.reduce((acc, artist) => {
    if (!isSimilar(referenceArtist, artist)) {
      acc = false;
    }
    return acc;
  }, true);
};

// isSimilar: Artist Artist -> Boolean
// Is _artist1_ similar enough to _artist2_ to add it to the list of common artists?

const isSimilar = (artist1, artist2) => {
  if (artist1 && artist2) {
    const artist1Str = new CleanString(artist1).clean().str;
    const artist2Str = new CleanString(artist2).clean().str;
  
    let stringsEqual = artist1Str === artist2Str;
    let stringsOverlap = artist1Str.length > 4 && artist2Str.length > 4 && (artist1Str.includes(artist2Str) || artist2Str.includes(artist1Str));
    let stringsSimilar = (artist1Str && artist2Str) ? stringSimilarity.compareTwoStrings(artist1Str, artist2Str) > MIN_SIMILARITY : false;
  
      // If tracks are not from the same platform, try to find some similarity
    return (stringsEqual || stringsSimilar || stringsOverlap);
  }

}

const containsArtist = (artistsArray, artistCmp) => {
  for (const artist of artistsArray) {
    if (isSimilar(artist, artistCmp)) {
      return true;
    }
  }
  return false;
}

// shareArtist : [List-of Artists] [List-of Artists] -> Boolean
// Does _artistsArray1_ share at least one artist with _artistsArray2_?
const shareArtist = (artistsArray1, artistsArray2) => {
  for (const artist of artistsArray2) {
    if (containsArtist(artistsArray1, artist)) {
      return true;
    }
  }
  return false;
}

export default commonTracksByArtist;