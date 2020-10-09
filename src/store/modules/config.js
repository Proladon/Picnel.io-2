import Store from 'electron-store'
const state = {
    // Anime
    viewer_anime: true,
    folders_anime: true,

    // Notify
    mode_notify: true,
    copy_notify: true,
    move_notify: true,
    delete_notify: true,

    // Update
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