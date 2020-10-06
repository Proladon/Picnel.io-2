<template>
    <div
        id="viewer"
        @dragover.prevent="dragging"
        @dragleave.prevent="dragleave"
        @drop.prevent="drop"
    >
        <div id="view-area" v-viewer="{ navbar: false }">
            <img class="files-viewer"
                src="@/assets/icon/picnel.io.png"
                v-if=" curfile === '' "
            />
            <!-- Image Viewer -->
            <img class="files-viewer"
                :src="`local-resource://${curfile}`"
                v-if="curfile !== '' && filetype === 'image'&&mode !== 'Multiple'"
            />
            <!-- Video Viewer -->
            <video class="files-viewer"
                :src="`local-resource://${curfile}`"
                controls
                v-if="curfile !== '' && filetype === 'video'&&mode !== 'Multiple'"
            ></video>
            <!-- Audio Viewer -->
            <audio class="files-viewer"
                :src="`local-resource://${curfile}`"
                controls
                v-if="curfile !== '' && filetype === 'audio'&&mode !== 'Multiple'"
            ></audio>
            <!-- Multiple Viewer -->
            
            <div 
                class="files-viewer multiple-viewer"
                v-if="mode === 'Multiple' "
                v-lazy-container="{ selector: 'img' }"
            >
                
                <div class="file-item-wrapper" v-for="(img,index) in files" :key="img">
                    <Checkbox class="select-check" :value="img" v-model="tempSelected" color="#f50057" @change="fileSelected(index, img)"></Checkbox>
                    <div class="file-img-wrapper">
                        <img class="file-item"  :data-src="`local-resource://${img}`" @load="loaded($event, index)"/>
                        <canvas class="canvas-file-item"></canvas>
                    </div>
                </div>

            </div>
        </div>


        <div class="selected-info" v-show="mode === 'Multiple'">
            <p>Selected: {{tempSelected.length}}</p>
            <div class="select-controls" @click="selectAll">Select All</div>
            <div class="select-controls" @click="cancelAll">Cancel All</div>
        </div>

        <!-- Controls -->
        <div class="operate-btn-wrapper" v-show="mode !== 'Multiple'">
            
            <div class="operate-btn" @click="openfile">
                <img src="@/assets/icon/openfolder.svg">
            </div>
            
            <div class="operate-btn" @click="renamefile">
                <img src="@/assets/icon/typing.svg">
            </div>

            <div class="operate-btn" @click="copyimage">
                <img src="@/assets/icon/paper.svg">
            </div>

            <div class="operate-btn" @click="deletefile">
                <img src="@/assets/icon/delete.svg">
            </div>

        </div>

        <!-- StartEnd Btn -->
        <div id="start-index" class="view-control" v-show="mode !== 'Multiple'">
            <button @click="goStart">Start</button>
        </div>

        <div id="end-index" class="view-control" v-show="mode !== 'Multiple'">
            <button @click="goEnd">End</button>
        </div>
        
        <!-- Random Btn -->
        <div id="random-mode" class="view-control" v-show="mode === 'Random'">
            <button @click="random" ref="randombtn">Random</button>
        </div>
        <!-- PreNext Btn -->
        <div id="prenext-mode" class="view-control" v-show="mode === 'PreNext'">
            <button @click="previous" ref="prebtn">← Previous</button>
            <button @click="next" ref="nextbtn">Next →</button>
        </div>

        <!-- Notify -->
        <notifications
            group="random"
            position="bottom right"
            animation-type="velocity"
        />
        <notifications
            group="nofiles"
            position="bottom right"
            animation-type="velocity"
        />

    </div>
</template>

<script>
import {shell, remote} from 'electron'
import { mapGetters } from "vuex";
import anime from "animejs";
import "viewerjs/dist/viewer.css";
import fs from "fs-extra";
import Store from 'electron-store'
// import path from 'path'
import mime from "mime-types";
import {filesFilter, deletefileLogging} from "@/assets/func/helper.js";
import {plsUploadFolder} from "@/assets/func/notify.js";

import Checkbox from 'vue-material-checkbox'


