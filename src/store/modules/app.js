import Vue from 'vue'
const state = {
    isChanged: false,

    curView: 'home',

    workspace: {
        name: "untitled",
        path: "",
    },
    
    // views: {
    //     workspacesView: false,
    //     infoView: false,
    //     updateView: false,
    //     settingsView: false,
    // },
}

const mutations = {
    CHANGE_VIEW: (state, view) => {
        Object.keys(state.views).map(v => {
            state.views[v] = false
        })
        Vue.set(state.views, view, true)
    },

    SET_VIEW: (state, view) => {
        state.curView = view
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