import Vue from 'vue'
const state = {
    isChanged: false,

    workspace: {
        name: "untitled",
        path: "",
    },
    
    views: {
        workspacesView: false,
        infoView: false,
        updateView: false,
        settingsView: false,
    },
}

const mutations = {
    TOGGLE_VIEW: (state, view) => {
        Vue.set(state.views, view, !state.views[view])
    },

    SET_WORKSPACE: (state, workspace) => {
        state.workspace = workspace
    },

    HOME_VIEW: (state) => {
        Object.keys(state.views).map(v => {
            state.views[v] = false
        })
    }
}

export default {state, mutations}