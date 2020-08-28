import Vue from 'vue'
const state = {
    isChanged: false,
    workspace: {
        name: "untitled",
        path: "",
    },
    views: {
        favoriteView: false,
        settingsView: false,
    },
}

const mutations = {
    TOGGLE_VIEW: (state, view) => {
        Vue.set(state.views, view, !state.views[view])
    },

    SET_WORKSPACE: (state, workspace) => {
        state.workspace = workspace
    }
}

export default {state, mutations}