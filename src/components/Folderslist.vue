<template>
    <div id="folderslist">
        <!-- Control -->
        <div class="list-control">
            <p>{{ workspace.name }}</p>

            <div class="list-control-btn-wrapper">
                <button class="list-control-btn" @click="save">Save</button>
                <button class="list-control-btn" @click="saveAs">
                    Save as
                </button>
                <button class="list-control-btn" @click="addFoldersModal">
                    ADD Folder
                </button>
                <button class="list-control-btn" @click="addGroupModal">
                    ADD Group
                </button>
            </div>
        </div>
        <splitpanes>
            <!-- Folders -->
            <pane size="70" class="folder-pane">
                <draggable
                    v-model="folderlist"
                    v-bind="dragOptions"
                    :move="checkmove"
                >
                    <transition-group type="transition">
                        <div
                            v-for="(i, index) in folderlist"
                            :key="i.name"
                            class="draggable-folder"
                            @contextmenu="foldercontext($event, index, i.path)"
                        >
                            <div
                                class="color-tag"
                                @click="choiceColor(i.name, i.color, index)"
                                :style="`background-color: ${i.color}`"
                            ></div>
                            <p>{{ i.name }}</p>

                            <div class="folder-control-wrapper">
                                <div class="copy" @click="copyfile(i.path)">
                                    C
                                </div>
                                <div class="move" @click="movefile(i.path)">
                                    M
                                </div>
                            </div>
                        </div>
                    </transition-group>
                </draggable>
            </pane>

            <!-- Group -->
            <pane class="group-pane">
                <draggable
                    v-model="foldergroups"
                    v-bind="dragOptions"
                    :move="checkmove"
                >
                    <div
                        class="draggable-group"
                        v-for="(group, index) in foldergroups"
                        :key="group.name"
                        @click="changeGroup(group.name, $event)"
                        @contextmenu="groupcontext($event, index)"
                    >
                        {{ group.name }}
                    </div>
                </draggable>
            </pane>
        </splitpanes>

        <!-- Context Menu -->
        <Groupcontext @deletegroup="deleteGroup" @renamegroup="renameGroup" />
        <Foldercontext
            @removefolder="removeFolder"
            @openfolder="openFolder"
            @setmainfolder="setMainFolder"
        />

        <!-- Notify -->
        <notifications
            group="folderlist"
            position="right bottom"
            animation-type="velocity"
        />
    </div>
</template>

<script>
// Splitpanes
import { Splitpanes, Pane } from "splitpanes"
import draggable from "vuedraggable"
import "splitpanes/dist/splitpanes.css"
import anime from "animejs"

// Context Menu
import Foldercontext from "@/components/contextmenu/Foldercontext.vue"
import Groupcontext from "@/components/contextmenu/Groupcontext.vue"

// Notify
import {
    isMainfolder,
    saveFile,
    targetPathEmpty,
    noFile,
    noReadable,
    digitNamingWarn,
    alreadyExist,
} from "@/assets/func/notify.js"

// Helper
import { statefilter } from "@/assets/func/statefilter.js"
import {
    filesFilter,
    // globDirFiles,
    getDirFiles,
    repeatAutoRename,
    deletefileLogging,
} from "@/assets/func/helper.js"

import {
    deleteMessage,
    overideMessage,
} from "@/assets/func/notify.js"

// Mods
import fs from "fs-extra"
import path from "path"
import { shell, remote } from "electron"
import Store from "electron-store"
import sizeOf from 'image-size'
// Vuex
import { mapState, mapGetters } from "vuex"



