import stringSimilarity from "string-similarity";
import apiInterface from "@/mixins/APIRequest";
import {CleanString, Track} from "../builderClasses";
import {removeDuplicateTracks} from "../helpers";
import * as setFunctions from "../setFunctions";

const MIN_SIMILARITY = 0.5;

// commonTracks: String String Playlists Number -> [List-of Tracks]
// Provides all the tracks (in _platform_) that are common to at least _minCommon_ playlists
const commonTracksByTitle = async (platform, token, playlists, minCommon) => {
  // Generate all possible combinations among the playlists (nested foreach loops? should we use a matrix?) --- Cartesian Product

  // For each combination, check if that combination is a "commonTrack" combination
  // If so, find the first track in that combination whose platform is _platform_
  // Add this track to _commonTracks_, else continue
  var commonTracks = [];

  const products = trackProducts(playlists);

  for (const combination of products) {
    let commonTrack = await findCommonTrack(combination, minCommon, platform, token);
    // Check for duplicate tracks here instead of later?
    if (commonTrack) commonTracks.push(commonTrack);
  }
  if (!commonTracks.length) {
    throw new Error ("No common tracks were found.");
  }

  return removeDuplicateTracks(commonTracks);

}

// trackProducts: [List-of Playlists] -> [List-of [List-of of Tracks]] 
// Finds ALL cross-products of the tracks in _playlists_
const trackProducts = (playlists) => {  
  const trackArrays = playlists.map(playlist => playlist.tracks);
  return setFunctions.cartesian(...trackArrays);
}

// findCommonTrack : [List-of Track] Number String String -> Track
// If there are _minCommon_ common tracks in _product_, return that track in _platform_
const findCommonTrack = async (product, minCommon, platform, token) => {
  let commonTrack;
  
  // Find the first combination where tracks are similar enough
  const sets = setFunctions.subsets(product, minCommon);
  
  for (let i = 0; i < sets.length; i++) {
    let currSet = sets[i]
    if (allTracksSimilar(currSet)) { // Enough tracks in the product are similar
      const candidate = currSet.find(track => track.platform === platform);

      // If the tracks only showed up in a different platform, search for the tracks in the desired platform
      commonTrack = candidate ? candidate : await apiInterface(platform, token).firstSearchResult(currSet[0].name, currSet[0].artists);
      // End looping here, because the product contains a common artist (so no other subsets of the combination must be iterated over)
      break;
    } 
  }
  return commonTrack;
}

// allTracksSimilar : [List-of Tracks] -> Boolean
// Determines if all  _tracks_ are similar enough (by name) to be added to the intersection
// ** All similarity comparisons are made with reference to the first track in the subset
const allTracksSimilar = (tracks) => {
  // My version of "andmap" (all tracks must be similar)
  const referenceTrack = tracks[0];
  const tracksToCompare = tracks;
  tracksToCompare.shift();

  return tracksToCompare.reduce((acc, track) => {
    if (!isSimilar(referenceTrack, track)) {
      acc = false;
    }
    return acc;
  }, true);
};

// isSimilar : Track Track -> Boolean
// Is the name of _track1_ similar enough to _track2_ to add it to the intersected playlist?
const isSimilar = (track1, track2) => {
  const nameShared = shareName(track1, track2);
  const artistShared = shareArtist(track1, track2);
  console.log(track1.name, track2.name, nameShared, artistShared);
  let basicSimilarity = (nameShared && artistShared);
  // If the track names are long enough, the artist is not necessary to get involved
  let exception = nameShared && track1.name.length > 10 && track2.name.length > 10;
  return (basicSimilarity || exception);
}

// shareArtist : Track Track -> Boolean
// Do _track1_ and _track2_ share at least one of the same artists?
const shareArtist = (track1, track2) => {
  for (const artist1 of track1.artists) {
    for (const artist2 of track2.artists) {
      let artistsSimilar = stringSimilarity.compareTwoStrings(artist1, artist2) > MIN_SIMILARITY;
      let artistsOverlap = artist1.includes(artist2) || artist2.includes(artist1);
      if (artistsSimilar || artistsOverlap) {
        return true;
      }
    }
  }
  return false;
}

// shareName : Track Track -> Boolean
// Do _track1_ and _track2_ share the same (or similar enough) a track name?
const shareName = (track1, track2) => {
  // For better comparison, clean the strings first using a String-builder class
  const track1Str = new CleanString(track1.name).clean().str;
  const track2Str = new CleanString(track2.name).clean().str;

  let stringsEqual = track1Str === track2Str;
  let stringsOverlap = track1Str.length > 4 && track2Str.length > 4 && (track1Str.includes(track2Str) || track2Str.includes(track1Str));
  let stringsSimilar = stringSimilarity.compareTwoStrings(track1Str, track2Str) > MIN_SIMILARITY;

    // If tracks are not from the same platform, try to find some similarity
  return (stringsEqual || stringsSimilar || stringsOverlap);

}

export default commonTracksByTitle;