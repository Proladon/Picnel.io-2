import Vue from "vue";
import Vuex from "vuex";
import fs from 'fs-extra'
import mime from 'mime-types'
import path from 'path'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        mode: "random",
        home: 'public/static/picnel.io.png',
        curFile: 'public/static/picnel.io.png',
        folderList:{},
        log:[],

    },
    mutations: {
        SET_CURFILE: (state, data) => {
            state.curFile = data
        },
        // ADD_FOLDER: (state, data) => {

        // },
        UPDATE_LOG: (state, log) => {
            let logs = state.log
            logs.push(log)
            state.log = logs
        },
        
    },
    actions: {

        //:: 隨機挑選圖片
        RANDOM_FILE: context => {
            function randomChoice(arr) {
                return arr[Math.floor(Math.random() * arr.length)];
            }
            const files_list = context.getters.getFilesList
            const files = files_list.filter(f => {
                return path.extname(f) !== ''
            })
            //? 如果資料夾內有多個檔案才執行
            if (files.length > 0) {
                context.commit('SET_CURFILE', randomChoice(files))
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
            return `Folders: ${folder_items.length} Files: ${file_items.length}`
        },
       
    }
});
