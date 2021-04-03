<template>
  <div class="account col-sm-12 col-md-6 col-lg-4 p-1 p-md-3 p-lg-4">
    <div class="card">
      <div class="card-header" :class="account.platform">
        <div v-if="authenticated" class="d-inline">
          <img
            v-if="account.platform === 'Spotify'"
            src="@/assets/images/Spotify_Logo.png"
            alt=""
          />
          <img
            v-if="account.platform === 'Youtube'"
            src="@/assets/images/Youtube_Music_Logo.png"
            alt=""
          />
          <span v-if="account.platform === 'Spotify'">{{ account.name }}</span>
          <span v-if="account.platform === 'Youtube'"
            >Youtube Account #{{ youtubeAccountNumber(account.token) }}</span
          >
        </div>
        <span v-else>New Account</span>

        <span
          class="material-icons"
          @click="deleteAccount(index)"
          style="
            font-size: 20px;
            cursor: pointer;
            position: absolute;
            right: 7px;
          "
        >
          delete
        </span>
      </div>
      <div class="card-body p-0" :class="account.platform">
        <Platforms v-if="!authenticated" />
        <Playlists v-if="authenticated" :account="account" :index="index" />
        <!-- Send props to the playlist -->
      </div>
    </div>
  </div>
</template>

<script>
import { computed, inject, ref } from "vue";
import Platforms from "./Platforms";
import Playlists from "./Playlists";

import { getHashParams } from "@/mixins/helpers.js";
import { removeHashParams } from "../../mixins/helpers";

export default {
  name: "Account",
  props: ["account", "index"],
  components: {
    Platforms,
    Playlists,
  },
  setup(props) {
    const store = inject("store");
    const { deleteAccount, state } = store;
    const youtubeAccountNumber = (token) => {
      let number;
      const youtubeAccounts = state.accounts.filter(
        (account) => account.platform === "Youtube"
      );
      youtubeAccounts.forEach((account, index) => {
        if (account.token == token) {
          number = index++;
        }
      });
      return number;
    };
    const authenticated = ref(props.account.token);

    return { authenticated, deleteAccount, youtubeAccountNumber };
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/global.scss";

.card {
  height: 18rem;
}
.card-header {
  border: 3px dashed $main-yellow;
}
.card-body {
  overflow: scroll;
  overflow-x: hidden;
  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-track {
    background: white;
  }
  &::-webkit-scrollbar-thumb {
    background: gray;
    &:hover {
      background: $main-yellow;
    }
  }
  border: 3px dashed $main-yellow;
  border-top: 0;
}
.Spotify {
  border-color: $spotify-green;
  color: $spotify-green;
}
.Youtube {
  border-color: $youtube-red;
  color: $youtube-red;
}
img {
  margin-left: 10px;
  margin-right: 10px;
  width: 20px;
}
</style>
