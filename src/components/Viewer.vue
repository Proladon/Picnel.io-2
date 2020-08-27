<template>
    <div
        id="viewer"
        @dragover.prevent="dragging"
        @dragleave.prevent="dragleave"
        @drop.prevent="drop"
    >
        <div id="view-area" v-viewer="{ navbar: false }">
            <!-- Image Viewer -->
            <img class="files-viewer"
                :src="`local-resource://${curfile}`"
                v-show="curfile !== 'undefined' && filetype === 'image'"
            />
            <!-- Video Viewer -->
            <video class="files-viewer"
                :src="`local-resource://${curfile}`"
                controls
                v-show="curfile !== 'undefined' && filetype === 'video'"
            ></video>
            <!-- Audio Viewer -->
            <audio class="files-viewer"
                :src="`local-resource://${curfile}`"
                controls
                v-show="curfile !== 'undefined' && filetype === 'audio'"
            ></audio>
        </div>

        <!-- Controls -->
        <div class="operate-btn-wrapper">
            
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
        <div id="start-index" class="view-control">
            <button @click="goStart">Start</button>
        </div>

        <div id="end-index" class="view-control">
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
import {shell} from 'electron'
import { mapGetters } from "vuex";
import anime from "animejs";
import "viewerjs/dist/viewer.css";
import fs from "fs-extra";
// import path from 'path'
import mime from "mime-types";
import {filesFilter, deletefileLogging} from "@/assets/func/helper.js";
export default {
    name: "Viewer",
    components: {},
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
                        let readablelist = fs
                            .readdirSync(file.path)
                            .filter((f) => {
                                let type = mime.lookup(f);
                                if (
                                    type !== false &&
                                    readable.includes(type.split("/")[0])
                                ) {
                                    return f;
                                }
                            });

                        // No readable files
                        if (readablelist.length === 0) {
                            this.$notify({
                                group: "nofiles",
                                type: "error",
                                title: "Error",
                                text: "No readable files in the directory",
                            });
                        } else {
                            this.$store.commit(
                                "SET_CURFILE",
                                `${file.path}/${readablelist[0]}`
                            );
                        }
                    } else {
                        // Single File
                        this.$store.commit("SET_CURFILE", file.path);
                    }
                    // Logging
                    // this.$store.commit('UPDATE_LOG', "update folder")
                }
            }
        },
        random() {
            if (this.filename === "picnel.io.png") {
                this.$notify({
                    group: "random",
                    type: "error",
                    title: "Error",
                    text: "Please open a main folder first.",
                });
                return;
            }
            this.$store.dispatch("RANDOM_FILE");
        },
        previous() {
            if (this.filename === "picnel.io.png") {
                this.$notify({
                    group: "random",
                    type: "error",
                    title: "Error",
                    text: "Please open a main folder first.",
                });
                return;
            }
            this.$store.dispatch("PRE_FILE");
        },
        next() {
            if (this.filename === "picnel.io.png") {
                this.$notify({
                    group: "random",
                    type: "error",
                    title: "Error",
                    text: "Please open a main folder first.",
                });
                return;
            }
            this.$store.dispatch("NEXT_FILE");
        },
        goStart() {
            const files = filesFilter(this.files);
            this.$store.commit("SET_CURFILE", files[0]);
        },
        goEnd() {
            const files = filesFilter(this.files);
            this.$store.commit("SET_CURFILE", files[files.length - 1]);
        },
        deletefile() {
            // 警告永久刪除
            this.$modal.show("dialog", {
                title: "Delete File",
                text: "This will delete file permanently !",
                buttons: [
                    {
                        title: "Delete",
                        class: "dialog-red-btn dialog-btn",
                        handler: () => {
                            try {
                                fs.removeSync(this.curfile)
                                this.$store.commit('UPDATE_LOG', {
                                    logger: 'Deletelog',
                                    log: deletefileLogging(this.filename, this.curfile)
                                })

                                if(this.mode === 'Random'){
                                    this.$store.dispatch('RANDOM_FILE')
                                }
                                else if (this.mode === 'PreNext'){
                                    this.$store.dispatch('NEXT_FILE')
                                }
                            } catch (error) {
                                alert(error)
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
            const Copyfile = () => import("@/components/modal/Copyfile.vue")
            this.$modal.show(
                Copyfile,
                {curfile: this.curfile, filename: this.filename},
                {width:'400', classes: 'addfolders-modal'}
            )
        },
        openfile(){
            const filepath = this.curfile.replace(/[/]/g, '\\')
            shell.showItemInFolder(filepath)
        },
        renamefile(){
            const Renamefile = () => import("@/components/modal/Renamefile.vue")
            this.$modal.show(
                Renamefile,
                {filepath:this.curfile, filename: this.filename},
                {width:'400', classes: 'addfolders-modal'}
            )
        }
    },
    computed: {
        ...mapGetters({
            curfile: "getCurFilePath",
            filename: "getFileName",
            filetype: "getFileType",
            files: "getFilesList",
            mode: "getMode",
        }),
    },
    watch: {
        curfile: () => {
            anime({
                targets: [".files-viewer"],
                opacity: ["0", "100"],
                duration: 5000,
                easing: "easeInOutQuad",
            });
        },
    },
};
</script>

<style scoped lang="scss">
#viewer {
    width: 100%;
    height: 100%;
    position: relative;
    background-color: #1c1e26;
}

#view-area {
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
    height: 70px;
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

// ---------------- //
//         Delete Btton        //
// ---------------- //
.operate-btn-wrapper{
    position: absolute;
    top: 0;
    width: 100%;
    height: 70px;
    background-color: white;
    opacity: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: ease-in-out 0.3s;
}

.operate-btn-wrapper:hover{
    opacity: 30%;
}

.operate-btn{
    cursor: pointer;
    width: 70px;
    height: 70px;
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
    width: 100px;
    height: 100px;
    top: calc(50% - 50px);
}

#start-index:hover,
#end-index:hover {
    background: white;
    opacity: 30%;
}

#start-index {
    left: 0;
}

#end-index {
    right: 0;
}

// ---------------- //
//             Random            //
// ---------------- //
#random-mode button {
    width: 100%;
    height: 100%;
}

#random-mode:hover {
    opacity: 30%;
}

// ---------------- //
//             PreNext            //
// ---------------- //
#prenext-mode {
    display: flex;
}
#prenext-mode button {
    font-size: 30px;
    width: 100%;
    height: 100%;
}

#prenext-mode button:hover {
    opacity: 70%;
}

#prenext-mode:hover {
    opacity: 30%;
}

// ---------------- //
//             Context             //
// ---------------- //
.context-active {
    transform: scale(1) !important;
}
</style>
