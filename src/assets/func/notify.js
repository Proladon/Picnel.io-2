const saveFile= (group, name) => {
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

const alreadyExist = (group, target) => {
    return {
        group: group,
        type: "warn",
        title: "Name Repeat",
        text: `Name: ${target} already existing`
    }
}

const plsUploadFolder = {
    group: "nofiles",
    type: "error",
    title: "Error",
    text: "Please open a main folder first.",
}


export {
    saveFile,
    targetPathEmpty,
    noFile,
    alreadyExist,
    plsUploadFolder,
}