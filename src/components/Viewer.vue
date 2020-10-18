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
                
                <div class="file-item-wrapper" v-for="(img,index) in items" :key="img">
                    <Checkbox class="select-check"  :value="img" v-model="tempSelected" color="#f50057" @change="fileSelected(index, img)" v-if="curfile !== ''">
                        # {{readable.indexOf(img) + 1}}
                    </Checkbox>

                    <div class="file-img-wrapper">
                        <img class="file-item"  :data-src="`local-resource://${img}`" @load="loaded($event, index)" v-if="curfile !== ''" />
                        <canvas class="canvas-file-item" v-if="curfile !== ''"></canvas>
                    </div>
                </div>

                <vue-ads-pagination 
                    class="pagination"
                    v-if="curfile !== '' && readable.length > 10"
                    :total-items="readable.length"
                    :page="page"
                    :max-visible-pages="5"
                    @range-change="rangeChange"
                >
                
                    <template
                        slot="buttons"
                        slot-scope="props"
                    >
                        <vue-ads-page-button
                            v-for="(button, key) in props.buttons"
                            :key="key"
                            v-bind="button"
                            :disable-styling="true"
                            class="pagination-btn"
                            :class="{active_page_light: button.active}"
                            @page-change="page = button.page"
                        />
                    </template>
                </vue-ads-pagination>

            </div>
        </div>


        <div class="selected-info" v-show="mode === 'Multiple'">
            <p>Selected: {{tempSelected.length}}</p>
            <div class="select-controls" @click="selectAll">Select All</div>
            <div class="select-controls" @click="cancelAll">Cancel All</div>
            <div class="select-controls delete-selected" @click="deleteSelected">Delete Selected</div>

            <div class="res-controls-wrapper">
                <div class="res-controls" title="Big Image" @click="big_res">B</div> 
                <div class="spliter">|</div>
                <div class="res-controls" title="Mid Image" @click="mid_res">M</div> 
                <div class="spliter">|</div>
                <div class="res-controls" title="Small Image" @click="small_res">S</div>
            </div>
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
            group="viewer"
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
import path from 'path'
import mime from "mime-types";
import {filesFilter, readable, deletefileLogging} from "@/assets/func/helper.js";
import {plsUploadFolder} from "@/assets/func/notify.js";

import Checkbox from 'vue-material-checkbox'
import VueAdsPagination, { VueAdsPageButton } from 'vue-ads-pagination';

