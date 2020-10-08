<template>
    <div id="statusbar">
        <!-- Folder Reset -->
        <div class="folder-reset status-button status-item" @click="resetfolder">
            <p>♻</p>
        </div>

        <div
            v-if="tempfileslist.length >= 3000 || mode === 'Multiple'"
            class="folder-refresh status-button status-item" 
            @click="refreshfolder">
            <p>Refresh</p>
        </div>

        <!-- Upload Folder -->
        <div class="upload-btn-wrapper status-button status-item" @contextmenu="mainfolderContext">
            <label class="directory-upload">
                <input type="file" @change="uploaddir" webkitdirectory directory />
                <p>{{this.foldername}} <span v-if="tempfileslist.length >= 3000" class="cache-mode">(Cache)</span></p>
            </label>
        </div>

        <!-- Folder Info -->
        <div class="status-item folder-info">
            <p v-if="file === '' ">Directorys: 0 / Files: 0 / Readable: 0</p>
            <p v-if="file !== '' ">{{this.folderinfo}}</p>
        </div>
        <!-- File -->
        <div class="status-item cur-fileindex" v-if="mode !== 'Multiple'">
            <p>Index: {{this.fileindex + 1}}</p>
        </div>

        <div class="status-item cur-filename" v-if="mode !== 'Multiple'">
            <p>{{this.filename}}</p>
        </div>


        <!-- Context Menu -->
        <Mainfoldercontext  @opendirectory="openfolder"/>
        
        <!-- Notify -->
        <notifications group="statusbar" position="bottom right" animation-type="velocity"/>

    </div>
</template>

<script>
    import { mapGetters } from 'vuex'
    import mime from 'mime-types'
    import { shell, remote } from 'electron'
    import Mainfoldercontext from  '@/components/contextmenu/Mainfoldercontext.vue'
    
    // Notify
    import { noReset, noReadable, notFound } from '@/assets/func/notify.js'

    // Helper
    import { getRootPath } from '@/assets/func/helper.js'

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
                // => Disk:/../../xxx.ext
                const abspath = (e.target.files[0].path).split('\\')
                
                // => folder/xxx.ext
                const relpath = (e.target.files[0].webkitRelativePath).split('/')[0]

                // Get root path
                let root = getRootPath(abspath, relpath)
               
                this.$store.commit('SET_TEMP_FILES_LIST', root)

                this.tempfileslist.map(f => {
                    let type = mime.lookup(f)
                    if(type !== false){
                        if(readable.includes(type.split('/')[0])){
                            readablefiles.push(f)
                        }
                    }
                })

                // No readable files
                if (readablefiles.length === 0){
                    this.$store.commit('CLEAR_TEMP_FILES_LIST')
                    this.$notify(noReadable("statusbar"))
                }
                else{
                    this.$store.commit('SET_CURFILE', readablefiles[0])
                    this.$store.commit('UPDATE_FILES_LIST')
                    
                    if (this.tempfileslist.length > 3000){
                        this.$modal.show("dialog", {
                            title: '🚧 Cache Files List Auto Enable',
                            text: "When directory have over 3000 files, it will use cache files list, that means it won't update directory with all operation outside Picnel.io 2, untill you click 'Refresh'.",
                            buttons:[
                                {
                                    title: "Got it",
                                    class: "dialog-btn dialog-green-btn",
                                    handler: () => {
                                        this.$modal.hide("dialog")
                                    }
                                },
                                {
                                    title: "Learn more",
                                    class: "dialog-btn dialog-red-btn",
                                    handler: () => {
                                        remote.shell.openExternal("https://proladon.github.io/Picnel.io-2_Documentation/cache/")
                                        this.$modal.hide("dialog")
                                    }
                                }
                            ]
                        })
                    }
                    else{
                        this.$store.commit('CLEAR_TEMP_FILES_LIST')
                    }
                }

                // reset selected file, or it won't be firing onchange event later!
                e.target.value = null
            },
            
            
            //:: Reset Folder
            resetfolder() {
                if (this.filename === '') {
                    this.$notify(noReset("home"))
                    return
                }
                this.$store.commit('SET_CURFILE', "")
                this.$store.commit('CLEAR_TEMP_FILES_LIST')
            },
            
            
            refreshfolder(){
                if (this.tempfileslist.length > 3000){
                    this.$store.commit('SET_TEMP_FILES_LIST', this.folderpath)
                }
                else{
                    this.$store.commit('UPDATE_FILES_LIST')
                }
            },
            
            
            mainfolderContext(e){
                const element = document.getElementById("mainfolder-context")
                element.classList.remove("context-active")
                element.style.top = parseInt(e.clientY)-50  + "px"
                element.style.left = e.clientX + "px"
                
                setTimeout(() => {
                    element.classList.add("context-active")
                }, 150)
            },


            openfolder(){
                if (this.filename == ''){
                    this.$notify(notFound("statusbar", "directory"))
                }
                else{
                    shell.openPath(this.folderpath)
                }
            },
        },

        computed: {
            tempfileslist(){
                return this.$store.state.cache.tempFilesList
            },
            mode(){
                return this.$store.state.mode
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
            const element = document.getElementById("mainfolder-context")
            
            window.addEventListener("click", () => {
                element.classList.remove("context-active")
            })
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
            padding-left: 5px;
            padding-right: 5px;
            background-color: transparent;
            transition: ease-in-out .3s;
        }

        .status-button:hover {
            background-color: rgba($color: white, $alpha: .2);
        }
    }
    .folder-reset, .folder-refresh{
        display: flex;
        justify-content: center;
        align-items: center;
        // width: 30px;
        
        height: 100%;
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
    }

    .directory-upload {
        width: 100%;
        height: 100%;
        color: mediumspringgreen;
        // display: inline-block;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;

        input[type="file"] {
            display: none;
        }
    }

    .context-active {
        transform: scale(1) !important;
    }

    .cache-mode{
        color: orange;
    }
</style>