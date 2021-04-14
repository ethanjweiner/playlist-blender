<template>
  <div>
    <form
      class="mx-3 rounded"
      @submit.prevent="main(state.destinationAccount, state.destinationName)"
    >
      <div class="d-inline">
        <div class="form-check" @input="setMergeOption('common-songs')">
          <input
            type="radio"
            class="form-check-input"
            name="options"
            id="common-songs"
            checked
          />
          <label for="common-songs" class="form-check-label"
            >Common songs</label
          >
          <span
            class="material-icons align-middle"
            @mouseover="
              () => {
                commonSongsTooltip = true;
              }
            "
            @mouseleave="
              () => {
                commonSongsTooltip = false;
              }
            "
          >
            help_outline
          </span>
          <span
            class="mx-sm-3 d-block d-sm-inline mt-3 mt-sm-0 mb-3 mb-sm-0 custom-tooltip bg-black rounded p-1"
            v-if="commonSongsTooltip"
          >
            <span class="material-icons align-middle">
              keyboard_arrow_left
            </span>
            Creates a new playlist of all songs that are in at least
            {{ minCommon.length + 1 }} of the selected playlists.
          </span>
        </div>
        <div class="form-check" @input="setMergeOption('common-artists')">
          <input
            type="radio"
            class="form-check-input"
            name="options"
            id="common-artists"
          />
          <label for="common-artists" class="form-check-label"
            >Common artists</label
          >
          <span
            class="material-icons align-middle"
            @mouseover="
              () => {
                commonArtistsTooltip = true;
              }
            "
            @mouseleave="
              () => {
                commonArtistsTooltip = false;
              }
            "
          >
            help_outline
          </span>
          <span
            class="mx-sm-3 d-block d-sm-inline mt-3 mt-sm-0 mb-3 mb-sm-0 custom-tooltip bg-black rounded p-1"
            v-if="commonArtistsTooltip"
          >
            <span class="material-icons align-middle">
              keyboard_arrow_left
            </span>
            Creates a new playlist whose songs are only from artists that are in
            at least {{ minCommon.length + 1 }} of the selected playlists.
          </span>
        </div>
        <div class="form-check" @input="setMergeOption('union')">
          <input
            type="radio"
            class="form-check-input"
            name="options"
            id="union"
          />
          <label for="union" class="form-check-label">Merge all songs</label>
          <span
            class="material-icons align-middle"
            @mouseover="
              () => {
                unionTooltip = true;
              }
            "
            @mouseleave="
              () => {
                unionTooltip = false;
              }
            "
          >
            help_outline
          </span>
          <span
            class="mx-sm-3 d-block d-sm-inline mt-3 mt-sm-0 mb-3 mb-sm-0 custom-tooltip bg-black rounded p-1"
            v-if="unionTooltip"
          >
            <span class="material-icons align-middle">
              keyboard_arrow_left
            </span>
            Creates a new playlist consisting of all the songs in the playlists
            you select.
          </span>
        </div>
        <div v-if="minCommon.length">
          <label
            class="mt-2"
            style="font-size: 20px"
            v-if="state.mergeOption === 'common-songs'"
          >
            For a song to be added, how many of your playlists does it need to
            be in?
          </label>
          <label
            class="mt-2"
            style="font-size: 20px"
            v-if="state.mergeOption === 'common-artists'"
          >
            For an artist to be added, how many of your playlists do they need
            to be in?
          </label>

          <select
            v-if="state.mergeOption !== 'union'"
            name="min-common"
            id=""
            class="form-select form-select-lg d-block mt-2"
            aria-label=".form-select-lg"
            @change="updateMinCommon(parseInt($event.target.value))"
          >
            <option v-for="value in minCommon" :key="value" :value="value">
              {{ value }} Playlists
            </option>
          </select>
        </div>
      </div>

      <div class="form-group mt-3 inline" v-if="minCommon.length">
        <label
          for="select-destination-account"
          style="font-size: 20px"
          class="mb-2"
          >Select an account to create the new playlist on:</label
        >
        <DestinationAccount />
      </div>
      <div class="form-group mt-3">
        <label for="destination-name" style="font-size: 20px"
          >Create a name for your new playlist:</label
        >
        <input
          type="text"
          class="form-control mt-2"
          id="destination=name"
          placeholder="Blended Playlist"
          @input="updateDestinationName($event.target.value)"
        />
      </div>
    </form>
  </div>
</template>

<script>
import { computed, inject, ref } from "vue";
import { main } from "@/mixins/helpers";
import DestinationAccount from "./DestinationAccount";

export default {
  name: "Options",
  components: { DestinationAccount },
  setup() {
    const store = inject("store");
    const {
      state,
      updateDestinationName,
      setMergeOption,
      updateMinCommon,
    } = store;
    // Remove 1 element from array and iterate from 1 to n
    // Example: [p1,p2,p3] -> [2,3]
    const minCommon = computed(() => {
      if (state.selectedPlaylists.length > 1) {
        return state.selectedPlaylists
          .filter((value, index) => index > 0)
          .map((value, index) => index + 2);
      } else {
        return [];
      }
    });

    const commonSongsTooltip = ref(false);
    const commonArtistsTooltip = ref(false);
    const unionTooltip = ref(false);

    return {
      state,
      updateDestinationName,
      setMergeOption,
      main,
      minCommon,
      updateMinCommon,
      commonSongsTooltip,
      commonArtistsTooltip,
      unionTooltip,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/global.scss";
label {
  color: $main-yellow;
}
.form-check {
  container: body;
  font-size: 27px;
  label {
    cursor: pointer;
  }
  .form-check-input {
    height: 30px;
    width: 30px;
    margin-right: 12px;
    color: $main-yellow;
    border: 5px solid $main-yellow;
    background-color: transparent;
    cursor: pointer;
    &:checked {
      background-image: none;
      background-color: white;
    }
    &:focus {
      box-shadow: none;
    }
  }
  span.material-icons {
    font-size: 30px;
    margin-left: 18px;
    color: $main-yellow;
    cursor: pointer;
    container: body;
  }
  span.custom-tooltip {
    font-size: 18px;
    color: $main-gray;
    background-color: white;
    box-shadow: 0px 0px 5px 5px $main-yellow;
    span.material-icons {
      margin-left: 0;
      color: $main-gray;
      font-size: 18px;
      letter-spacing: -5px;
    }
  }
}
.form-select {
  max-width: 500px;
  color: $main-yellow;
  border: 3px solid $main-yellow;
  &:focus {
    box-shadow: none;
    border-color: $main-yellow;
  }
}
.form-select-lg {
  max-width: 500px;
  color: $main-gray;
  border: 3px solid $main-yellow;
  &:focus {
    box-shadow: none;
    border-color: $main-yellow;
  }
}
input {
  background: transparent;
  border: 3px solid $main-yellow;
  letter-spacing: 2px;
  font-size: 22px;
  color: $main-yellow;

  &:focus {
    background: transparent;
    border-color: $main-yellow;
    color: $main-yellow;
    box-shadow: none;
  }
}
</style>