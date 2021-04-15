<template>
  <div id="post-merge" style="margin: 75px">
    <div class="mt-5 row mb-3" style="margin-top: 100px">
      <h1 class="p-2 px-4 rounded text-center">Merge Complete!</h1>
    </div>
    <div class="row mt-5 mb-5 px-md-5 text-center">
      <a
        :href="state.destinationUrl"
        target="_blank"
        class="py-3 bg-white rounded"
        >Click here to go to your new playlist</a
      >
    </div>
    <!-- Switch this to a router link to blend -->
    <div class="row mt-5 mb-3 px-md-5">
      <button type="button" class="btn btn-lg" @click="mergeAgain">
        <span class="material-icons"> replay </span>
        Merge again
      </button>
    </div>
  </div>
</template>

<script>
import store from "../store";
import { inject } from "vue";
import { useRouter } from "vue-router";

export default {
  name: "Post Blend",
  setup() {
    const { state, resetState } = store;
    const router = useRouter();

    const mergeAgain = () => {
      resetState();
      router.push({ name: "Blend" });
    };
    return { state, mergeAgain };
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