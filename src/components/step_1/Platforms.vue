<template>
  <ul class="list-group list-group-flush">
    <a
      class="list-group-item list-group-item-action"
      @click="signInWithSpotify"
    >
      <img src="@/assets/images/Spotify_Logo.png" alt="" />
      Spotify
    </a>
    <a
      class="list-group-item list-group-item-action"
      @click="signInWithYoutube"
    >
      <img src="@/assets/images/Youtube_Music_Logo.png" alt="" />
      Youtube Music
    </a>
    <a class="list-group-item list-group-item-action text-muted" disabled>
      <img src="@/assets/images/SoundCloud_Logo.png" alt="" />
      Soundcloud (coming soon)
    </a>
    <!-- <a class="list-group-item list-group-item-action" disabled>
      <img src="@/assets/images/Apple_Music_Logo.png" alt="" />
      Apple Music (coming soon)
    </a> -->
  </ul>
</template>

<script>
import {
  spotifyAuthEndpoint,
  youtubeAuthEndpoint,
} from "@/mixins/authentication.js";
import { inject } from "vue";

export default {
  name: "Platforms",
  setup() {
    const store = inject("store");
    const signInWithSpotify = () => {
      store.updateLocalAccounts();
      window.location.href = spotifyAuthEndpoint;
    };
    const signInWithYoutube = () => {
      store.updateLocalAccounts();
      window.location.href = youtubeAuthEndpoint;
    };
    return { signInWithSpotify, signInWithYoutube };
  },
};
</script>

<style lang="scss" scoped>
a {
  cursor: pointer;
  color: black;
}
img {
  width: 30px;
  margin-right: 8px;
}
</style>
