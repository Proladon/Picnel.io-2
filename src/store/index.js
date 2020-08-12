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
        log:[],

    },
    mutations: {
        SET_CURFILE: (state, data) => {
            state.curFile = data
        },
        UPDATE_CURFILE_PATH: (state, data) => {
            state.curFile.filepath = data
        },
        UPDATE_LOG: (state, log) => {
            let logs = state.log
            logs.push(log)
            state.log = logs
        },
        UPDATE_FILES: (state) => {
            const files = fs.readdirSync(state.curFile.filefolder).map(f => {
                return `${state.curFile.filefolder}/${f}`.replace(/\\/g, '/')
                //=> Disk:/../folder/file
            })
            state.curFile.files = files
        }
        
    },
    actions: {
        //:: 讀取載入的檔案
        // LOAD_FILE: (context, file) => {
        //     // 判斷是否為資料夾

        // },

        //:: 隨機挑選圖片
        RANDOM_FILE: context => {
            function randomChoice(arr) {
                return arr[Math.floor(Math.random() * arr.length)];
            }
            const files = context.state.curFile.files
            //? 如果資料夾內有多個檔案才執行
            if (files.length > 0) {
                context.commit('UPDATE_CURFILE_PATH', randomChoice(files))
                context.commit('UPDATE_FILES')
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
        getFoldername: (state, getters) => {
            return path.basename(getters.getFolderPath)
        },
        //:: Folder Files_list
        getFilesList: (state, getters) => {
            const files = fs.readdirSync(getters.getFolderPath).map(f => {
                return `${getters.getFolderPath}/${f.replace(/\\/g, '/')}`
            })
            return files
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
