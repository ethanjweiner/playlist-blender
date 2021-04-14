<template>
  <div id="head">
    <div class="p-3 d-flex-row" id="top-div">
      <div class="mx-md-5 mx-2 mb-3 pt-3">
        <h1 class="text-left mt-md-3 d-lg-inline mb-3 mr-lg-5">
          PLAYLIST BLENDER
        </h1>
        <div class="d-inline mx-lg-3">
          <router-link :to="{ name: 'Home' }" class="btn btn-secondary d-inline"
            >Home</router-link
          >
          <router-link
            :to="{ name: 'Privacy Policy' }"
            class="btn btn-light d-inline mx-2"
            >Privacy Policy</router-link
          >
        </div>
      </div>
    </div>
  </div>
  <router-view />
</template>

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
</style>
