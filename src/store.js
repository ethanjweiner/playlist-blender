import { computed, reactive, readonly, ref } from "vue";
import { removeHashParams } from "./mixins/helpers";

// Global state management
const state = reactive({
    accounts: [],
    destinationAccount: computed(() => state.accounts.find(account => account.isDestination)),
    selectedPlaylists: computed(() => {
        // 2. Extract the playlists out of the accounts & concatenate them
        return state.accounts.reduce((playlists, account) => {
            // 1. Filter only for selected playlists & add the platform to the playlist
            if (account.playlists) {
            return playlists.concat(
                account.playlists
                .filter((playlist) => playlist.selected)
                .map((selectedPlaylist) => {
                    return { ...selectedPlaylist, 
                                platform: account.platform,
                                accountID: account.id, 
                                platform: account.platform, 
                                token: account.token 
                            };
                })
            );
            }
            return playlists;
        }, []);
    }),
    mergeOption: "common-songs",
    destinationName: "",
    merged: false,
    destinationUrl: "",
    minCommon: 2,
    loading: false
})

const errorMessage = ref("");

const updateLocalAccounts = () => {
    const localAccounts = state.accounts.filter(account => account.token);
    localStorage.setItem("accounts", JSON.stringify(localAccounts));
}

// STATE SETTERS/UPDATERS

const setAccounts = (newAccounts) => {
    state.accounts = newAccounts;
}

const addAccount = (newAccount) => {
    removeHashParams();
    state.accounts.push(newAccount);
}

const togglePlaylist = (id, index) => {
    state.accounts[index].playlists = 
        state.accounts[index].playlists.map((playlist) => {
            if (playlist.id === id)
                playlist.selected = !playlist.selected;
            return playlist;
        });
    updateLocalAccounts();
}

const deleteAccount = (index) => {
    state.accounts.splice(index, 1);
    updateLocalAccounts();
}

const toggleDestination = (token) => {
    state.accounts = state.accounts.map(account => {
        if (account.token === token) {
            account.isDestination = !account.isDestination;
        } else if (account.isDestination) {
            account.isDestination = false;
        }
        return account;
    });
}

const updateDestinationName = (name) => {
    state.destinationName = name;
}

const setMergeOption = (option) => {
    state.mergeOption = option;
}

const toggleMerged = () => {
    if (state.merged) setMergeOption('common-songs');
    state.merged = !state.merged;
}

const updateMinCommon = (minCommon) => {
    state.minCommon = minCommon;
}

const resetState = () => {
    state.destinationAccount = computed(() => state.accounts.find(account => account.isDestination));
    state.mergeOption = "common-songs";
    state.destinationName = "";
    state.merged = false;
    state.destinationUrl = "";
    state.minCommon = 2;
    state.loading = false;
    errorMessage.value = "";
}

const toggleLoading = () => {
    state.loading = !state.loading;
}

const stopLoading = () => {
    state.loading = false;
}

const setErrorMessage = (message) => {
    errorMessage.value = message;
}

const setDestinationUrl = (url) => {
    state.destinationUrl = url;
}

export default { state: readonly(state), errorMessage, setErrorMessage, setAccounts, addAccount, togglePlaylist, deleteAccount, updateLocalAccounts, toggleDestination, updateDestinationName, toggleMerged, setMergeOption, resetState, updateMinCommon, toggleLoading, stopLoading, setDestinationUrl };

// Testing area