export default {
    name: "Folderslist",

    components: {
        Splitpanes,
        Pane,
        draggable,
        Groupcontext,
        Foldercontext,
    },

    data() {
        return {
            folderindex: 0,
            folderpath: "",
            groupIndex: 0,
            groupname: "",
            targetgroup: HTMLDivElement,
        }
    },

    methods: {
        //:: Changing active group
        changeGroup(name, e) {
            // remove all element active class
            document
                .getElementsByClassName("draggable-group")
                .forEach((element) => {
                    element.classList.remove("active")
                })

            // group active highlight
            e.target.classList.add("active")

            this.$store.commit("CHANGE_ACTIVE_GROUP", name)

            // Target Folder item animation
            if (this.folders_anime){
                setTimeout(() => {
                    anime({
                        targets: [".draggable-folder"],
                        translateX: ["-500", "0"],
                        delay: anime.stagger(100),
                    })
                }, 0)
            }
        },

        //:: Show add folders modal
        addFoldersModal() {
            // import dynamic modal
            const Addfolders = () =>
                import("@/components/modal/Addfolders.vue")

            // Show modal
            this.$modal.show(
                Addfolders,

                // Send Props
                {
                    group: this.activegroup,
                    folderlist: this.folderlist,
                    workspace: this.workspace,
                },

                // Options
                {
                    resizable: true,
                    classes: "addfolders-modal",
                }
            )
        },

        //:: Show add new group modal
        addGroupModal() {
            // import dynamic modal
            const Addgroup = () => import("@/components/modal/Addgroup.vue")

            // Show modal
            this.$modal.show(
                Addgroup,

                // Send Props
                {
                    foldergroups: this.foldergroups,
                    workspace: this.workspace,
                },

                // Options
                {
                    width: "400",
                    classes: "addfolders-modal",
                }
            )
        },

        //:: Show ColorPicker Modal
        choiceColor(iname, icolor, index) {
            // import dynamic modal
            const ColorPicker = () =>
                import("@/components/modal/Colorpicker.vue")

            // Show modal
            this.$modal.show(
                ColorPicker,

                // Send Props
                {
                    color: icolor,
                    title: iname,
                    index: index,
                },

                // Options
                {
                    width: "300px",
                    height: "450px",
                    draggable: false,
                }
            )
        },

        //:: Target Folder context menu
        foldercontext(e, index, fpath) {
            this.folderindex = index
            this.folderpath = fpath

            const element = document.getElementById("folder-context")
            element.classList.remove("context-active")
            element.style.top = e.clientY + "px"
            element.style.left = e.clientX + "px"

            setTimeout(() => {
                element.classList.add("context-active")
            }, 150)
        },

        //:: Group context menu
        groupcontext(e, index) {
            this.groupIndex = index
            this.groupname = e.target.innerText
            this.targetgroup = e.target

            const element = document.getElementById("group-context")
            element.classList.remove("context-active")
            element.style.top = e.clientY + "px"
            element.style.left = e.clientX + "px"

            setTimeout(() => {
                element.classList.add("context-active")
            }, 150)
        },

        //:: Delete Group Dialog
        deleteGroup() {
            this.$modal.show("dialog", {
                title: "Warning",
                text: "Delete Group?",
                buttons: [
                    {
                        title: "Delete",
                        class: "dialog-red-btn dialog-btn",
                        handler: () => {
                            let folders = this.$store.state.folderLists

                            delete folders[this.groupname]

                            this.$store.commit("SET_LIST", folders)
                            this.$store.commit("DELETE_GROUP", this.groupIndex)

                            if (this.groupname === this.activegroup) {
                                this.$store.commit("CHANGE_ACTIVE_GROUP", null)
                            }

                            if (!this.workspace.name.includes("*")) {
                                this.$store.commit("SET_WORKSPACE", {
                                    name: `${this.workspace.name}*`,
                                    path: this.workspace.path,
                                })
                            }

                            this.$modal.hide("dialog")
                            this.groupname = null
                            this.groupIndex = null
                            this.targetgroup = null
                        },
                    },
                    {
                        title: "Cancel",
                        class: "dialog-green-btn dialog-btn",
                        handler: () => {
                            this.$modal.hide("dialog")
                        },
                    },
                ],
            })
        },

        //:: Delete Folder Dialog
        removeFolder() {
            this.$modal.show("dialog", {
                title: "Warning",
                text: "Remove Folder?",
                buttons: [
                    {
                        title: "Remove",
                        class: "dialog-red-btn dialog-btn",
                        handler: () => {
                            let folders = this.folderlist

                            folders.splice(this.folderindex, 1)

                            this.$store.commit("UPDATE_LISTS", folders)

                            if (!this.workspace.name.includes("*")) {
                                this.$store.commit("SET_WORKSPACE", {
                                    name: `${this.workspace.name}*`,
                                    path: this.workspace.path,
                                })
                            }

                            this.$modal.hide("dialog")
                        },
                    },
                    {
                        title: "Cancel",
                        class: "dialog-green-btn dialog-btn",
                        handler: () => {
                            this.$modal.hide("dialog")
                        },
                    },
                ],
            })
        },

        //:: Rename Group
        renameGroup() {
            this.$modal.show("dialog", {
                title: "Group Rename",
                text: `<input name="dialog-input" type:text placeholder="${this.groupname}" >`,
                buttons: [
                    {
                        title: "Rename",
                        class: "dialog-red-btn dialog-btn",
                        handler: () => {
                            const element = document.getElementsByName(
                                "dialog-input"
                            )[0]

                            let newName = element.value.trim(" ")

                            // Check Repeat
                            for (let oldName of this.$store.state
                                .folderGroups) {
                                if (newName === oldName.name) {
                                    element.value = ""
                                    this.$notify(
                                        alreadyExist("folderlist", newName)
                                    )
                                    return
                                }
                            }

                            // Check Empty
                            if (/^\d+$/.test(newName)) {
                                element.value = ""
                                this.$notify(digitNamingWarn("folderlist"))

                                return
                            } else if (newName !== "") {
                                // Change Group Name
                                this.$store.commit("RENAME_GROUP", {
                                    index: this.groupIndex,
                                    name: element.value,
                                })

                                // Change Group Links Folders Name
                                this.$store.commit("RENAME_LIST", {
                                    oldName: this.groupname,
                                    newName: newName,
                                })

                                this.$store.commit(
                                    "CHANGE_ACTIVE_GROUP",
                                    newName
                                )

                                if (!this.workspace.name.includes("*")) {
                                    this.$store.commit("SET_WORKSPACE", {
                                        name: `${this.workspace.name}*`,
                                        path: this.workspace.path,
                                    })
                                }

                                this.$modal.hide("dialog")
                                this.groupname = newName

                                setTimeout(() => {
                                    // Re-add active class to current activeGroup
                                    const elList = document.getElementsByClassName(
                                        "draggable-group"
                                    )
                                    elList.forEach((e) => {
                                        e.classList.remove("active")
                                    })
                                    const target = elList[this.groupIndex]
                                    target.classList.add("active")
                                }, 10)
                            } else {
                                element.value = ""
                            }
                        },
                    },
                    {
                        title: "Cancel",
                        class: "dialog-green-btn dialog-btn",
                        handler: () => {
                            this.$modal.hide("dialog")
                        },
                    },
                ],
            })
        },

        openFolder() {
            shell.openPath(this.folderpath)
        },

        setMainFolder() {
            let target = this.folderpath.replace(/\\/g, "/")

            // return if current folder is mainfolder
            if (this.filefolder === target) {
                this.$notify(isMainfolder("folderlist"))
                return
            }


            // Clear some cache and html class
            this.$store.commit('RESET_SELECTED')
            
            setTimeout(() => {
                const wrapper = document.getElementsByClassName('file-item-wrapper')
                wrapper.forEach(e => e.classList.remove('selected'))
            })



            // Check folder have readable files inside
            const files = getDirFiles(target)
            const readable = filesFilter(files)
            if (readable.length >= 3000) {
                // this.$store.commit("CLEAR_TEMP_FILES_LIST", target)
                this.$store.commit("OVERIDE_TEMP_FILES_LIST", files)
                this.$store.commit("SET_CURFILE", readable[0])

                this.$modal.show("dialog", {
                    title: "🚧 Cache Files List Auto Enable",
                    text:
                        "When directory have over 3000 files, it will use cache files list, that means it won't update directory with all operation outside Picnel.io 2, untill you click 'Refresh'.",
                    buttons: [
                        {
                            title: "Got it",
                            class: "dialog-btn dialog-green-btn",
                            handler: () => {
                                this.$modal.hide("dialog")
                            },
                        },
                        {
                            title: "Learn more",
                            class: "dialog-btn dialog-red-btn",
                            handler: () => {
                                remote.shell.openExternal(
                                    "https://proladon.github.io/Picnel.io-2_Documentation/cache/"
                                )
                                this.$modal.hide("dialog")
                            },
                        },
                    ],
                })
            } 
            else if (readable.length > 0) {
                this.$store.commit("CLEAR_TEMP_FILES_LIST", target)
                this.$store.commit("SET_CURFILE", readable[0])
                this.$store.commit("UPDATE_FILES_LIST")
            } 
            else if (readable.length === 0) {
                this.$notify(noReadable("folderlist"))
            }
        },
        
        fileOperate(opType, targetpath, file=null){
  
            let index = this.fileindex

            // After Operation changing file function
            const changeFile = () => {
                if (this.tempfileslist.length >= 3000) {
                    this.$store.commit("REMOVE_TEMP_FILES_ITEM", index)
                }

                if (this.mode === "Random") {
                    this.$store.dispatch("RANDOM_FILE")
                } 
                else if(this.mode === "PreNext" || this.mode === "Multiple"){
                    this.$store.dispatch("AFTER_MOVE_NEXT", index)
                }

                this.$store.commit("UPDATE_LOG", {
                    logger: "Movelog",
                    log: `File: ${this.filename}//From: ${this.filefolder}//To: ${targetpath}`,
                })
            }

            // 排除空白目的位址
            if (targetpath === "") {
                this.$notify(targetPathEmpty("folderlist"))
                return
            } 
            else if (this.filepath === "") {
                if(opType === 'Copy'){
                    this.$notify(noFile("folderlist", "copy"))
                }
                else if (opType === 'Move'){
                    this.$notify(noFile("folderlist", "move"))
                }
                return
            }


            targetpath = targetpath.replace(/\\/g, "/")
            let target = ""
            if(this.mode === 'Multiple'){
                const filename = path.basename(file)
                target = path.join(targetpath, filename)
            }
            else{
                target = path.join(targetpath, this.filename)
            }

            // Excute Operation
            let curFilepath = ""
            if(this.mode === 'Multiple'){
                curFilepath = file
            }
            else{
                curFilepath = this.filepath
            }

            try {
                
                if (opType === 'Move'){
                    fs.moveSync(curFilepath, target, {
                        overwrite: false,
                        errorOnExist: true,
                    })
                    this.$store.commit('UPDATE_FILES_LIST')
                    changeFile()
                    return new Promise(resolve => resolve('done'))
                }
                else if (opType === 'Copy'){
                    fs.copySync(curFilepath, target, {
                        overwrite: false,
                        errorOnExist: true,
                    })

                    this.$store.commit("UPDATE_LOG", {
                        logger: "Copylog",
                        log: `File: ${this.filename}//From: ${this.filefolder}//To: ${targetpath}`,
                    })
                    return new Promise(resolve => resolve('done'))
                }
            } 
            catch (error) {
                let exist = target
                target = repeatAutoRename(this.filename, targetpath)
                const exist_size = sizeOf(exist)
                const target_size = sizeOf(curFilepath)

                return new Promise(resolve => {
                    setTimeout(() => {
                        this.$modal.show("dialog", {
                            title: "Existing Compare",
                            text: `
                            <div class="repeat-compare-modal">
                                <p class="op-type">${opType}</p>
                                <p>Already same filename in <strong>${path.basename(path.dirname(exist))}</strong></p>
                                <div class="img-wrapper">
                                    <img class="new-file" src="local-resource://${curFilepath}"  />
                                    <img class="exist-file" src="local-resource://${exist}"  />
                                </div>
        
                                <div class="contain-wrapper">
                                    <p>Current</p>
                                    <p>Existing</p>
                                </div>
                                <div class="contain-wrapper">
                                    <p>${exist_size.width} x ${exist_size.height}</p>
                                    <p>${target_size.width} x ${target_size.height}</p>
                                </div>
                                <p>Auto-Rename:</p>
                                <p><strong>${path.basename(target)}</strong></p>
                            </div>
                            `,
                            buttons: [
                                {
                                    title: "Rename",
                                    class: "dialog-btn dialog-green-btn",
                                    handler: () => {
                                        if (opType === 'Move'){
                                            fs.moveSync(curFilepath, target, {
                                                overwrite: false,
                                                errorOnExist: true,
                                            })
                                            this.$store.commit('UPDATE_FILES_LIST')
                                            changeFile()
                                        }
                                        else if (opType === 'Copy'){
                                            fs.copySync(curFilepath, target, {
                                                overwrite: false,
                                                errorOnExist: true,
                                            })
        
                                            this.$store.commit("UPDATE_LOG", {
                                                logger: "Copylog",
                                                log: `File: ${this.filename}//From: ${this.filefolder}//To: ${targetpath}`,
                                            })
                                        }
        
                                        this.$modal.hide("dialog")
                                        resolve("done")
                                    },
                                },
                                {
                                    title: "Delete Current",
                                    class: "dialog-btn dialog-red-btn",
                                    handler: () => {
                                        remote.dialog.showMessageBox(deleteMessage)
                                            .then((res) => {
                                                if (res.response === 0) {
                                                    fs.remove(curFilepath).then(() => {
                                                        this.$store.commit('UPDATE_FILES_LIST')
                                                        changeFile()
                                                }
                                            )
                                                this.$store.commit("UPDATE_LOG", {
                                                    logger: "Deletelog",
                                                    log: deletefileLogging(
                                                        this.filename,
                                                        curFilepath
                                                    ),
                                                })
    
                                                this.$modal.hide("dialog")
                                                resolve("done")
                                            }
                                        })
                                    },
                                },
                                {
                                    title: "Overide",
                                    class: "dialog-btn dialog-orange-btn",
                                    handler: () => {
                                        remote.dialog.showMessageBox(overideMessage)
                                            .then((res) => {
                                                if (res.response === 0){
        
                                                    fs.moveSync(curFilepath, exist, {
                                                        overwrite: true,
                                                        errorOnExist: false,
                                                    })
                                                    this.$store.commit('UPDATE_FILES_LIST')
                                                    changeFile()
        
                                                    this.$modal.hide("dialog")
                                                    resolve("done")
                                                }
                                            })
                                    },
                                },
                                {
                                    title: "Cancel",
                                    class: "dialog-btn dialog-gray-btn",
                                    handler: () => {
                                        this.$modal.hide("dialog")
                                        resolve("cancel")
                                    },
                                },
                            ],
                        })
                    }, 400);

                })
            }
        },


        copyfile(targetpath) {
            const tempSelected = this.tempSelected
            const Operation = this.fileOperate
            function getProm(i) {
                return Operation("Copy", targetpath, i)
            }

            function Wait() {
                return new Promise(r => setTimeout(r, 100))
            }

            this.$notify({
                group: 'folderlist',
                clean: true,
            })
            
            if(this.mode === 'Multiple'){
                (async function createChain() {
                    for (let i of tempSelected) {
                        await getProm(i);
                        await Wait();
                    }
                })()
                
                this.$notify({
                    group: 'folderlist',
                    title: 'Copy File',
                    type: 'success',
                    text: `Copy ${tempSelected.length} files success`
                })
            }
            else{
                this.fileOperate("Copy", targetpath)
                this.$notify({
                    group: 'folderlist',
                    title: 'Copy File',
                    type: 'success',
                    text: 'Copy success'
                })
            }

        },

        movefile(targetpath) {
            const tempSelected = this.tempSelected
            const Operation = this.fileOperate
            const store = this.$store
            
            function getProm(i) {
                return Operation("Move", targetpath, i)
            }

            function Wait() {
                return new Promise(r => setTimeout(r, 100))
            }
            
            this.$notify({
                group: 'folderlist',
                clean: true,
            })

            if(this.mode === 'Multiple'){
                (async function createChain() {
                    let popitem = []
                    for (let i of tempSelected) {
                        let res = await getProm(i);
                        if(res === 'done'){
                            popitem.push(i)
                        }
                        await Wait();
                    }

                    for (let i of popitem){
                        store.commit('POP_SELECTED', tempSelected.indexOf(i))
                    }
                })()

                this.$notify({
                    group: 'folderlist',
                    title: 'Move File',
                    type: 'success',
                    text: `Copy ${tempSelected.length} files success`
                })
            }
            else{
                this.fileOperate("Move", targetpath)
                this.$notify({
                    group: 'folderlist',
                    title: 'Copy File',
                    type: 'success',
                    text: 'Copy success'
                })
            }

        },

        save(q = null) {
            if (
                this.workspace.name === "untitled" ||
                this.workspace.name === "untitled*"
            ) {
                this.saveAs(q)
                return
            }
            this.$store.commit("SET_WORKSPACE", {
                name: this.workspace.name.replace("*", ""),
                path: this.workspace.path,
            })
            // Save workspace Json to path
            fs.writeJson(this.workspace.path, statefilter(this.allState), {
                spaces: 4,
            }).then(() => {
                this.$notify(saveFile("folderlist", this.workspace.name))
                // Save worksapce to config.json
                const store = new Store()
                let workspaces = store.get("workspaces")
                let wkindex = 0
                workspaces.forEach((wk, index) => {
                    if (wk.name === this.workspace.name) {
                        wkindex = index
                    }
                })
                workspaces[wkindex].main = this.filefolder
                store.set("workspaces", workspaces)

                if (q === "quit") {
                    remote.app.exit()
                }
            })
        },

        saveAs(q = null) {
            const options = {
                title: "Save as workspace",
                filters: [
                    {
                        name: "workspace",
                        extensions: ["json"],
                    },
                ],
            }
            let savePath = remote.dialog.showSaveDialog(options)
            savePath.then((res) => {
                if (res.canceled) {
                    return
                } else {
                    const savepath = res.filePath.split("\\")
                    const saveName = savepath[savepath.length - 1].replace(
                        ".json",
                        ""
                    )
                    this.$store.commit("SET_WORKSPACE", {
                        name: saveName,
                        path: res.filePath,
                    })
                    // Save workspace Json to path
                    // Filter state which need to save
                    fs.writeJson(res.filePath, statefilter(this.allState), {
                        spaces: 4,
                    })
                        .then(() => {
                            this.$notify(saveFile("folderlist", saveName))
                            // Save worksapce to config.json
                            const store = new Store()
                            let workspaces = store.get("workspaces")
                            const savedata = {
                                name: saveName,
                                path: res.filePath,
                                main: this.filefolder,
                                cover: "",
                            }
                            if (workspaces !== undefined) {
                                // check exist
                                let repeat = false
                                workspaces.forEach((wk) => {
                                    if (wk.name === saveName) {
                                        repeat = true
                                    }
                                })
                                if (!repeat) {
                                    workspaces.push(savedata)
                                    store.set("workspaces", workspaces)
                                }
                            } else {
                                store.set("workspaces", [])
                                let workspaces = store.get("workspaces")
                                workspaces.push(savedata)
                                store.set("workspaces", workspaces)
                            }
                            if (q === "quit") {
                                remote.app.exit()
                            }
                        })
                        .catch((err) => {
                            console.error(err)
                        })
                }
            })
        },

        checkmove(el) {
            if (
                el.dragged.classList[0] === "draggable-folder" &&
                el.related.classList[0] === "draggable-group"
            ) {
                return false
            } else if (
                el.dragged.classList[0] === "draggable-group" &&
                el.related.classList[0] === "draggable-folder"
            ) {
                return false
            }
        },
    },

    computed: {
        allState() {
            return this.$store.state
        },

        ...mapState({
            // Mode
            mode: (state) => state.mode,

            // File
            filepath: (state) => state.curFile,

            // Worksapce
            workspace: (state) => state.app.workspace,

            // Cache
            tempfileslist: (state) => state.cache.tempFilesList,
            tempColor: (state) => state.cache.tempColor,

            // Group
            activegroup: (state) => state.activeGroup,

            // Configs
            folders_anime: (state) => state.config.folders_anime,

            // Selected
            tempSelected: (state) => state.cache.tempSelected
        }),

        ...mapGetters({
            // File
            fileindex: "getFileIndex",
            filefolder: "getFolderPath",
            filename: "getFileName",
        }),

        foldergroups: {
            get() {
                return this.$store.state.folderGroups
            },
            set(data) {
                this.$store.commit("UPDATE_GROUP", data)
            },
        },

        folderlist: {
            get() {
                let act = this.$store.state.activeGroup
                return this.$store.state.folderLists[act]
            },
            set(data) {
                this.$store.commit("UPDATE_LISTS", data)
                if (!this.workspace.name.includes("*")) {
                    this.$store.commit("SET_WORKSPACE", {
                        name: `${this.workspace.name}*`,
                        path: this.workspace.path,
                    })
                }
            },
        },

        // Draggable Options
        dragOptions() {
            return {
                animation: 200,
                group: "description",
                disabled: false,
                ghostClass: "ghost",
            }
        },
    },
    mounted() {
        //:: Hide all context menu event
        const context_folder = document.getElementById("folder-context")
        const context_group = document.getElementById("group-context")

        window.addEventListener("click", () => {
            context_folder.classList.remove("context-active")
            context_group.classList.remove("context-active")
        })
    },
    created() {
        // Quit app event
        this.$bus.$on("quit:save", () => {
            this.save("quit")
        })
    },
}
</script>

