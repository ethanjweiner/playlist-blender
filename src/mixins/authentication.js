const redirect_uri = "http://localhost:8080/";

// Spotify

const spotifyURL = "https://accounts.spotify.com/authorize";

const spotify_params = {
  client_id: "de52fa05d53949cdbb261b15a92b32a7",
  redirect_uri,
  scope:
    "playlist-modify-public%20playlist-modify-private%20playlist-read-private%20playlist-read-collaborative%20user-library-read",
  response_type: "token",
  state: "spotify-request",
  show_dialog: "true",
};

const spotifyAuthEndpoint =
  spotifyURL +
  "?" +
  "client_id=" +
  spotify_params.client_id +
  "&" +
  "redirect_uri=" +
  spotify_params.redirect_uri +
  "&" +
  "scope=" +
  spotify_params.scope +
  "&" +
  "response_type=" +
  spotify_params.response_type +
  "&" +
  "state=" +
  spotify_params.state +
  "&" +
  "show_dialog=" +
  spotify_params.show_dialog;

// Youtube

const youtubeURL = "https://accounts.google.com/o/oauth2/v2/auth";
const youtube_params = {
  client_id: "869201632360-fhof8amq34lht7nujhed6iji4hif3um9.apps.googleusercontent.com",
  redirect_uri,
  response_type: "token",
  scope:
    "https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fyoutube.readonly%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fyoutube",
  state: "youtube-request"
}

const youtubeAuthEndpoint =
  youtubeURL +
  "?" +
  "client_id=" +
  youtube_params.client_id +
  "&" +
  "redirect_uri=" +
  youtube_params.redirect_uri +
  "&" +
  "scope=" +
  youtube_params.scope +
  "&" +
  "response_type=" +
  youtube_params.response_type +
  "&" +
  "state=" +
  youtube_params.state;

  export {spotifyAuthEndpoint, youtubeAuthEndpoint};
