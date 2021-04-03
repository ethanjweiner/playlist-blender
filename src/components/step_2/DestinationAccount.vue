<template>
  <div class="card rounded">
    <div class="card-body p-0 rounded">
      <ul class="list-group">
        <div v-for="account in availableAccounts">
          <a
            class="list-group-item list-group-item-action text-white"
            :class="account.isDestination ? 'selected' : null"
            @click="toggleDestination(account.token)"
          >
            <div class="row" style="height: 100%">
              <div class="col-10">
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
                {{ account.name }}
                <span v-if="account.platform === 'Youtube'"
                  >Youtube Account #{{
                    youtubeAccountNumberHelper(account.token)
                  }}</span
                >
                <span class="text-muted"> ({{ account.platform }}) </span>
              </div>
            </div>
          </a>
        </div>
      </ul>
    </div>
  </div>
</template>

<script>
import { computed, inject } from "vue";
export default {
  name: "AccountOptions",
  props: ["account"],
  setup() {
    const store = inject("store");
    const { state, toggleDestination } = store;

    const availableAccounts = computed(() =>
      state.accounts.filter(
        (account) =>
          account.playlists &&
          account.playlists.find((playlist) => playlist.selected)
      )
    );

    const youtubeAccountNumber = (token) => {
      let number;
      const youtubeAccounts = state.accounts.filter(
        (account) => account.platform === "Youtube"
      );
      youtubeAccounts.forEach((account, index) => {
        if (account.token == token) {
          number = index + 1;
        }
      });
      return number;
    };

    const youtubeAccountNumberHelper = (token) => {
      let number;
      const youtubeAccounts = state.accounts.filter(
        (account) => account.platform === "Youtube"
      );
      youtubeAccounts.forEach((account, index) => {
        if (account.token == token) {
          number = index + 1;
        }
      });
      return number;
    };
    return {
      state,
      toggleDestination,
      youtubeAccountNumberHelper,
      availableAccounts,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/global.scss";
.card {
  height: 11rem;
  max-width: 500px;
  background: transparent;
}
img {
  margin-left: 10px;
  margin-right: 10px;
  width: 20px;
}
.list-group {
  cursor: pointer;
  background: transparent;
  .list-group-item {
    background: transparent;
  }
  .selected {
    background: $main-yellow;
    color: $main-gray !important;
  }
}
.card-body {
  background: transparent;
  overflow: scroll;
  overflow-x: hidden;
  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: gray;
    &:hover {
      background: $main-yellow;
    }
  }
  border: 3px dashed $main-yellow;
}
</style>