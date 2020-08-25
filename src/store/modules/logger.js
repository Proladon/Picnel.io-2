const state = {
    activeTab: "Copylog",
    copyLog: [],
    moveLog: [],
    deleteLog: [],
    renameLog: [],
}

const mutations = {
    UPDATE_COPYLOG: (state, log) => {
        state.copyLog.push(log)
    },
    UPDATE_MOVELOG: (state, log) => {
        state.copyLog.push(log)
    },
    CLEAR_LOG: (state, logger) => {
        if (logger === 'Copylog') {
            state.copyLog = []
        }
        else if (logger === 'Movelog') {
            state.moveLog = []
        }
        else if (logger === 'Deletelog') {
            state.deleteLog = []
        }
        else if (logger === 'Renamelog') {
            state.deleteLog = []
        }
    },
    ACTIVE_TAB: (state, tab) => {
        state.activeTab = tab
    }
}

const actions = {

}

export default {
    state,
    mutations,
    actions,
}