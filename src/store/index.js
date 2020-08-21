import Vue from "vue";
import Vuex from "vuex";
import fs from 'fs-extra'
import mime from 'mime-types'
import path from 'path'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        mode: "Random",
        home: 'public/static/picnel.io.png',
        curFile: 'public/static/picnel.io.png',
        worksapce: "undefined",
        activeGroup: "",
        folderGroups: [
            {
                name: "Wallpaper",
            },
            {
                name: "ACG",
            }
        ],
        folderLists: {
            Wallpaper: [
                {
                    name: "Anime",
                    path: "",
                    color: "rgb(228, 216, 160)",
                },
                {
                    name: "風景",
                    path: "",
                    color: "rgb(187, 228, 160)",
                },
                {
                    name: "Art",
                    path: "",
                    color: "rgb(228, 160, 160)",
                },
                {
                    name: "Nature",
                    path: "",
                    color: "rgb(160, 209, 228)",
                },
            ],
            ACG: [
                {
                    name: "Games",
                    path: "",
                    color: "#22df8c",
                },
                {
                    name: "Anime",
                    path: "",
                    color: "#54BBFF",
                },
            ],
        },
        tempColor: Object,
        
        log:[],

    },
    mutations: {
        //:: Mode
        CHANGE_MODE: (state, mode) => {
            state.mode = mode
        },

        SET_CURFILE: (state, data) => {
            state.curFile = data
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
        
        //:: Color
        COLOR_UPDATE: (state, color) => {
            state.tempColor = color
        },

        //:: Log
        UPDATE_LOG: (state, log) => {
            let logs = state.log
            logs.push(log)
            state.log = logs
        },
        
    },
    actions: {

        //:: 隨機挑選圖片
        RANDOM_FILE: (context) => {
            function randomChoice(arr) {
                return arr[Math.floor(Math.random() * arr.length)];
            }
            let files_list = fs.readdirSync(context.getters.getFolderPath).map(f => {
                return `${context.getters.getFolderPath}/${f.replace(/\\/g, '/')}`
            })

            // ignore no extname files
            const files = files_list.filter(f => {
                return path.extname(f) !== ''
            })
            //? 如果資料夾內有多個檔案才執行
            if (files.length > 0) {
                context.commit('SET_CURFILE', randomChoice(files))
            }
            else {
                context.commit('SET_CURFILE', context.state.home)
            }
        },

        PRE_FILE: context => {
            let index = context.getters.getFileIndex
            
            let files_list = fs.readdirSync(context.getters.getFolderPath).map(f => {
                return `${context.getters.getFolderPath}/${f.replace(/\\/g, '/')}`
            })
            // ignore no extname files
            const files = files_list.filter(f => {
                return path.extname(f) !== ''
            })
            //? 如果資料夾內有多個檔案才執行
            if (files.length > 0 && index !== 0) {
                context.commit('SET_CURFILE', files[index-1])
            }
        },
        NEXT_FILE: context => {
            let index = context.getters.getFileIndex
            let files_list = fs.readdirSync(context.getters.getFolderPath).map(f => {
                return `${context.getters.getFolderPath}/${f.replace(/\\/g, '/')}`
            })
            // ignore no extname files
            const files = files_list.filter(f => {
                return path.extname(f) !== ''
            })
            //? 如果資料夾內有多個檔案才執行
            if (files.length > 0) {
                let nextIndex = index + 1
                if (nextIndex < files.length) {
                    context.commit('SET_CURFILE', files[index+1])
                }
            }
            else {
                context.commit('SET_CURFILE', context.state.home)
            }
        },

        DELETE_FILE: context => {
            fs.remove(context.state.curFile.filepath, function(err){
                if (err) return console.error(err);
                console.log("success!")
            });
        }

    },
    modules: {},
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
            return mime.lookup(getters.getCurFilePath).split('/')[0]
        },
        //:: File Foleder Path
        getFolderPath: (state, getters) => {
            return path.dirname(getters.getCurFilePath)
        },
        //:: Folder Name
        getFolderName: (state, getters) => {
            return path.basename(getters.getFolderPath)
        },
        //:: Folder Files_list
        getFilesList: (state, getters) => {
            const files = fs.readdirSync(getters.getFolderPath).map(f => {
                return `${getters.getFolderPath}/${f.replace(/\\/g, '/')}`
            })
            return files
        },
        //:: File Index
        getFileIndex: (state, getters) => {
            const file = getters.getCurFilePath
            const files_list = getters.getFilesList
            return files_list.indexOf(file)
        },
        //:: View Mode
        getMode: state => {
            return state.mode
        },
        //:: Folder Info
        getFolderInfo: (state, getters) => {
            const files = getters.getFilesList
            let file_items = files.filter(i => 
                fs.lstatSync(i).isFile()
            )
            let folder_items = files.filter(i =>
                fs.lstatSync(i).isDirectory()
            )
            return `Directorys: ${folder_items.length} / Files: ${file_items.length}`
        },
        //:: Active Folderlist
        getActiveFolderList: (state) => {
            const actgroup = state.activeGroup
            const folderlist = state.folderLists
            return folderlist[actgroup]
        }
       
    }
});
