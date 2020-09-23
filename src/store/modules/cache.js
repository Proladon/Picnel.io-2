import {getDirFiles} from '@/assets/func/helper.js'
const state = {
    tempColor: Object,
    tempFilesList: [],
};

const mutations = {
    //:: Color
    COLOR_UPDATE: (state, color) => {
        state.tempColor = color
    },

    // Temp Cache
    OVERIDE_TEMP_FILES_LIST: (state, data) => {
        state.tempFilesList = data;
    },
    SET_TEMP_FILES_LIST: (state, targetpath) => {
        // state.tempFilesList = globDirFiles(targetpath);
        state.tempFilesList = getDirFiles(targetpath);
    },
    CLEAR_TEMP_FILES_LIST: (state) => {
        state.tempFilesList = [];
    },
    REMOVE_TEMP_FILES_ITEM: (state, index) => {
        state.tempFilesList.splice(index, 1);
    },
    RENAME_TEMP_FILES_ITEM: (state, {index, data}) => {
        state.tempFilesList.splice(index, 1, data);
    },
};

export default {
    state,
    mutations,
};
