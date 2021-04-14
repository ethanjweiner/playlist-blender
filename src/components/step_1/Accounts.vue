<template>
  <div class="accounts row">
    <Account
      v-for="(account, index) in state.accounts"
      :key="index"
      :account="account"
      :index="index"
    />
    <div class="add-account col-sm-12 col-md-6 col-lg-4 p-2 p-md-3 p-lg-4">
      <button
        class="btn btn-outline-warning"
        id="add-account-button"
        @click="addAccount({})"
      >
        <span class="material-icons d-block" style="font-size: 50px">
          add_circle_outline
        </span>
        <span>Add Account</span>
      </button>
    </div>
    <div
      class="inline-block"
      id="selected-playlists"
      v-if="state.selectedPlaylists.length"
    >
      <hr style="color: white" />

      <h6>Selected Playlists:</h6>
      <ul>
        <li v-for="(playlist, index) in state.selectedPlaylists" :key="index">
          <img
            v-if="playlist.platform === 'Spotify'"
            src="@/assets/images/Spotify_Logo.png"
            alt=""
            width="15"
          />
          <img
            v-if="playlist.platform === 'Youtube'"
            src="@/assets/images/Youtube_Music_Logo.png"
            alt=""
            width="18"
          />
          {{ playlist.name }}
        </li>
      </ul>
      <hr style="color: white" />
    </div>
  </div>
</template>

<script>
import store from "@/store.js";
import Account from "./Account";
import { computed, inject } from "vue";

import { getHashParams, removeHashParams } from "@/mixins/helpers.js";
import apiInterface from "@/mixins/APIRequest";
import { ref } from "vue";

export default {
  name: "Accounts",
  components: {
    Account,
  },
  setup() {
    const store = inject("store");
    const { addAccount, updateLocalAccounts, state } = store;

    return { state, addAccount };
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/global.scss";

.accounts {
  justify-content: left;
}
#add-account-button {
  height: 18rem;
  @media (max-width: 767.98px) {
    height: 8rem;
  }
  width: 100%;
  font-size: 30px;
  color: $main-yellow;
  border: 3px solid $main-yellow;
  background: transparent !important;
  &:hover {
    background: $main-yellow !important;
    color: $main-gray !important;
  }
}
#selected-playlists {
  color: white;
}
</style>