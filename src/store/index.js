import Vue from "vue";
import Vuex from "vuex";
import fs from 'fs-extra'
import mime from 'mime-types'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        mode: "random",
        home: {
            filefolder: "public/static/",
            foldername: 'Open Folder',
            files: [],
            index: 0,
            filepath: 'public/static/picnel.io.png',
            filetype: 'image'
        },
        curFile: {},
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
        LOAD_FILE: (context, file) => {
            let data = {
                filefolder: file.path,
                foldername: file.name,
                folderinfo: context.getters.getFolderInfo,
                files: [],
                index: 0,
                filepath: "",
                filetype: "",
            }
            // 判斷是否為資料夾
            if (fs.lstatSync(file.path).isDirectory()) {
                // 列出資料夾內所有檔案
                const files = fs.readdirSync(file.path).map(f => {
                    return `${ file.path}/${f}`.replace(/\\/g, '/')
                    //=> Disk:/../folder/file
                });
                
                // 取得檔案類型
                const type = mime.lookup(files[0]).split('/')[0]
                // todo 當第一個檔案不是圖片或影片
                // todo 當資料夾內沒有任何圖片或影片

                data.files = files
                data.filepath = files[0]
                data.filetype = type
                context.commit('SET_CURFILE', data)
            }
            else {
                data.filepath = file.path.replace(/\\/g, '/')
                data.filetype = file.type.split('/')[0]
                context.commit('SET_CURFILE', data)
            }
        },

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

        // PRENEXT_FILE: context => {

        // },

        DELETE_FILE: context => {
            fs.remove(context.state.curFile.filepath, function(err){
                if (err) return console.error(err);
                console.log("success!")
            });
        }

    },
    modules: {},
    getters: {
        //:: 檔案路徑
        getFilePath: state => {
            return state.curFile.filepath
        },
        //:: 檔案類型
        getFileType: state => {
            return state.curFile.filetype
        },
        //:: 檔案類型
        getMode: state => {
            return state.mode
        },
        //:: 資料夾資訊
        getFolderInfo: state => {
            const files = state.curFile.files
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
