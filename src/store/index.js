import Vue from "vue";
import Vuex from "vuex";
import fs from 'fs-extra'
import mime from 'mime-types'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        mode: "random",
        curFile: {
            filepath: 'public/static/picnel.io.png',
            filetype: 'image'
        },

    },
    mutations: {
        SET_CURFILE: (state, data) => {
            state.curFile = data
        }
    },
    actions: {
        LOAD_FILE: async (context, file) => {
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
                const data = {
                    filepath: files[0],
                    filetype: type,
                }
                context.commit('SET_CURFILE', data)
            }
            else {
                const data = {
                    filepath: file.path.replace(/\\/g, '/'),
                    filetype: file.type.split('/')[0],
                }
                context.commit('SET_CURFILE', data)
            }
        }

    },
    modules: {},
    getters: {

        getFilePath: state => {
            return state.curFile.filepath
        },

        getFileType: state => {
            return state.curFile.filetype
        },

    }
});
