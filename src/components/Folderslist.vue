<template>
    <div id="folderslist">
        <div class="list-control">
            <p>{{ worksapce }}</p>
            <button>ADD Folder</button>
            <button @click="addGroupModal">ADD Group</button>
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
                        >
                            <div
                                class="color-tag"
                                @click="choiceColor(i.name, i.color, index)"
                                :style="`background-color: ${i.color}`"
                            ></div>
                            {{ i.name }}
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

        <!-- Modal -->
        <modal name="addgroup">
            <p>Group Name:</p>
            <input
                type="text"
                id="inputGroupName"
                @keypress.enter.prevent="addgroup"
            />
        </modal>

        <!-- Dialog -->
        <v-dialog />

        <!-- Context Menu -->
        <Groupcontext @deletegroup="deleteGroup" @renamegroup="renameGroup" />
    </div>
</template>

<script>
// Splitpanes
import { Splitpanes, Pane } from "splitpanes";
import draggable from "vuedraggable";
import "splitpanes/dist/splitpanes.css";
import anime from "animejs";
import Groupcontext from "@/components/contextmenu/Groupcontext.vue";

export default {
    name: "Folderslist",
    components: {
        Splitpanes,
        Pane,
        draggable,
        Groupcontext,
    },
    data() {
        return {
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

        //:: Show add new group modal
        addGroupModal() {
            this.$modal.show("addgroup");
            setTimeout(() => {
                document.getElementById("inputGroupName").focus();
            });
        },

        //:: Add new group
        addgroup() {
            let el = document.getElementById("inputGroupName");
            let newName = el.value.trim(" ");
            let repeat = false;

            // Check Repeat Name
            for (let name of this.foldergroups) {
                if (newName === name.name) {
                    repeat = true;
                }
            }
            // Check Empty
            if (newName === "" || repeat === true) {
                el.value = "";
                return;
            } else {
                const data = {
                    name: newName,
                    path: "",
                };
                this.$store.commit("ADD_GROUP", data);
                setTimeout(() => {
                    el.value = "";
                });
            }
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
                    width: "500px",
                    height: "600px",
                    draggable: false,
                },
            );
        },

        //:: Show group context menu
        groupcontext(e, index) {
            this.groupIndex = index;
            this.groupname = e.target.innerText
            this.targetgroup = e.target
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
            this.$modal.show('dialog', {
                title: "Warning",
                text: "Delete Group?",
                buttons:[
                    {
                        title: "Delete",
                        class: 'dialog-red-btn dialog-btn',
                        handler: () => {
                            let folders = this.$store.state.folderLists
                            delete folders[this.groupname]
                            this.$store.commit('SET_LIST', folders)
                            this.$store.commit('DELETE_GROUP', this.groupIndex)
                            
                            if (this.groupname === this.activegroup){
                                this.$store.commit('CHANGE_ACTIVE_GROUP', null)
                            }
                            this.$modal.hide('dialog')

                            this.groupname = null
                            this.groupIndex = null
                            this.targetgroup = null
                        }
                    },
                    {
                        title: "Cancel",
                        class: 'dialog-green-btn dialog-btn',
                        handler: () => {
                            this.$modal.hide('dialog')
                        }
                    }
                ]
            })
        },

        //:: Rename Group 
        renameGroup(){
            this.$modal.show('dialog', {
                title: "Group Rename",
                text: `<input name="dialog-input" type:text placeholder="${this.groupname}" >`,
                buttons:[
                    {
                        title: "Rename",
                        class: 'dialog-red-btn dialog-btn',
                        handler: () => {
                            const element = document.getElementsByName('dialog-input')[0]
                            let newName = element.value.trim(' ')
                            // Check Repeat
                            for (let oldName of this.$store.state.folderGroups){
                                if (newName === oldName.name) {
                                    element.value = '' 
                                    this.$notify({
                                        group: 'foo',
                                        type: 'warn',
                                        title: 'Name Repeat',
                                        text: `Group Name: ${newName} already existing`
                                    });
                                    return
                                }
                            }
                            // Check Empty
                            if (newName !== ''){
                                // Change Group Name
                                this.$store.commit('RENAME_GROUP', {index:this.groupIndex, name:element.value})
                                // Change Group Links Folders Name
                                this.$store.commit('RENAME_LIST', {oldName: this.groupname, newName: newName})
                                this.$store.commit('CHANGE_ACTIVE_GROUP', newName)
                                this.$modal.hide('dialog')

                                this.groupname = newName
                                setTimeout(() => {
                                    const el = document.getElementsByClassName('draggable-group')[this.groupIndex]
                                    el.classList.add('active')
                                }, 10);
                            }
                            else{
                                element.value = ''
                            }
                        }
                    },
                    {
                        title: "Cancel",
                        class: 'dialog-green-btn dialog-btn',
                        handler: () => {
                            this.$modal.hide('dialog')
                        }
                    }
                ]
            })
        }
    },
    computed: {
        worksapce() {
            return this.$store.state.worksapce;
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
        const element = document.getElementById("group-context");
        window.addEventListener("click", () => {
            element.classList.remove("context-active");
        });

    },
};
</script>

<style scoped lang="scss">
#folderslist {
    width: 100%;
    height: 100%;
    background-color: #20232b;
}

.splitpanes__pane {
    overflow-y: auto;
}

// ---------------- //
//           draggable          //
// ---------------- //
.list-control {
    width: 100%;
    height: 30px;
    box-sizing: border-box;
    padding: 10px;
    display: flex;
    align-items: center;
    background-color: var(--lightyellow);
}

// ---------------- //
//           draggable          //
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
    margin: 15px;
    font-size: 20px;
    color: var(--lightyellow);
    background-color: #4f5662;
    padding: 5px;
    border-radius: 5px;

    .color-tag {
        cursor: pointer;
        width: 10px;
        height: auto;
        margin-right: 15px;
    }
}

//:: group
.draggable-group {
    cursor: pointer;
    text-align: center;
    margin: 10px;
    font-size: 20px;
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
