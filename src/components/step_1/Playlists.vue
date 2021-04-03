<template>
  <ul
    v-if="account.playlists"
    class="list-group list-group-flush"
    :class="account.platform"
  >
    <a
      class="list-group-item list-group-item-action"
      v-for="playlist in account.playlists"
      :class="playlist.selected ? 'selected' : null"
      :key="playlist.id"
      @click="togglePlaylist(playlist.id, index)"
    >
      <div class="row">
        <div class="col-10">
          <span class="d-block">
            {{ playlist.name }}
          </span>
          <span v-if="playlist.numTracks" style="font-size: 12px">
            {{ playlist.numTracks }} tracks
          </span>
          <span v-else style="font-size: 12px">Your liked videos</span>
        </div>
        <div class="col-2">
          <span
            class="material-icons"
            v-if="playlist.selected"
            style="right: 10px"
            >check</span
          >
        </div>
      </div>
    </a>
  </ul>
</template>

<script>
import { inject } from "vue";
export default {
  name: "Playlists",
  props: ["account", "index"],
  setup(props) {
    const store = inject("store");
    const { togglePlaylist } = store;

    return { togglePlaylist };
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/global.scss";
/* Create classes used conditionally for different platforms */
a {
  cursor: pointer;
}
.Spotify {
  color: $spotify-green;
  a.selected {
    color: $spotify-green;
  }
}
.Youtube {
  a.selected {
    color: $youtube-red;
  }
}
</style>
