import Vue from "vue";
import Vuex from "vuex";
import fs from 'fs-extra'
import mime from 'mime-types'
import path from 'path'
import {filesFilter, getDirFiles} from '@/assets/func/helper.js'
import log from './modules/logger.js'
import app from './modules/app.js'
import cache from './modules/cache.js'
import config from './modules/config.js'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        mode: "Random",
        curFile: '',
        fileslist: [],
        activeGroup: "",
        folderGroups: [],
        folderLists: {
            Wallpaper: [],
            ACG: [],
        },

    },
    mutations: {
        SET_STATE: (state, data) => {
            Object.assign(state, data)
        },
        SET_CONFIG: (state, data) => {
            Object.assign(state.config, data)
        },
        
        //:: File
        SET_CURFILE: (state, data) => {
            state.curFile = data
            if (!state.app.workspace.name.includes("*")) {
                state.app.workspace = {
                    name: `${state.app.workspace.name}*`,
                    path: state.app.workspace.path,
                }
            }
        },

        UPDATE_FILES_LIST: (state) => {
            state.fileslist = getDirFiles(path.dirname(state.curFile))
        },
        
        //:: Mode
        CHANGE_MODE: (state, mode) => {
            state.mode = mode
        },
       
        //:: Folders List
        UPDATE_LISTS: (state, data) => {
            state.folderLists[state.activeGroup] = data
        },
        SET_LIST: (state, data) => {
            state.folderLists = data
        },
        RENAME_LIST: (state, {oldName, newName}) => {
            let flist = state.folderLists
            flist[newName] = flist[oldName]
            delete flist[oldName]
            state.folderLists = flist
        },
        ADD_LIST: (state, name) => {
            Vue.set(state.folderLists, name, []) 
        },
        ADD_FOLDER: (state, { group, folder }) => {
            let flist = state.folderLists[group]
            flist.push(folder)
            state.folderLists[group] = flist
        },

        //:: Group
        UPDATE_GROUP: (state, data) => {
            state.folderGroups = data
        },
        RENAME_GROUP: (state, {index, name}) => {
            state.folderGroups[index].name = name
        },
        ADD_GROUP: (state, data) => {
            let groups = state.folderGroups
            groups.push(data)
            state.folderGroups = groups
        },
        DELETE_GROUP: (state, index) => {
            let groups = state.folderGroups
            groups.splice(index, 1)
            state.folderGroups = groups
        },
        CHANGE_ACTIVE_GROUP: (state, group) => {
            state.activeGroup = group
        },
        
    },
    actions: {

        //:: 隨機挑選圖片
        RANDOM_FILE: (context, oldindex=null) => {
            function randomChoice(arr) {
                return arr[Math.floor(Math.random() * arr.length)];
            }
            
            const cachemode = context.state.cache.tempFilesList.length >= 3000
            
            if (!cachemode) context.commit('UPDATE_FILES_LIST')
            
            const files = cachemode ?
                filesFilter(context.state.cache.tempFilesList) : filesFilter(context.state.fileslist)

            //? 如果資料夾內有多個檔案才執行
            if (files.length > 0) {
                // Not repeat choice curfile
                let random_file = randomChoice(files)
                if (files.length > 1) {
                    while (random_file === context.state.curFile) {
                        random_file = randomChoice(files)
                    }
                }
                context.commit('SET_CURFILE', random_file)
            }
            else if (oldindex === -1) {
                context.commit('SET_CURFILE', '')
            }
            else {
                context.commit('SET_CURFILE', '')
            }

            
        },

        PRE_FILE: context => {
            let index = context.getters.getFileIndex

            const cachemode = context.state.cache.tempFilesList.length >= 3000

            if (!cachemode) context.commit('UPDATE_FILES_LIST')

            const files = cachemode ?
                filesFilter(context.state.cache.tempFilesList) : filesFilter(context.state.fileslist)
            
            if (files.length > 0 && index !== 0) {
                context.commit('SET_CURFILE', files[index - 1])
            }

        },
        NEXT_FILE: (context, oldindex=null) => {
            let index = 0
            
            if (oldindex !== null) index = oldindex
            else {
                index = context.getters.getFileIndex
            }
            
            const cachemode = context.state.cache.tempFilesList.length >= 3000
            
            if (!cachemode) context.commit('UPDATE_FILES_LIST')
            
            const files = cachemode ?
                filesFilter(context.state.cache.tempFilesList) : filesFilter(context.state.fileslist)

            if (oldindex !== null) {
                context.commit('SET_CURFILE', files[index])
                return
            }
            
            if (files.length === 1) {
                context.commit('SET_CURFILE', files[0])
            }
            else if (files.length > 0) {
                let nextIndex = index + 1
                if (nextIndex < files.length) {
                    context.commit('SET_CURFILE', files[index + 1])
                }
            }
            else {
                context.commit('SET_CURFILE', '')
            }

            
        },

        DELETE_FILE: context => {
            fs.remove(context.state.curFile.filepath, function(err){
                if (err) return console.error(err);
            });
        },

        AFTER_MOVE_NEXT: (context, index) => {
            let files_list = getDirFiles(context.getters.getFolderPath)
            
            const files = filesFilter(files_list)

            if (files.length === 0) {
                context.commit('SET_CURFILE', '')
            }
            else if (files.length === 1) {
                console.log(files[0])
                context.commit('SET_CURFILE', files[0])
            }
            else if (index + 1 < files.length) {
                context.commit('SET_CURFILE', files[index])
            }
            else if (index + 1 >= files.length) {
                context.commit('SET_CURFILE', files[files.length - 1])
            }
            else if (index === -1) {
                context.commit('SET_CURFILE', '')
            } 
        },
        

    },
    modules: {
        app,
        log,
        cache,
        config,
    },
    getters: {
        //:: File Path
        getCurFilePath: state => {
            return state.curFile.replace(/\\/g, '/')
        },
        //:: File Name
        getFileName: (state, getters) => {
            return path.basename(getters.getCurFilePath)
        },
        //:: File Type
        getFileType: (state, getters) => {
            if (state.curFile === '') {
                return ''
            }
            return mime.lookup(getters.getCurFilePath).split('/')[0]
        },
        //:: File Foleder Path
        getFolderPath: (state, getters) => {
            return path.dirname(getters.getCurFilePath)
        },
        //:: Folder Name
        getFolderName: (state, getters) => {
            if (state.curFile === '') {
                return 'Upload Folder'
            }
            return path.basename(getters.getFolderPath)
        },
        
        
        // //:: Folder Files_list
        // getFilesList: (state, getters) => {
        //     if (state.cache.tempFilesList.length > 3000) {
        //         return state.cache.tempFilesList
        //     }
        //     else {
        //         // Fast-Glob
        //         // return globDirFiles(getters.getFolderPath)
                
        //         console.log(getDirFiles(getters.getFolderPath))
        //         return getDirFiles(getters.getFolderPath)
        //     }
        // },


        //:: File Index
        getFileIndex: (state, getters) => {
            const file = getters.getCurFilePath
            const files = state.cache.tempFilesList.length > 3000 ?
                filesFilter(state.cache.tempFilesList) : filesFilter(state.fileslist)
            return files.indexOf(file)
        },
        //:: View Mode
        getMode: state => {
            return state.mode
        },
        //:: Folder Info
        getFolderInfo: (state) => {
            const files = state.cache.tempFilesList.length > 3000 ?
                state.cache.tempFilesList : state.fileslist
            
            let file_items = files.filter(i => 
                fs.lstatSync(i).isFile()
            )
            let folder_items = files.filter(i =>
                fs.lstatSync(i).isDirectory()
            )
            
            const readable = filesFilter(files)

            return `Directorys: ${folder_items.length} / Files: ${file_items.length} / Readable: ${readable.length}`
        },
        //:: Active Folderlist
        getActiveFolderList: (state) => {
            const actgroup = state.activeGroup
            const folderlist = state.folderLists
            return folderlist[actgroup]
        }
       
    }
});
