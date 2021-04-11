<template>
  <div id="head">
    <div class="p-3" id="top-div">
      <h1 class="text-center">PLAYLIST BLENDER</h1>
    </div>
  </div>
  <div class="main mx-3 mx-sm-4 mx-md-5">
    <div v-if="!state.merged">
      <div>
        <div class="mt-5 row mb-3">
          <div class="inline-block">
            <h3 class="p-2 px-4 rounded">
              Step 1: Add Accounts & Select Playlists
            </h3>
          </div>
        </div>
        <Accounts />
      </div>
      <div v-if="state.accounts.length">
        <div class="mt-4 row mb-3">
          <div class="inline-block">
            <h3 class="p-2 px-4 rounded">
              Step 2: Select Your Blending Options
            </h3>
          </div>
        </div>
        <Options />
      </div>
      <div>
        <div
          class="d-grid gap-2 col-12 col-md-5 mx-auto mt-4 mt-md-5"
          v-if="readyToMerge"
        >
          <button
            type="button"
            class="btn btn-lg mx-3 main-button"
            @click="main(state.destinationAccount, state.destinationName)"
          >
            Blend!
          </button>
        </div>
      </div>
    </div>
    <div v-else class="flex-grow-1">
      <PostMerge />
    </div>
    <div id="loading-screen" class="align-items-center" v-if="state.loading">
      <div class="spinner-border text-warning d-block" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="d-block">Note: large playlists can take a while.</p>
    </div>

    <div class="modal" id="error-modal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content bg-danger" style="margin-top: 100px">
          <div class="modal-header">
            <h5 class="modal-title">Error</h5>
            <button
              type="button"
              class="btn-close bg-white"
              data-bs-dismiss="modal"
              aria-label="Close"
              @click="setErrorMessage('')"
            ></button>
          </div>
          <div class="modal-body text-white">
            <p>{{ errorMessage }}</p>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
              @click="setErrorMessage('')"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import store from "./store.js";
import Accounts from "./components/step_1/Accounts";
import Options from "./components/step_2/Options";
import PostMerge from "./components/post_merge/PostMerge";
import { computed, onMounted, provide, ref, watch } from "vue";
import { main } from "./mixins/helpers";
import * as bootstrap from "bootstrap";

export default {
  name: "App",
  components: {
    Accounts,
    Options,
    PostMerge,
  },
  setup() {
    provide("store", store);
    const { state, errorMessage, setErrorMessage } = store;
    const readyToMerge = computed(() => {
      return state.destinationAccount && state.destinationName;
    });

    // After mount, watch for errors & display accordingly
    onMounted(() => {
      watch(errorMessage, (message, prevMessage) => {
        var errorModal = new bootstrap.Modal(
          document.getElementById("error-modal"),
          {}
        );
        if (errorMessage.value) {
          errorModal.show();
        } else {
          store.stopLoading();
        }
      });
    });

    return { state, readyToMerge, main, errorMessage, setErrorMessage };
  },
};
</script>

<style lang="scss">
@import "./assets/styles/global.scss";

#app {
  background-color: $main-gray;
  min-height: 100vh;
  padding-bottom: 100px;
}
h1 {
  color: $main-gray;
}
h3 {
  background-color: $main-yellow;
  color: $main-gray;
  letter-spacing: 2px;
  display: inline-block;
  box-shadow: 5px 5px white;
}

#head {
  border-bottom: 30px solid transparent;
  border-image: url("./assets/images/Border.png") 9% round;
}
#top-div {
  background-color: $main-yellow;
}
.main-button {
  background-color: $main-yellow !important;
  &:hover {
    background-color: darken($main-yellow, 10) !important;
    color: white !important;
  }
}
.btn-lg {
  height: 4rem !important;
  font-size: 30px !important;
  box-shadow: rgb(255, 255, 255) 5px 5px 10px;
  &:hover {
    box-shadow: rgb(255, 255, 255) 5px 5px 20px;
  }
}
#loading-screen {
  width: 100%;
  height: 100%;
  background-color: rgba(30, 30, 30, 0.7);
  z-index: 10;
  top: 0;
  left: 0;
  position: fixed;
  .spinner-border {
    margin: 0 auto;
    margin-top: 35vh;
    width: 10rem;
    height: 10rem;
  }
  p {
    width: 10rem;
    color: $main-yellow;
    margin: auto;
    margin-top: 20px;
  }
}
#error-screen {
  width: 100%;
  height: 100%;
  z-index: 10;
  top: 0;
  left: 0;
  position: fixed;
  padding: 0px;
  background-color: rgba(30, 30, 30, 0.7);
  .alert {
    width: 80%;
    margin: auto;
    h4 {
      color: $main-gray;
    }
  }
}
#error {
  display: fixed;
  position: relative;
}
</style>