export default {
    name: "Viewer",
    components: {Checkbox},

    methods: {
        dragging() {},
        dragleave() {},
        drop(e) {
            if (e.dataTransfer.items) {
                if (e.dataTransfer.items[0].kind === "file") {
                    const file = e.dataTransfer.items[0].getAsFile();
                    if (fs.lstatSync(file.path).isDirectory()) {
                        // Directory
                        let readable = ["image", "video", "audio"];
                        

                        this.$store.commit('SET_TEMP_FILES_LIST', file.path.replace(/\\/g, '/'))
                        
                        let readablelist = this.tempfileslist.filter((f) => {
                                let type = mime.lookup(f);
                                if (type !== false &&readable.includes(type.split("/")[0])) {
                                    return f;
                                }
                            });

                        // No readable files
                        if (readablelist.length === 0) {
                            this.$store.commit('CLEAR_TEMP_FILES_LIST')
                            this.$notify({
                                group: "nofiles",
                                type: "error",
                                title: "Error",
                                text: "No readable files in the directory",
                            });
                        } else {
                            this.$store.commit("SET_CURFILE",readablelist[0])

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
                    } else {
                        // Single File
                        this.$store.commit("SET_CURFILE", file.path);
                    }
                }
            }
        },
        random() {
            if (this.filename === "") {
                this.$notify(plsUploadFolder);
                return;
            }
            this.$store.dispatch("RANDOM_FILE");
        },
        previous() {
            if (this.filename === "") {
                this.$notify(plsUploadFolder);
                return;
            }
            this.$store.dispatch("PRE_FILE");
        },
        next() {
            if (this.filename === "") {
                this.$notify(plsUploadFolder);
                return;
            }
            this.$store.dispatch("NEXT_FILE");
        },
        goStart() {
            if (this.filename === "") {
                this.$notify(plsUploadFolder);
                return;
            }
            const files = filesFilter(this.files);
            this.$store.commit("SET_CURFILE", files[0]);
        },
        goEnd() {
            if (this.filename === "") {
                this.$notify(plsUploadFolder);
                return;
            }
            const files = filesFilter(this.files);
            this.$store.commit("SET_CURFILE", files[files.length - 1]);
        },
        deletefile() {
            if (this.filename === "") {
                this.$notify(plsUploadFolder);
                return;
            }
            // 警告永久刪除
            this.$modal.show("dialog", {
                title: "Delete File",
                text: "This will delete file permanently !",
                buttons: [
                    {
                        title: "Delete",
                        class: "dialog-red-btn dialog-btn",
                        handler: () => {
                            let index = this.fileindex
                            fs.remove(this.curfile)
                                .then(()=>{
                                    if(this.tempfileslist.length > 3000){
                                        this.$store.commit('REMOVE_TEMP_FILES_ITEM', index)
                                    }
                                    if(this.mode === 'Random'){
                                        this.$store.dispatch('RANDOM_FILE')
                                    }
                                    else if (this.mode === 'PreNext'){
                                        this.$store.dispatch("AFTER_MOVE_NEXT", index)
                                    }
                                })
                            this.$store.commit('UPDATE_LOG', {
                                logger: 'Deletelog',
                                log: deletefileLogging(this.filename, this.curfile)
                            })
                            
                            this.$modal.hide("dialog");
                        },
                    },
                    {
                        title: "Cancel",
                        class: "dialog-green-btn dialog-btn",
                        handler: () => {
                            this.$modal.hide("dialog");
                        },
                    },
                ],
            });
        },
        copyimage(){
            if (this.filename === "") {
                this.$notify(plsUploadFolder);
                return;
            }
            const Copyfile = () => import("@/components/modal/Copyfile.vue")
            this.$modal.show(
                Copyfile,
                {curfile: this.curfile, filename: this.filename},
                {width:'400', classes: 'addfolders-modal'}
            )
        },
        openfile(){
            if (this.filename === "") {
                this.$notify(plsUploadFolder);
                return;
            }
            const filepath = this.curfile.replace(/[/]/g, '\\')
            shell.showItemInFolder(filepath)
        },
        renamefile(){
            if (this.filename === "") {
                this.$notify(plsUploadFolder);
                return;
            }
            const Renamefile = () => import("@/components/modal/Renamefile.vue")
            this.$modal.show(
                Renamefile,
                {filepath:this.curfile, filename: this.filename},
                {width:'400', classes: 'addfolders-modal'}
            )
        },
        loaded(e, index){
            if(this.mode !== 'Multiple') return
            let i = e.target
            const canvas = document.getElementsByClassName('canvas-file-item');
            
            let context = canvas[index].getContext("2d")
            canvas[index].width = i.width
            canvas[index].height = i.height
            context.drawImage(i, 0, 0, i.width, i.height);
        },
        fileSelected(index, img){
            const wrapper = document.getElementsByClassName('file-item-wrapper')
            if (this.tempSelected.includes(img)){
                wrapper[index].classList.add('selected')
            }
            else{
                wrapper[index].classList.remove('selected')
            }
        },
        selectAll(){
            this.$store.commit('RESET_SELECTED')
            for (let i of this.files){
                this.$store.commit('ADD_SELECTED', i)
            }
            const el = document.getElementsByClassName('file-item-wrapper')
            el.forEach(element => {
                element.classList.add('selected')
            });
        },
        cancelAll(){
            this.$store.commit('RESET_SELECTED')
            const el = document.getElementsByClassName('file-item-wrapper')
            el.forEach(element => {
                element.classList.remove('selected')
            });
        }
    },
    computed: {
            tempfileslist(){
                return this.$store.state.cache.tempFilesList
            },
            viewer_anime(){
                return this.$store.state.config.viewer_anime
            },
            tempSelected:{
                get(){
                    return this.$store.state.cache.tempSelected
                },
                set(data){
                    this.$store.commit('UPDATE_SELECTED', data)
                }
            },
        ...mapGetters({
            curfile: "getCurFilePath",
            filename: "getFileName",
            fileindex: 'getFileIndex',
            filetype: "getFileType",
            files: "getFilesList",
            mode: "getMode",
        }),
    },
    watch: {
        curfile() {
            const store = new Store()
            if(store.get('user_configs.viewer_anime')){
                anime({
                    targets: [".files-viewer"],
                    opacity: ["0", "1"],
                    duration: 1000,
                    easing: "easeInOutQuad",
                })
            }
        },

    },
};
</script>

<style scoped lang="scss">
#viewer {
    width: 100%;
    height: 100%;
    position: relative;
    background-color: var(--dark);
}

