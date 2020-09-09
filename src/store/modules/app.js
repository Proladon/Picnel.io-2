// import Vue from 'vue'
const state = {
    isChanged: false,

    curView: 'home',

    workspace: {
        name: "untitled",
        path: "",
    }
    
}

const mutations = {

    SET_VIEW: (state, view) => {
        state.curView = view
    },

    SET_WORKSPACE: (state, workspace) => {
        state.workspace = workspace
    }
}

export default {state, mutations}