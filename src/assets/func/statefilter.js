const statefilter = (state) => {
    return {
        mode: state.mode,
        curFile: state.curFile,
        activeGroup: state.activeGroup,
        folderGroups: state.folderGroups,
        folderLists: state.folderLists,
        app: state.app,
    }
}

const newstate = () => {
    return {
        mode: "Random",
        curFile: '',
        activeGroup: "",
        folderGroups: [],
        folderLists: {},
        
        app: {
            isChanged: false,
            workspace: {
                name: "untitled",
                path: "",
            },
            curView: 'home',
        },
    }
}

const configfilter = {
    "folders_anime": true,
    "viewer_anime": true,
    "mode_notify": true,
    "copy_notify": true,
    "move_notify": true,
    "delete_notify": true,
    "check_update": true,
}


export {
    statefilter,
    newstate,
    configfilter,
}