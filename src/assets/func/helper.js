import mime from "mime-types";
import fs from "fs-extra";
import fg from 'fast-glob'
import path from "path";

//:: Filter files inside folder, ignore folder、unsupport files
const filesFilter =  (files_list) => {
    const readable = ["image", "video", "audio"];
    let readable_files = [];
    for (let item of files_list) {
        let type = mime.lookup(item);
        if (type !== false) {
            type = type.split("/")[0];
            if (readable.includes(type)) {
                readable_files.push(item);
            }
        }
    }
    return readable_files;
}

//:: Get all files in the folder => fs
const getDirFiles = (dirPath) => {
    let files_list = fs.readdirSync(dirPath).map((f) => {
        return `${dirPath}/${f.replace(/\\/g, "/")}`;
    });

    return files_list;
}

//:: Get all files in the folder => glob
const globDirFiles = (dirPath) => {
    return fg.sync(dirPath + '/*', { dot: false })
}

// :: Path Operate
const renameJoin = (curPath, curfileName, newName, extName) => {
    
    fs.renameSync(curPath, curPath.replace(curfileName, newName + extName));
    return curPath.replace(curfileName, newName + extName);
}

const getRootPath = (absPath, relPath) => {
    let root = ""
    
    for (let p of absPath) {
        if (p !== relPath) {
            root += p + '/'
        }
        else if (p === relPath) {
            root += p
            break
        }
    }
    
    return root.replace(/\\/g, '/')
}

// Check if exist same filename and auto rename 
// filename + (num)
const repeatAutoRename = (filePath, folderPath) => {
    const extname = path.extname(filePath)
    let repeat = true
    let counter = 1
    let newPath = ""

    while (repeat) {
        newPath = path.join(
            folderPath,
            filePath.replace(extname, ` (${counter})${extname}`)
        )
        counter += 1
        if (!fs.existsSync(newPath)) {
            repeat = false
        }
    }

    return newPath
}

//:: Logging
// => Rename
const renameLogging = (curPath, curfileName, newName) => {
    return `${path.dirname(curPath)}//${curfileName}//${newName}`;
}

// => Delete
const deletefileLogging = (fileName, curPath, ) => {
    return `${fileName}//${curPath}`;
}


export {
    filesFilter,
    
    getDirFiles,
    globDirFiles,
    
    renameJoin,
    getRootPath,
    
    repeatAutoRename,

    renameLogging,
    deletefileLogging,
}
