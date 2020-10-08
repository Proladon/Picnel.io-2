import Store from 'electron-store'
const state = {
    viewer_anime: true,
    folders_anime: true,

    mode_notify: true,

    check_update: true,
}

const mutations = {
    TOGGLE_CONFIG: (state, config) => {
        const store = new Store()
        store.set(`user_configs.${config}`, !state[config])
        state[config] = !state[config]
    },

    
}

export default {
    state,
    mutations
}