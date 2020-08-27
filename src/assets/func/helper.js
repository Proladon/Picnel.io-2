import mime from 'mime-types'
import fs from 'fs-extra'
import path from 'path'
export default {

    //:: Filter files inside folder, ignore folder、unsupport files
    filesFilter: (files_list) => {
        const readable = ['image', 'video', 'audio']
        let readable_files = []
        for (let item of files_list) {
            let type = mime.lookup(item)
            if (type !== false) {
                type = type.split('/')[0]
                if (readable.includes(type)) {
                    readable_files.push(item)
                }
            }
        }
        return readable_files
    },

    //:: Get all files in the folder
    getDirFiles: (dirPath) => {
        let files_list = fs.readdirSync(dirPath).map(f => {
            return `${dirPath}/${f.replace(/\\/g, '/')}`
        })
        
        return files_list
    },

}


const renameJoin = (curPath, curfileName, newName, extName) => {
    fs.renameSync(curPath, curPath.replace(curfileName, newName + extName))
    return curPath.replace(curfileName, newName + extName)
}

const renameLogging = (curPath, curfileName, newName) => {
    return `${path.dirname(curPath)}//${curfileName}//${newName}`
}

export {
    renameJoin,
    renameLogging
}

