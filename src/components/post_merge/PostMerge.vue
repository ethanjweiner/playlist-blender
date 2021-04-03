<template>
  <div id="post-merge">
    <div class="mt-5 mx-5 row mb-3">
      <h1 class="p-2 px-4 rounded text-center">Merge Complete!</h1>
    </div>
    <div class="row mx-5 mt-5 mb-5 px-md-5 text-center">
      <a
        :href="state.destinationUrl"
        target="_blank"
        class="py-3 bg-white rounded"
        >Click here to go to your new playlist</a
      >
    </div>
    <div class="row mx-5 mt-5 mb-3 px-md-5">
      <button type="button" class="btn btn-lg" @click="resetState">
        <span class="material-icons"> replay </span>
        Merge again
      </button>
    </div>
  </div>
</template>

<script>
import store from "@/store.js";
import { inject } from "vue";

export default {
  name: "PostMerge",
  setup() {
    const store = inject("store");
    const { state, resetState } = store;
    return { state, resetState };
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/global.scss";
#post-merge {
  text-align: center !important;
}
h1 {
  color: $main-yellow;
  letter-spacing: 10px;
  font-size: 70px;
  text-shadow: 0px 5px 5px darken($main-yellow, 10) !important;
  @media (max-width: 768px) {
    font-size: 40px;
  }
}
h3 {
  color: $main-yellow;
}
button {
  background-color: $main-yellow !important;
  &:hover {
    box-shadow: rgb(255, 255, 255) 5px 5px 10px;
  }
}
.material-icons {
  font-size: 30px;
}
a {
  color: $main-gray;
  text-decoration: none;
  border: 5px solid $main-yellow;
}
</style>