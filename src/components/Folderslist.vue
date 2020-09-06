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
            <pane size="70">
                <draggable v-model="folderlist" v-bind="dragOptions">
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
            <pane>
                <draggable v-model="foldergroups" v-bind="dragOptions">
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
        <Foldercontext @removefolder="removeFolder" @openfolder="openFolder" />

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
import { Splitpanes, Pane } from "splitpanes";
import draggable from "vuedraggable";
import "splitpanes/dist/splitpanes.css";
import anime from "animejs";
// Context Menu
import Foldercontext from "@/components/contextmenu/Foldercontext.vue";
import Groupcontext from "@/components/contextmenu/Groupcontext.vue";
// Notify
import {
    saveFile,
    targetPathEmpty,
    noFile,
    alreadyExist,
} from "@/assets/func/notify.js";
// Mods
import fs from "fs-extra";
import path from "path";
import { shell, remote } from "electron";
import Store from "electron-store";
import { savefilter } from "@/assets/func/savefilter.js";

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
        };
    },
    methods: {
        //:: Changing active group
        changeGroup(name, e) {
            // remove all element active class
            document
                .getElementsByClassName("draggable-group")
                .forEach((element) => {
                    element.classList.remove("active");
                });
            // add clicked element active class
            e.target.classList.add("active");
            this.$store.commit("CHANGE_ACTIVE_GROUP", name);

            setTimeout(() => {
                anime({
                    targets: [".draggable-folder"],
                    translateX: ["-500", "0"],
                    delay: anime.stagger(100),
                });
            });
        },
        addFoldersModal() {
            const Addfolders = () =>
                import("@/components/modal/Addfolders.vue");
            this.$modal.show(
                Addfolders,
                {
                    group: this.activegroup,
                    folderlist: this.folderlist,
                    workspace: this.workspace,
                },
                { resizable: true, classes: "addfolders-modal" }
            );
        },
        //:: Show add new group modal
        addGroupModal() {
            const Addgroup = () => import("@/components/modal/Addgroup.vue");
            this.$modal.show(
                Addgroup,
                { foldergroups: this.foldergroups, workspace: this.workspace },
                { width: "400", classes: "addfolders-modal" }
            );
        },

        //:: Color Tag ColorPicker
        choiceColor(iname, icolor, index) {
            /* webpackChunkName: "Colorpicker" */

            const ColorPicker = () =>
                import("@/components/modal/Colorpicker.vue");

            this.$modal.show(
                ColorPicker,
                { color: icolor, title: iname, index: index },
                {
                    width: "300px",
                    height: "450px",
                    draggable: false,
                }
            );
        },

        //:: Folder context menu
        foldercontext(e, index, fpath) {
            this.folderindex = index;
            this.folderpath = fpath;
            const element = document.getElementById("folder-context");
            element.classList.remove("context-active");
            element.style.top = e.clientY + "px";
            element.style.left = e.clientX + "px";
            setTimeout(() => {
                element.classList.add("context-active");
            }, 150);
        },

        //:: Group context menu
        groupcontext(e, index) {
            this.groupIndex = index;
            this.groupname = e.target.innerText;
            this.targetgroup = e.target;
            const element = document.getElementById("group-context");
            element.classList.remove("context-active");
            element.style.top = e.clientY + "px";
            element.style.left = e.clientX + "px";
            setTimeout(() => {
                element.classList.add("context-active");
            }, 150);
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
                            let folders = this.$store.state.folderLists;
                            delete folders[this.groupname];
                            this.$store.commit("SET_LIST", folders);
                            this.$store.commit("DELETE_GROUP", this.groupIndex);

                            if (this.groupname === this.activegroup) {
                                this.$store.commit("CHANGE_ACTIVE_GROUP", null);
                            }

                            if (!this.workspace.name.includes("*")) {
                                this.$store.commit("SET_WORKSPACE", {
                                    name: `${this.workspace.name}*`,
                                    path: this.workspace.path,
                                });
                            }

                            this.$modal.hide("dialog");

                            this.groupname = null;
                            this.groupIndex = null;
                            this.targetgroup = null;
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
                            let folders = this.folderlist;
                            folders.splice(this.folderindex, 1);
                            this.$store.commit("UPDATE_LISTS", folders);
                            if (!this.workspace.name.includes("*")) {
                                this.$store.commit("SET_WORKSPACE", {
                                    name: `${this.workspace.name}*`,
                                    path: this.workspace.path,
                                });
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
                            )[0];
                            let newName = element.value.trim(" ");
                            // Check Repeat
                            for (let oldName of this.$store.state
                                .folderGroups) {
                                if (newName === oldName.name) {
                                    element.value = "";
                                    this.$notify(
                                        alreadyExist("folderlist", newName)
                                    );
                                    return;
                                }
                            }
                            // Check Empty
                            if (newName !== "") {
                                // Change Group Name
                                this.$store.commit("RENAME_GROUP", {
                                    index: this.groupIndex,
                                    name: element.value,
                                });
                                // Change Group Links Folders Name
                                this.$store.commit("RENAME_LIST", {
                                    oldName: this.groupname,
                                    newName: newName,
                                });
                                this.$store.commit(
                                    "CHANGE_ACTIVE_GROUP",
                                    newName
                                );
                                if (!this.workspace.name.includes("*")) {
                                    this.$store.commit("SET_WORKSPACE", {
                                        name: `${this.workspace.name}*`,
                                        path: this.workspace.path,
                                    });
                                }
                                this.$modal.hide("dialog");

                                this.groupname = newName;
                                setTimeout(() => {
                                    // Re-add active class to current activeGroup
                                    const elList = document.getElementsByClassName(
                                        "draggable-group"
                                    );
                                    elList.forEach((e) => {
                                        e.classList.remove("active");
                                    });
                                    const target = elList[this.groupIndex];
                                    target.classList.add("active");
                                }, 10);
                            } else {
                                element.value = "";
                            }
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

        openFolder() {
            shell.openPath(this.folderpath);
        },

        copyfile(targetpath) {
            if (targetpath === "") {
                this.$notify(targetPathEmpty("folderlist"));
                return;
            } else if (this.filename === "picnel.io.png") {
                this.$notify(noFile("folderlist", "copy"));
                return;
            }

            let target = path.join(targetpath, this.filename);
            try {
                fs.copySync(this.filepath, target, {
                    overwrite: false,
                    errorOnExist: true,
                });
                this.$store.commit("UPDATE_LOG", {
                    logger: "Copylog",
                    log: `File: ${this.filename}//From: ${this.filefolder}//To: ${targetpath}`,
                });
            } catch (error) {
                const extname = path.extname(this.filename);
                let counter = 1;
                let repeat = true;
                target = path.join(
                    targetpath,
                    this.filename.replace(extname, `(${counter})${extname}`)
                );

                while (repeat) {
                    if (fs.existsSync(target)) {
                        counter += 1;
                        target = path.join(
                            targetpath,
                            this.filename.replace(
                                extname,
                                `(${counter})${extname}`
                            )
                        );
                    } else {
                        repeat = false;
                    }
                }

                this.$modal.show("dialog", {
                    title: "Already Exist & Auto Rename",
                    text: `Auto rename to: ${path.basename(target)}`,
                    buttons: [
                        {
                            title: "Rename & Copy",
                            class: "dialog-btn dialog-green-btn",
                            handler: () => {
                                fs.copySync(this.filepath, target, {
                                    overwrite: false,
                                    errorOnExist: true,
                                });
                                this.$modal.hide("dialog");
                            },
                        },
                        {
                            title: "Cancel Copy",
                            class: "dialog-btn dialog-red-btn",
                            handler: () => {
                                this.$modal.hide("dialog");
                            },
                        },
                    ],
                });
            }
        },
        movefile(targetpath) {
            if (targetpath === "") {
                this.$notify(targetPathEmpty("folderlist"));
                return;
            } else if (this.filename === "picnel.io.png") {
                this.$notify(noFile("folderlist", "copy"));
                return;
            }
            targetpath = targetpath.replace(/\\/g, "/");
            let target = path.join(targetpath, this.filename);
            try {
                fs.moveSync(this.filepath, target, {
                    overwrite: false,
                    errorOnExist: true,
                });
            } catch (error) {
                // TODO Move Error handler
                const extname = path.extname(this.filename);
                let counter = 1;
                let repeat = true;
                target = path.join(
                    targetpath,
                    this.filename.replace(extname, `(${counter})${extname}`)
                );

                while (repeat) {
                    if (fs.existsSync(target)) {
                        counter += 1;
                        target = path.join(
                            targetpath,
                            this.filename.replace(
                                extname,
                                `(${counter})${extname}`
                            )
                        );
                    } else {
                        repeat = false;
                    }
                }

                this.$modal.show("dialog", {
                    title: "Already Exist & Auto Rename",
                    text: `Auto rename to: ${path.basename(target)}`,
                    buttons: [
                        {
                            title: "Rename & Move",
                            class: "dialog-btn dialog-green-btn",
                            handler: () => {
                                fs.moveSync(this.filepath, target, {
                                    overwrite: false,
                                    errorOnExist: true,
                                });
                                this.$modal.hide("dialog");
                                if (this.mode === "Random") {
                                    this.$store.dispatch("RANDOM_FILE");
                                } else {
                                    this.$store.dispatch("NEXT_FILE");
                                    let files_list = fs
                                        .readdirSync(
                                            this.$store.getters.getFolderPath
                                        )
                                        .map((f) => {
                                            return `${
                                                this.$store.getters.getFolderPath
                                            }/${f.replace(/\\/g, "/")}`;
                                        });

                                    if (files_list.length === 1) {
                                        this.$store.commit(
                                            "SET_CURFILE",
                                            files_list[0]
                                        );
                                    } else if (
                                        this.fileindex < files_list.length
                                    ) {
                                        this.$store.commit(
                                            "SET_CURFILE",
                                            files_list[this.fileindex - 1]
                                        );
                                    }
                                }

                                this.$store.commit("UPDATE_LOG", {
                                    logger: "Movelog",
                                    log: `File: ${this.filename}//From: ${this.filefolder}//To: ${targetpath}`,
                                });
                            },
                        },
                        {
                            title: "Cancel Move",
                            class: "dialog-btn dialog-red-btn",
                            handler: () => {
                                this.$modal.hide("dialog");
                            },
                        },
                    ],
                });
            }
        },
        save() {
            if (
                this.workspace.name === "untitled" ||
                this.workspace.name === "untitled*"
            ) {
                this.saveAs();
                return;
            }
            this.$store.commit("SET_WORKSPACE", {
                name: this.workspace.name.replace("*", ""),
                path: this.workspace.path,
            });
            // Save workspace Json to path
            fs.writeJson(this.workspace.path, savefilter(this.allState), {
                spaces: 4,
            }).then(() => {
                this.$notify(saveFile("folderlist", this.workspace.name));
                // Save worksapce to config.json
                const store = new Store();
                let workspaces = store.get("workspaces");

                let wkindex = 0;
                workspaces.forEach((wk, index) => {
                    if (wk.name === this.workspace.name) {
                        wkindex = index;
                    }
                });

                workspaces[wkindex].main = this.filefolder;
                store.set("workspaces", workspaces);
            });
        },
        saveAs() {
            const options = {
                title: "Save as workspace",
                filters: [{ name: "workspace", extensions: ["json"] }],
            };

            let savePath = remote.dialog.showSaveDialog(options);
            savePath.then((res) => {
                if (res.canceled) {
                    return;
                } else {
                    const savepath = res.filePath.split("\\");
                    const saveName = savepath[savepath.length - 1].replace(
                        ".json",
                        ""
                    );
                    this.$store.commit("SET_WORKSPACE", {
                        name: saveName,
                        path: res.filePath,
                    });

                    // Save workspace Json to path
                    // Filter state which need to save
                    fs.writeJson(res.filePath, savefilter(this.allState), {
                        spaces: 4,
                    })
                        .then(() => {
                            this.$notify(saveFile("folderlist", saveName));

                            // Save worksapce to config.json
                            const store = new Store();
                            let workspaces = store.get("workspaces");
                            const savedata = {
                                name: saveName,
                                path: res.filePath,
                                main: this.filefolder,
                                cover: "",
                            };
                            console.log(workspaces);
                            if (workspaces !== undefined) {
                                // check exist
                                let repeat = false;
                                workspaces.forEach((wk) => {
                                    if (wk.name === saveName) {
                                        repeat = true;
                                    }
                                });

                                if (!repeat) {
                                    workspaces.push(savedata);
                                    store.set("workspaces", workspaces);
                                }
                            } else {
                                store.set("workspaces", []);
                                let workspaces = store.get("workspaces");
                                workspaces.push(savedata);
                                store.set("workspaces", workspaces);
                            }
                        })
                        .catch((err) => {
                            console.error(err);
                        });
                }
            });
        },
    },
    computed: {
        allState() {
            return this.$store.state;
        },
        mode() {
            return this.$store.state.mode;
        },
        fileindex() {
            return this.$store.getters.getFileIndex;
        },
        workspace() {
            return this.$store.state.app.workspace;
        },
        filepath() {
            return this.$store.state.curFile;
        },
        filefolder() {
            return this.$store.getters.getFolderPath;
        },
        filename() {
            return this.$store.getters.getFileName;
        },
        foldergroups: {
            get() {
                return this.$store.state.folderGroups;
            },
            set(data) {
                this.$store.commit("UPDATE_GROUP", data);
            },
        },
        folderlist: {
            get() {
                let act = this.$store.state.activeGroup;
                return this.$store.state.folderLists[act];
            },
            set(data) {
                this.$store.commit("UPDATE_LISTS", data);

                if (!this.workspace.name.includes("*")) {
                    this.$store.commit("SET_WORKSPACE", {
                        name: `${this.workspace.name}*`,
                        path: this.workspace.path,
                    });
                }
            },
        },
        activegroup() {
            return this.$store.state.activeGroup;
        },
        dragOptions() {
            return {
                animation: 200,
                group: "description",
                disabled: false,
                ghostClass: "ghost",
            };
        },
        tempColor() {
            return this.$store.state.tempColor;
        },
    },
    mounted() {
        //:: Cancel context menu
        const context_folder = document.getElementById("folder-context");
        const context_group = document.getElementById("group-context");
        window.addEventListener("click", () => {
            context_folder.classList.remove("context-active");
            context_group.classList.remove("context-active");
        });
    },
};
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

// ---------------- //
//             Controls            //
// ---------------- //
.list-control {
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
//      draggable      //
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
