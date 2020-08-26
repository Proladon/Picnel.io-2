<template>
    <div id="statusbar">
        <!-- Folder Reset -->
        <div class="folder-reset status-button status-item" @click="resetfolder">
            ♻
        </div>

        <!-- Upload Folder -->
        <div class="upload-btn-wrapper status-button status-item" @contextmenu="mainfolderContext">
            <label class="directory-upload">
                <input type="file" @change="uploaddir" webkitdirectory directory />
                <p v-if="foldername === 'static'">Upload Folder</p>
                <p v-if="foldername !== 'static'">{{this.foldername}}</p>
            </label>
        </div>

        <!-- Folder Info -->
        <div class="status-item folder-info">
            <p>{{this.folderinfo}}</p>
        </div>
        <!-- File -->
        <div class="status-item cur-fileindex">
            <p>Index: {{this.fileindex + 1}}</p>
        </div>

        <div class="status-item cur-filename">
            <p>{{this.filename}}</p>
        </div>


        <!-- Context Menu -->
        <Mainfoldercontext  @opendirectory="openfolder"/>
        
        <!-- Notify -->
        <notifications group="statusbar" position="bottom right" animation-type="velocity"/>

    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import fs from 'fs-extra'
    import path from 'path'
    import mime from 'mime-types'
    import { shell } from 'electron'
    import Mainfoldercontext from  '@/components/contextmenu/Mainfoldercontext.vue'

    export default {
        name: 'Statusbar',
        components:{
            Mainfoldercontext,
        },
        methods: {
            //:: Upload Folder
            uploaddir(e) {
                const readable = ['image', 'video', 'audio']
                let readablefiles = []
                
                // Get Select Folder Path
                const abspath = (e.target.files[0].path).split('\\')
                const relpath = (e.target.files[0].webkitRelativePath).split('/')[0]
                let root = ""
                for(let p of abspath){
                    if (p !== relpath){
                        root += p + '/'
                    }
                    else if (p === relpath){
                        root += p
                        break
                    }
                }

                fs.readdirSync(root).map(f => {
                    let type = mime.lookup(path.join(root, f))
                    if(type !== false){
                        if(readable.includes(type.split('/')[0])){
                            readablefiles.push(path.join(root, f))
                        }
                    }
                })
                // No readable files
                if (readablefiles.length === 0){
                    this.$notify({
                        group: 'statusbar',
                        type: 'warn',
                        title: 'Warn',
                        text: 'No readable files in the directory'
                    });
                }
                else{
                    this.$store.commit('SET_CURFILE', readablefiles[0])
                }

                // reset selected file, or it won't be firing onchange event!
                e.target.value = null
            },
            //:: Reset Folder
            resetfolder() {
                if (this.foldername === 'static') {
                    this.$notify({
                        group: 'home',
                        type: 'warn',
                        title: 'Notification',
                        text: 'No need to reset.'
                    });
                    return
                }
                this.$store.commit('SET_CURFILE', this.home)
                // logging
                this.$store.commit('UPDATE_LOG', "reset folder")
            },
            mainfolderContext(e){
                const element = document.getElementById("mainfolder-context");
                element.classList.remove("context-active");
                element.style.top = parseInt(e.clientY)-50  + "px";
                element.style.left = e.clientX + "px";
                setTimeout(() => {
                    element.classList.add("context-active");
                }, 150);
            },

            openfolder(){
                if (this.folderpath == 'public/static'){
                    this.$notify({
                        group: 'statusbar',
                        type: 'error',
                        title: 'Error',
                        text: 'No found directory'
                    })
                }
                else{
                    shell.openPath(this.folderpath)
                }
            },
        },
        computed: {
            home() {
                return this.$store.state.home
            },
            ...mapGetters({
                file: 'getCurFilePath',
                filename: 'getFileName',
                fileindex: 'getFileIndex',
                folderpath: 'getFolderPath',
                folderinfo: 'getFolderInfo',
                foldername: 'getFolderName',
            })
        },
        mounted(){
            const element = document.getElementById("mainfolder-context");
            window.addEventListener("click", () => {
                element.classList.remove("context-active");
            });
        }
        
    }
</script>

<style scoped lang="scss">
    // Status Bar
    #statusbar {
        width: 100%;
        height: 30px;
        position: absolute;
        display: flex;
        padding-left: 15px;
        padding-right: 15px;
        align-items: center;
        bottom: 0;
        background: var(--statusbar);


        .status-item {
            cursor: default;
            color: white;
            margin-right: 15px;
        }

        .status-button {
            cursor: pointer;
            background-color: transparent;
            transition: ease-in-out .3s;
        }

        .status-button:hover {
            background-color: rgba($color: white, $alpha: .2);
        }
    }

    .folder-info{
        color: lightgray !important;
    }
    .cur-fileindex {
        color: lightblue !important;
    }
    .cur-filename {
        color: var(--lightyellow) !important;
    }

    // Input: directory
    .upload-btn-wrapper {
        height: 100%;
        display: flex;
        align-items: center;
    }

    .directory-upload {
        color: mediumspringgreen;
        display: inline-block;
        cursor: pointer;

        input[type="file"] {
            display: none;
        }
    }

    .context-active {
        transform: scale(1) !important;
    }
</style>