import apiInterface from "@/mixins/APIRequest";
import { removeDuplicateTracks, grabTracks } from "../helpers";

const MAX_TRACKS = 800;

const union = async (platform, token, playlists) => {
  const allTracks = grabTracks(playlists);

  if (allTracks.length > MAX_TRACKS)
    throw new Error(
      "You tried to merge more 800 tracks. Please select smaller-sized playlists."
    );

  var tracksInPlatform = [];

  for (const track of allTracks) {
    // If the tracks only showed up in a different platform, search for the tracks in the desired platform
    const trackToAdd =
      track.platform === platform
        ? track
        : await apiInterface(platform, token).firstSearchResult(
            track.name,
            track.artists
          );
    if (trackToAdd) tracksInPlatform.push(trackToAdd);
  }

  if (!tracksInPlatform.length) {
    throw new Error("Your playlists did not contain any tracks.");
  }
  // 4. Remove duplicate tracks
  return removeDuplicateTracks(tracksInPlatform);
};

export default union;
