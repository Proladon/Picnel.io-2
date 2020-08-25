const state = {
    activeTab: "Copylog",
    copyLog: [],
    moveLog: [],
    deleteLog: [],
    renameLog: [],
    
    copyUnread: 0,
    moveUnread: 0,
    deleteUnread: 0,
    renameUnread: 0,
}

const mutations = {
    UPDATE_COPYLOG: (state, log) => {
        state.copyLog.push(log)
        if (state.activeTab !== 'Copylog') {
            state.copyUnread += 1
        }
    },
    UPDATE_MOVELOG: (state, log) => {
        state.moveLog.push(log)
        if (state.activeTab !== 'Movelog') {
            state.moveUnread += 1
        }
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
    CLEAR_UNREAD: (state) => {
        if (state.activeTab === 'Copylog') {
            state.copyUnread = 0
        }
        else if (state.activeTab === 'Movelog') {
            state.moveUnread = 0
        }
        else if (state.activeTab === 'Deletelog') {
            state.deleteUnread = 0
        }
        else if (state.activeTab === 'Renamelog') {
            state.deleteUnread = 0
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