<style scoped lang="scss">
#folderslist {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: #20232b;
}

.splitpanes__pane {
    overflow-y: auto;
}
.folder-pane, .group-pane{
    box-sizing: border-box;
    padding-top: 30px;
    // padding-bottom: 30px;
}
// ---------------- //
//             Controls            //
// ---------------- //
.list-control {
    position: absolute;
    z-index: 2;
    width: 100%;
    height: 25px;
    box-sizing: border-box;
    padding-left: 10px;
    padding-right: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: var(--lightyellow);
}

.list-control-btn-wrapper {
    display: flex;
    justify-content: space-between;

    .list-control-btn {
        color: var(--dark);
        cursor: pointer;
        margin-left: 5px;
        background-color: transparent;
        border: var(--dark) solid 1px;
        padding: 2px;
    }

    .list-control-btn:hover {
        background-color: cadetblue;
    }
}

// ---------------- //
//          draggable          //
// ---------------- //
.active {
    color: var(--dark) !important;
    background-color: var(--lightyellow);
}

.ghost {
    opacity: 0.5;
    background: #bdbdbd;
}

//:: Folder
.draggable-folder {
    cursor: default;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 15px;
    margin: 15px;
    font-size: 20px;
    color: var(--lightyellow);
    background-color: #4f5662;
    padding: 5px;
    border-radius: 5px;

    .color-tag {
        cursor: pointer;
        width: 8px;
        border-radius: 2px;
        height: 100%;
    }

    p {
        width: 55%;
        overflow: hidden;
    }
}

.folder-control-wrapper {
    display: flex;
    width: 30%;

    .copy,
    .move {
        cursor: pointer;
        width: 100%;
        margin-right: 5px;
        text-align: center;
        background-color: rgba(160, 160, 160, 0.274);
    }

    .copy:hover,
    .move:hover {
        filter: brightness(70%);
    }
}

//:: group
.draggable-group {
    cursor: pointer;
    text-align: center;
    margin: 10px;
    font-size: 15px;
    border: solid 1px var(--lightyellow);
    border-radius: 15px;
    color: var(--lightyellow);
}

.draggable-group:hover {
    background-color: cadetblue;
}

// ---------------- //
//        context-menu      //
// ---------------- //

.context-active {
    transform: scale(1) !important;
}


</style>
