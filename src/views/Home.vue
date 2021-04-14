<template>
  <div class="home">
    <div class="mx-md-5 rounded p-3 my-md-3 my-1" id="heading">
      <h1 class="d-inline mx-3">Blend</h1>
      <h3 class="d-inline">Verb</h3>
      <h4 class="d-block mx-3">\ 'blend \</h4>
      <p class="d-block mx-3" id="definition">
        "to mix two or more substances together"
      </p>
      <p class="d-block mx-3 text-muted" style="margin-top: -10px">
        Hornby, Albert Sydney. Oxford Advanced Learner's Dictionary of Current
        English / [by] A.S. Hornby ; Editor Jonathan Crowther. Oxford, England
        :Oxford University Press, 1995.
      </p>
    </div>
    <div class="mx-5 mt-5">
      <button
        type="button"
        class="btn btn-lg mx-3 main-button"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        <span
          class="material-icons"
          style="font-size: 33px; margin-right: 10px"
        >
          blender
        </span>
        Start Blending
        <span class="material-icons" style="font-size: 33px; margin-left: 10px">
          blender
        </span>
      </button>
    </div>
    <div class="row mx-md-5 mt-4 mt-md-5">
      <div class="col-xl-6">
        <div class="tutorial p-3 text-center rounded">
          <h2 class="text-dark">Tutorial</h2>
          <div class="row">
            <div class="col-sm-11 m-auto">
              <div class="responsive mb-3">
                <iframe
                  class="responsive-iframe"
                  height="100%"
                  src="https://www.youtube.com/embed/ih-i5kAkeRw"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-6 mt-md-5 mt-2 mt-xl-0">
        <div class="description p-3 text-center rounded">
          <h3 class="text-dark d-block">How it works</h3>
          <ol>
            <li>
              Grant access to Playlist Blender to view, add, and modify
              playlists in accounts of your choosing.
            </li>
            <li>
              Select the playlists to blend -
              <span>even if they're from different platforms!</span>
            </li>
            <li>
              Choose your blending options that will determine the content of
              the resulting blended playlist.
            </li>
            <li>
              Choose the account on which you want to create your new blended
              playlists.
            </li>
            <li>Create a name for the playlist.</li>
            <li>
              BLEND them: Based on the options you chose, the blending algorithm
              will analyze your selected playlists, create a new playlist, and
              add tracks to that playlist.
            </li>
          </ol>
          <hr class="mx-5" />
          <h3 class="text-dark d-block">Who it's for</h3>
          <ul class="list-unstyled mx-3">
            <li>
              Any person, or group of people, that wants to create some
              combination of their music playlists, from the same or different
              platforms!
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  <!-- Modal -->
  <div
    class="modal fade"
    id="exampleModal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title text-dark" id="exampleModalLabel">
            Privacy Notice
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          By continuing, you acknowledge receipt of the
          <a @click="redirect" data-bs-dismiss="modal">Privacy Policy</a>.
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Close
          </button>
          <button
            type="button"
            class="btn btn-warning"
            @click="blend"
            data-bs-dismiss="modal"
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  </div>
  <!-- Add a router link to the main blend page -->
</template>

<script>
import { useRouter } from "vue-router";

export default {
  name: "Home",
  setup() {
    const router = useRouter();
    const blend = () => {
      router.push({ name: "Blend" });
    };
    const redirect = () => {
      router.push({ name: "Privacy Policy" });
    };
    return { blend, redirect };
  },
};
</script>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Goudy+Bookletter+1911&display=swap");
@import "../assets/styles/global.scss";
.main-button {
  width: 97%;
  height: 6rem !important;
}
a {
  color: rgb(85, 85, 250) !important;
  font-weight: bold !important;
  text-decoration: underline !important;
  cursor: pointer;
}
.responsive {
  position: relative;
  overflow: hidden;
  padding-top: 50%;
}
.responsive-iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}
h1 {
  color: white;
  font-size: 65px;
  @media (max-width: 768px) {
    font-size: 35px;
  }
}
h3,
h4 {
  color: $main-yellow;
  background: none;
  box-shadow: none;
}
h3 {
  font-size: 30px;
  @media (max-width: 768px) {
    font-size: 20px;
  }
}
h4 {
  font-size: 20px;
  text-decoration: italic;
  @media (max-width: 768px) {
    font-size: 15px;
  }
}
#definition {
  color: white;
  font-size: 35px;
  @media (max-width: 768px) {
    font-size: 25px;
  }
}
#heading {
  font-family: "Goudy Bookletter 1911", serif !important;
  border-bottom: 1px solid white;
}
#playlists {
  color: $main-yellow;
}
.tutorial {
  background: $main-yellow;
}
.description {
  background: white;
}
h2 {
}
ol,
ul {
  text-align: left !important;
}
</style>