#view-area {
    overflow: auto;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    img,
    video {
        max-width: 100%;
        max-height: 100%;
    }
}

.view-control {
    width: 100%;
    height: 50px;
    position: absolute;
    bottom: 0;
    opacity: 0;
    transition: ease-in-out 0.3s;

    button {
        width: 100%;
        height: 100%;
        border: none;
        outline: none;
    }
    button:active {
        background-color: rgb(200, 200, 200);
    }
}

.operate-btn-wrapper{
    position: absolute;
    top: 0;
    width: 100%;
    height: 50px;
    background-color: white;
    opacity: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: ease-in-out 0.3s;
}

.operate-btn-wrapper:hover{
    opacity: 0.3;
}

.operate-btn{
    cursor: pointer;
    width: 50px;
    height: 50px;
    margin-left: 10px;
    margin-right: 10px;
    display: flex;
    justify-content: center;
    align-items: center;

    img{
        filter: grayscale(100%);
        width: 70%;
    }
}

.operate-btn:hover{
    background-color: var(--sidebar);
}

// ---------------- //
//            Start-End          //
// ---------------- //
#start-index,
#end-index {
    cursor: default;
    position: absolute;
    width: 70px;
    height: 70px;
    top: calc(50% - 50px);
}

#start-index:hover,
#end-index:hover {
    background: white;
    opacity: 0.3;
}

#start-index {
    font-size: 20px;
    left: 0;
}

#end-index {
    font-size: 20px;
    right: 0;
}

// ---------------- //
//             Random            //
// ---------------- //
#random-mode button {
    font-size: 20px;
    width: 100%;
    height: 100%;
}

#random-mode:hover {
    opacity: 0.3;
}

// ---------------- //
//             PreNext            //
// ---------------- //
#prenext-mode {
    display: flex;
}
#prenext-mode button {
    font-size: 20px;
    width: 100%;
    height: 100%;
}

#prenext-mode button:hover {
    opacity: 0.7;
}

#prenext-mode:hover {
    opacity: 0.3;
}
// ---------------- //
//        Selected-info       //
// ---------------- //
.selected-info{
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 0;
    width: 100%;
    height: 30px;
    background-color: var(--dark);

    color: mediumspringgreen;
}

.select-controls{
    margin-left: 10px;
    cursor: pointer;
    padding: 5px;
    color: lightgray;
    box-sizing: border-box;
    border: solid 2px var(--lightyellow);
    border-radius: 8px;
}

.select-controls:hover{
    color: var(--dark);
    background-color: cadetblue;
}
// ---------------- //
//             Context             //
// ---------------- //
.context-active {
    transform: scale(1) !important;
}

.multiple-viewer{
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    padding-top: 60px;
    padding-left: 5px;
    padding-right: 5px;

    
    
    .file-item-wrapper{
        
        display: flex;
        flex-direction: column;
        padding: 5px;
        margin: 5px;

        .select-check{
            cursor: default;
            margin: 0;
            margin-bottom: 3px;
        }

        .file-img-wrapper{
            position: relative;
            
            .file-item{
                cursor: pointer;
                width: 100px;
                height: 100px;
                object-fit: cover;
                opacity: 0;
                
            }

            .canvas-file-item{
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                pointer-events: none;
                width: 100px;
                height: 100px;
                background:rgba($color: skyblue, $alpha: .3);
            }
        }
    }
    .selected{
        background-color: rgba($color: lightblue, $alpha: .5);
    }

}
</style>

