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
                <p v-if="foldername !== 'static'">{{foldername}}</p>
            </label>
        </div>

        <!-- Folder Info -->
        <div class="folder-info status-item">
            <p>{{filename}}</p>
        </div>

        <!-- File -->
        <div class="status-item">
            <p>{{this.file}}</p>
        </div>

        <!-- Context Menu -->
        <Mainfoldercontext  @opendirectory="openfolder"/>

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
                        group: 'foo',
                        type: 'error',
                        title: 'Error',
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
                element.style.top = parseInt(e.clientY)-70  + "px";
                element.style.left = e.clientX + "px";
                setTimeout(() => {
                    element.classList.add("context-active");
                }, 150);
            },

            openfolder(){
                if (this.folderpath == 'public/static'){
                    this.$notify({
                        group: 'foo',
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
                folderpath: 'getFolderPath',
                folderinfo: 'getFolderInfo',
                foldername: 'getFolderName'
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
            color: white;
            margin-right: 10px;
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

    // Input: directory
    .upload-btn-wrapper {
        height: 100%;
        display: flex;
        align-items: center;
    }

    .directory-upload {
        color: lightgrey;
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