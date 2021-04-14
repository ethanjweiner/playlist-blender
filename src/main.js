
import { createApp } from "vue";
import App from "./App.vue";
import store from "./store.js";
import { tokenActive, getHashParams, removeHashParams } from "./mixins/helpers";
import apiInterface from "./mixins/APIRequest";

import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "material-design-icons";
import router from './router'

const app = createApp(App).use(router)
app.mount("#app");

// APP & ACCOUNT SETUP

store.resetState();
// Retrieve accounts if locally stored and token still active
const storedAccounts = localStorage.getItem("accounts") ? JSON.parse(localStorage.getItem("accounts")) : null;

if (storedAccounts)
    store.setAccounts(storedAccounts.filter(account => tokenActive(account)));

// ERROR HANDLING
// Handle global vue errors
app.config.errorHandler = (error) => {
    console.log(error);
    store.setErrorMessage(error.message);
}

// Hash params

const hashParams = getHashParams();

// Access_token hash params signifies authentication just completed, so add account
if (hashParams.access_token) {
  let platform;
  switch (hashParams.state) {
    case "spotify-request":
      platform = "Spotify";
      break;
    case "youtube-request":
      platform = "Youtube";
      break;
    default:
      "Improper state";
  }
  const apiRequest = apiInterface(platform, hashParams.access_token);
  apiRequest.getAccount().then((newAccount) => {
    store.addAccount(newAccount);
    store.updateLocalAccounts();
    removeHashParams();
  });
  router.push({ name: "Blend" });
}

// Handle any other errors
window.onerror = (message, url, lineNo, columnNo, error) => {
    store.setErrorMessage(error.message);
};






/* 

Data Definitions

LOOSE definitions of data types that I use throughout this project

In the future: Create classes for all different data types

An Account is one of:
- SpotifyAccount
- YoutubeAccount



*/