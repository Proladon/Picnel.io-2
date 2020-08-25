const state = {
    activeTab: "Copylog",
    Copylog: [],
    Movelog: [],
    Deletelog: [],
    Renamelog: [],
    
    Copylog_Unread: 0,
    Movelog_Unread: 0,
    Deletelog_Unread: 0,
    Renamelog_Unread: 0,
}

const mutations = {

    UPDATE_LOG: (state, { logger, log }) => {
        state[logger].push(log)
        if (state.activeTab !== logger) {
            state[logger+'_Unread'] += 1
        }
    },
    CLEAR_LOG: (state) => {
        state[state.activeTab] = []
    },
    CLEAR_UNREAD: (state) => {
        state[state.activeTab + '_Unread'] = 0
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