export default {
    name: "Viewer",
    components: {
        Checkbox,
        VueAdsPagination,
        VueAdsPageButton,
    },
    data(){
        return{
            page: 0,
            items: [],
            resolution: 100,
        }
    },

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
                                group: "viewer",
                                type: "error",
                                title: "Error",
                                text: "No readable files in the directory",
                            })

                        } else {
                            this.$store.commit("SET_CURFILE",readablelist[0])
                            this.$store.commit("UPDATE_FILES_LIST")

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
            
            const files = this.tempfileslist.length >= 3000 ?
                filesFilter(this.tempfileslist) : filesFilter(this.fileslist)

            this.$store.commit("SET_CURFILE", files[0]);
        },
        goEnd() {
            if (this.filename === "") {
                this.$notify(plsUploadFolder);
                return;
            }
            
            const files = this.tempfileslist.length >= 3000 ?
                filesFilter(this.tempfileslist) : filesFilter(this.fileslist)

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

                            const afterTreatment = ()=>{
                                if(this.tempfileslist.length >= 3000){
                                    this.$store.commit('REMOVE_TEMP_FILES_ITEM', index)
                                }
                                if(this.mode === 'Random'){
                                    this.$store.dispatch('RANDOM_FILE')
                                }
                                else if (this.mode === 'PreNext' || this.mode === 'Multiple'){
                                    this.$store.dispatch("AFTER_MOVE_NEXT", index)
                                }
                            }

                            // Delete File

                            this.$notify({
                                group: 'viewer',
                                clean: true,
                            })
                            
                            if(this.mode === 'Multiple'){
                                for(let f of this.tempSelected){
                                    fs.remove(f)
                                        .then(()=>{
                                            this.$store.commit('UPDATE_FILES_LIST')
                                            
                                            afterTreatment()
                                            
                                            this.$store.commit('UPDATE_LOG', {
                                                logger: 'Deletelog',
                                                log: deletefileLogging(path.basename(f), f)
                                            })
                                        })
                                }

                                if(this.delete_notify){
                                    this.$notify({
                                        group: 'viewer',
                                        title: 'Delete File',
                                        type: 'success',
                                        text: `Delete ${this.tempSelected.length} files success`
                                    })
                                }
                            }
                            else{
                                fs.remove(this.curfile)
                                    .then(()=>{
                                        this.$store.commit('UPDATE_FILES_LIST')
                                        
                                        afterTreatment()
                                        
                                        this.$store.commit('UPDATE_LOG', {
                                            logger: 'Deletelog',
                                            log: deletefileLogging(this.filename, this.curfile)
                                        })
                                })

                                if (this.delete_notify){
                                    this.$notify({
                                        group: 'viewer',
                                        title: 'Delete File',
                                        type: 'success',
                                        text: `Delete file success`
                                    })
                                }
                            }

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
            // canvas[index].width = i.width
            // canvas[index].height = i.height
            // context.drawImage(i, 0, 0, i.width, i.height);
            canvas[index].width = this.resolution
            canvas[index].height = this.resolution
            context.drawImage(i, 0, 0, this.resolution, this.resolution);
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
            for (let i of this.fileslist){
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
        },

        deleteSelected(){
            if(this.tempSelected.length === 0) return
            this.deletefile()
        },

        rangeChange(start){
            this.items = []
            document.getElementById('view-area').scrollTo({
                top:0,
            })
            
            for (let count=0; count<10; count++){
                
                    if (this.tempSelected.includes(this.fileslist[start])){
                        setTimeout(() => {
                            const wrapper = document.getElementsByClassName('file-item-wrapper')
                            wrapper[count].classList.add('selected')
                        })
                    }
                if(this.fileslist[start] !== undefined && readable(this.fileslist[start], 'image')) this.items.push(this.fileslist[start])
                start++
            }
        },

        changeResolution(e){
            const controls = document.getElementsByClassName('res-controls')
            controls.forEach(el => {
                el.classList.remove('res-active')
            })
            e.target.classList.add('res-active')

            let root = document.documentElement;
            root.style.setProperty('--image-resolution', this.resolution + "px")

            const canvas = document.getElementsByClassName('canvas-file-item');
            const imgs = document.getElementsByClassName('file-item');
            
            for(let index=0; index<10; index++){
                let context = canvas[index].getContext("2d")
    
                canvas[index].width = this.resolution
                canvas[index].height = this.resolution
                context.drawImage(imgs[index], 0, 0, this.resolution, this.resolution);
            }
        },

        big_res(e){
            
            this.resolution = 500
            this.changeResolution(e)
        },
        mid_res(e){
            this.resolution = 250
            this.changeResolution(e)
        },
        small_res(e){
            this.resolution = 100
            this.changeResolution(e)
        }
    },
    computed: {

            fileslist(){
                if(this.tempfileslist.length >= 3000){
                    return this.tempfileslist
                }
                else{
                    return this.$store.state.fileslist
                }
            },
            tempfileslist(){
                return this.$store.state.cache.tempFilesList
            },
            viewer_anime(){
                return this.$store.state.config.viewer_anime
            },
            delete_notify(){
                return this.$store.state.config.delete_notify
            },
            tempSelected:{
                get(){
                    return this.$store.state.cache.tempSelected
                },
                set(data){
                    this.$store.commit('UPDATE_SELECTED', data)
                }
            },
            readable(){
                return filesFilter(this.fileslist, 'image')
            },
            


        ...mapGetters({
            curfile: "getCurFilePath",
            filename: "getFileName",
            fileindex: 'getFileIndex',
            filefolder: 'getFolderPath',
            filetype: "getFileType",
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
        fileslist(){
            this.items = []
            for (let count=0; count<10; count++){
                let file = this.fileslist[count]
                if(file !== undefined && readable(file, 'image')){
                    this.items.push(file)
                } 
            }
        },
        filefolder(){
            this.page = 0
        },
    },
    mounted(){
        let root = document.documentElement;
        root.style.setProperty('--image-resolution', this.resolution + "px")
    }
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

.delete-selected:hover{
    background-color: rgb(212, 91, 128);
}

.res-controls-wrapper{
    display: flex;
    margin-left: 10px;
    padding: 5px;
    color: lightgray;
    box-sizing: border-box;
    border: solid 2px var(--lightyellow);
    border-radius: 8px;

    .res-controls{
        cursor: pointer;
    }

    .spliter{
        margin-left: 5px;
        margin-right: 5px;
    }

    .res-active{
        color: orange;
    }
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
            color: var(--lightyellow);
            margin: 0;
            margin-bottom: 3px;
        }

        .file-img-wrapper{
            position: relative;
            
            .file-item{
                cursor: pointer;
                width: var(--image-resolution);
                height: var(--image-resolution);
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
                width: var(--image-resolution);
                height: var(--image-resolution);
                background:rgba($color: skyblue, $alpha: .3);
            }
        }
    }
    .selected{
        background-color: rgba($color: lightblue, $alpha: .5);
    }

}

// ---------------- //
//           pagination         //
// ---------------- //
.pagination{
    color: gray;
    width: 100%;
    text-align: center;
}

.pagination-btn{
    cursor: pointer;
    color: var(--lightyellow);
    background-color: transparent;
    border: none;
    border-radius: 10px;
    padding: 10px;
    outline: none;
}
.pagination-btn:hover{
    border:solid 2px cadetblue ;
}

.active_page_light{
    background: rgba($color: white, $alpha: .15) ;
}

</style>

