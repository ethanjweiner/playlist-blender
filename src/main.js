
import { createApp } from "vue";
import App from "./App.vue";
import store from "./store.js";
import { tokenActive } from "./mixins/helpers";

import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "material-design-icons";

const app = createApp(App)
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