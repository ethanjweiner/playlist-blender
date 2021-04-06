import stringSimilarity from "string-similarity";
import apiInterface from "@/mixins/APIRequest";
import {CleanString, Track} from "../builderClasses";
import {removeDuplicateTracks} from "../helpers";
import * as setFunctions from "../setFunctions";

const MIN_SIMILARITY = 0.5;

// commonTracksByTitle : String String Playlists Number -> [List-of Tracks]
// Provides all the tracks (in _platform_) that are common to at least _minCommon_ playlists
const commonTracksByTitle = async (platform, token, playlists, minCommon) => {
  var t0 = performance.now();
  
  var commonTracks = [];

  const trackArrays = playlists.map(playlist => playlist.tracks);
  const sets = setFunctions.products(trackArrays, minCommon);

  for (let i = 0; i < sets.length; i++) {
    if (allTracksSimilar(sets[i])) {
      const trackToAdd = await parseTrack(sets[i], platform, token);
      if (trackToAdd) commonTracks.push(trackToAdd);
    }
  }

  if (!commonTracks.length) {
    throw new Error ("No common tracks were found.");
  }

  var t1 = performance.now();

  console.log("Common Tracks Found: ", commonTracks);
  console.log("Performance time: "+(t1 - t0)+'ms');

  return removeDuplicateTracks(commonTracks);

}

// parseTrack : [List-of Tracks] String String -> Track
// Provides the version of the track in _tracks_ that is in _pllatform_
// Assumption: All tracks are similar
const parseTrack = async (tracks, platform, token) => {
  const candidate = tracks.find(track => track.platform === platform);
  // If the tracks only showed up in a different platform, search for the tracks in the desired platform
  console.log(tracks);
  return candidate ? candidate : await apiInterface(platform, token).firstSearchResult(tracks[0].name, tracks[0].artists);
}

// allTracksSimilar : [List-of Tracks] -> Boolean
// Determines if all  _tracks_ are similar enough (by name) to be added to the intersection
// ** All similarity comparisons are made with reference to the first track in the subset
const allTracksSimilar = (tracks) => {
  // My version of "andmap" (all tracks must be similar)
  const referenceTrack = tracks[0];
  const tracksToCompare = tracks;
  tracksToCompare.shift();

  for (const track of tracksToCompare) {
    if (!isSimilar(referenceTrack, track)) {
      return false;
    }
  }
  
  return true;
};

// isSimilar : Track Track -> Boolean
// Is the name of _track1_ similar enough to _track2_ to add it to the intersected playlist?
const isSimilar = (track1, track2) => {
  const nameShared = shareName(track1, track2);
  const artistShared = shareArtist(track1, track2);
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