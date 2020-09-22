const isMainfolder = (group) => {
    return {
        group: group,
        type: 'notice',
        title: 'Notice',
        text: 'Current Main Folder is this folder'
    }
}

const noReset = (group) => {
    return {
        group: group,
        type: 'notice',
        title: 'Notification',
        text: 'No need to reset.'
    }
}


const saveFile = (group, name) => {
    return {
        group: group,
        type: 'success',
        title: 'Save Workspace',
        text: `Saved ${name} success !`
    }
}

const targetPathEmpty = (group) => {
    return {
        group: group,
        type: 'error',
        title: 'Error',
        text: 'Target path is empty'
    }
}

const noFile= (group, verb) => {
    return {
        group: group,
        type: 'error',
        title: 'Error',
        text: `No file can ${verb}`
    }
}

const noReadable= (group) => {
    return {
        group: group,
        type: 'warn',
        title: 'Warn',
        text: `No readable files in the directory`
    }
}

const alreadyExist = (group, target) => {
    return {
        group: group,
        type: "warn",
        title: "Name Repeat",
        text: `Name: ${target} already existing`
    }
}

const digitNamingWarn = (group) => {
    return {
        group: group,
        type: 'warn',
        title: 'Unexpected Name',
        text: `Don't use number as name`
    }
}

const plsUploadFolder = {
    group: "nofiles",
    type: "error",
    title: "Error",
    text: "Please open a main folder first.",
}


export {
    isMainfolder,
    noReset,
    saveFile,
    targetPathEmpty,
    noFile,
    noReadable,
    digitNamingWarn,
    alreadyExist,
    plsUploadFolder,
}