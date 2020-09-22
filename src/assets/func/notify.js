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

const notFound = (group, obj) => {
    return {
        group: group,
        type: 'error',
        title: 'Error',
        text: `Not found ${obj}`
    }
}

const noFile = (group, verb) => {
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

const noSelectedWorkspace= (group) => {
    return {
        group: group,
        type: 'warn',
        title: 'Warn',
        text: `No selected workspace`
    }
}

const alreadyExist = (group, target) => {
    return {
        group: group,
        type: "warn",
        title: "Repeat",
        text: `${target} already existing`
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

const unexpectedError = (group) => {
    return {
        group: group,
        type: 'error',
        title: 'Unexpected Error',
        text: `Sorry, we got unexpected error, pls report the issues as you can`
    }
}

const plsUploadFolder = {
    group: "nofiles",
    type: "error",
    title: "Error",
    text: "Please open a main folder first.",
}


const deleteMessage = {
    type: 'question',
    buttons: ['Yes, Delete', 'Cancel',],
    title: 'Warning',
    message: 'Do you want to do Delete?',
    detail: 'It will permanently delete, are you sure?',
}

const overideMessage = {
    type: 'question',
    buttons: ['Yes, Overide', 'Cancel',],
    title: 'Warning',
    message: 'Do you want to do Overide?',
    detail: 'It will overide existing file, are you sure?',
}



export {
    isMainfolder,
    noReset,
    saveFile,
    targetPathEmpty,
    notFound,
    noFile,
    noReadable,
    noSelectedWorkspace,
    digitNamingWarn,
    alreadyExist,
    plsUploadFolder,
    unexpectedError,
    deleteMessage,
    overideMessage,
}