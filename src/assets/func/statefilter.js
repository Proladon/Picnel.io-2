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


export {
    statefilter,
    newstate,
}