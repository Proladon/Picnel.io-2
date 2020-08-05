import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        mode: "random",
        curFile: Object,

    },
    mutations: {
        LOAD_FILE: (state, file) => {
            state.curFile = file
        }
    },
    actions: {},
    modules: {},
    getters: {
        getFileName: state => {
            return state.curFile.name
        },

        getFilePath: state => {
            return `${state.curFile.path}`.replace(/\\/g, '/')
        },

        getFileType: state => {
            return state.curFile.type.split('/')[0]
        },

    }
});
