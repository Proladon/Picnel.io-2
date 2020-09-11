const savefilter = (state) => {
    return {
        mode: state.mode,
        curFile: state.curFile,
        activeGroup: state.activeGroup,
        folderGroups: state.folderGroups,
        folderLists: state.folderLists,
        app: state.app,
    }
}

export {
    savefilter,
}