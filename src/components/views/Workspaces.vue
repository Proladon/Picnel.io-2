<template>
    <div id="workspaces" class="views-page">
        <div class="workspaces-list-wrapper views-page-wrapper" >

            <div class="workspaces-list">

                <div class="workspace-item-wrapper">
                    <div class="workspace-item" v-for="(space, index) in workspaces" :key="space.name"
                        @click="selectWorkspace($event, space, index)">
                        <p>{{space.name}}</p>
                        <p>{{space.path}}</p>
                    </div>

                    <div class="workspace-btn">
                        <div class="import-workspace-btn" @click="importWorkspace">
                            <p>import</p>
                        </div>
                        <div class="new-workspace-btn" @click="newWorkspace">
                            <p>New</p>
                        </div>
                    </div>
                </div>

                <div class="workspace-info">
                    <img :src="`local-resource://${this.cover}`" class="workspace-cover" ref="cover" @error="altcover">

                    <div class="cover-upload-wrapper">
                        <label class="directory-upload">
                            <input type="file" accept="image/png, image/jpeg, image/gif" class="choice-cover"
                                @change="choiceCover" />
                            <p>Choice Cover</p>
                        </label>
                    </div>

                    <p>Workspace:</p>
                    <p class="wk-info-text">{{data.name}}</p>
                    <p>Path:</p>
                    <p class="wk-info-text">{{data.path}}</p>
                    <p>Main Folder:</p>
                    <p class="wk-info-text">{{data.main}}</p>

                    <div class="workspace-control">
                        <div class="load-workspace" @click="loadWorkspace">Load</div>
                        <div class="delete-workspace" @click="removeWorkspace">Remove</div>
                    </div>
                    
                </div>

            </div>

        </div>

        <!-- Notify -->
        <notifications group="workspace" position="bottom right" animation-type="velocity"/>

    </div>
</template>

<script>
    import Store from "electron-store"
    import fs from "fs-extra"
    import anime from "animejs"
    import { remote } from "electron"

    // Helper
    import { newstate } from "@/assets/func/statefilter.js"

    // Notify
    import { noSelectedWorkspace, unexpectedError, alreadyExist } from "@/assets/func/notify.js"

    export default {
        name: "Workspaces",
        data() {
            return {
                workspaces: "",
                data: "",
                index: Number,
                cover: "",
                target: null,
            }
        },
        methods: {
            
            altcover(){
                this.$refs.cover.src = require("@/assets/img/kr2.gif")
            },

            noSelected(){
                if (this.data === ''){
                    this.$notify(noSelectedWorkspace("workspace"))
                    return true
                }
            },
            
            
            // :: Choice Cover
            choiceCover(e) {
                if (this.noSelected()) return
                else{
                    const cover = e.target.files[0].path
                    this.cover = cover
                    this.$refs.cover.src = `local-resource://${cover}`

                    const store = new Store()
                    let workspace = store.get('workspaces')

                    workspace[this.index].cover = cover
                    store.set('workspaces', workspace)

                    e.target.value = null
                }
            },

            
            // :: Select Workspace
            selectWorkspace(e, workspace, index) {
                const store = new Store()
                const wk = store.get('workspaces')
                
                this.data = wk[index]
                this.index = index
                
                if (wk[index].cover === ""){
                    this.$refs.cover.src = require("@/assets/img/kr2.gif")
                }
                else{
                    this.cover = wk[index].cover
                }

                if(this.target !== null){
                    this.target.classList.remove("item-active")
                }
                e.target.classList.add("item-active")
                this.target = e.target
            },

            
            // :: Import Workspace
            importWorkspace(){
                let select = remote.dialog.showOpenDialog({
                    properties:['openFile'],
                    filters:[{name: 'workspace', extensions:['json']}]
                })

                select.then(res => {
                    const selectPath = res.filePaths[0]

                    fs.readJson(selectPath)
                        .then(res => {
                            const selectWorkspace = res.app.workspace.name
                            const store = new Store()
                            let workspaces = store.get('workspaces')

                            let repeat = false
                            workspaces.forEach(element => {
                                if (selectPath === element.path){
                                    this.$notify(alreadyExist("workspace", element.name))
                                    repeat = true
                                    return
                                }
                            })
                            
                            if (!repeat){
                                const data = {
                                    name: selectWorkspace,
                                    path: selectPath,
                                    cover: ''
                                }

                                workspaces.push(data)
                                store.set('workspaces', workspaces)
                                this.workspaces = workspaces
                            }
                        })
                })
            },

            // :: Create New Workspace
            newWorkspace(){
                this.$store.commit('SET_STATE', newstate())
            },

            // :: Load Workspace
            loadWorkspace() {
                this.$store.commit('RESET_SELECTED')
                if (this.noSelected()) return
                
                this.$store.commit('CLEAR_TEMP_FILES_LIST')

                fs.readJson(this.data.path)
                    .then((res) => {
                        this.$store.commit('SET_STATE', res)
                        this.$store.commit('SET_VIEW', 'home')
                        this.$store.commit('UPDATE_FILES_LIST')
                        this.$store.commit('SET_TEMP_FILES_LIST', this.filefolder)
                        
                        if (this.tempfileslist.length < 3000){
                            this.$store.commit('CLEAR_TEMP_FILES_LIST', this.filefolder)
                        }
                        else if (this.tempfileslist.length >= 3000) {
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
                    })
                    .catch((err) => {
                        console.log(err)
                        this.$notify(unexpectedError("workspace"))
                    })
            },


            removeWorkspace(){
                if (this.noSelected()) return

                this.$modal.show('dialog', {
                    title: 'Remove Workspace',
                    text: "This only remove workspace from the list, you still can import it again",
                    buttons: [
                        {
                            title: 'Remove',
                            class: "dialog-red-btn dialog-btn",
                            handler: () => {
                                const store = new Store()
                                
                                let wks = store.get('workspaces')
                                wks.splice(this.index, 1)
                                store.set('workspaces', wks)
                                
                                this.workspaces = wks
                                this.data = ""
                                this.cover = ""
                                this.$modal.hide('dialog')
                            }
                        },
                        {
                            title: 'Cancel',
                            class: "dialog-green-btn dialog-btn",
                            handler: () => {
                                this.$modal.hide('dialog')
                            }
                        },
                    ]
                })
            }
        },

        computed: {
            filefolder(){
                return this.$store.getters.getFolderPath;
            },
            tempfileslist(){
                return this.$store.state.cache.tempFilesList
            }
        },

        mounted() {
            anime({
                targets: "#workspaces",
                width: ["0", "100%"],
                easing: "easeInOutCubic",
                duration: 1200,
            })

            setTimeout(() => {
                // workspace-item
                anime({
                    targets: ".workspace-item",
                    opacity: ['0', '1'],
                    translateY: ['50', '0'],
                    delay: anime.stagger(100, {
                        start: 800
                    }),
                    duration: 2000,
                })
                
                // workspace-btn
                anime({
                    targets: [".workspace-btn", ".workspace-control"],
                    opacity: ['0', '1'],
                    translateY: ['50', '0'],
                    delay: anime.stagger(100, {
                        start: 1300
                    }),
                    duration: 2000,
                })
            });
            
            // Get all workspaces from config.json
            const store = new Store()
            this.workspaces = store.get('workspaces')
            this.$refs.cover.src = require("@/assets/img/kr2.gif")
        },

        beforeDestroy() {
            // workspace-item
            anime({
                targets: ".workspace-item",
                opacity: ['1', '0'],
                translateY: ['50', '0'],
                delay: anime.stagger(50),
                duration: 1000,
            })

            // workspace-btn
            anime({
                targets: [".workspace-btn", ".workspace-control"],
                opacity: ['1', '0'],
                translateY: ['0', '50'],
                delay: anime.stagger(100),
                duration: 2000,
            })
        }
    }
</script>

<style scoped lang="scss">

    .choice-cover {
        text-align: center;
        background-color: lightgray;
    }

    .workspaces-list {
        display: flex;
        width: 100%;
        height: 100%;

        .workspace-item-wrapper {
            width: 70%;
            overflow-y: auto;

            .workspace-item {
                cursor: pointer;
                display: inline-block;
                width: 40%;
                padding: 10px;
                margin-bottom: 20px;
                margin-right: 20px;
                background-color: rgba($color: white, $alpha: 0.7);
                border-radius: 10px;
            }

            .workspace-item:hover {
                filter: brightness(80%);
            }


        }

        .workspace-btn{
            position: absolute;
            bottom: 50px;
            display: flex;

            .import-workspace-btn, .new-workspace-btn{
            cursor: pointer;
            width: 150px;
            height: 40px;
            background-color: rgba($color: lightgray, $alpha: .3);
            padding: 10px;
            border-radius: 5px;
            border: solid 2px var(--dark);
            box-sizing: border-box;
            display: flex;
            justify-content: center;
            align-items: center;
                p{
                font-size: 20px;
                }
            }

            .import-workspace-btn:hover, .new-workspace-btn:hover{
                background-color: mediumspringgreen;
            }

        }
        
    }

    .workspace-info {
        width: 30%;
        padding-left: 20px;
        position: relative;
        box-sizing: border-box;
        overflow: hidden;


        .cover-upload-wrapper {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            background-color: lightgray;
        }

        .directory-upload {
            display: inline-block;
            cursor: pointer;
            text-align: center;
            width: 100%;
            height: 100%;
            
            p{
                color: var(--dark);
            }

            input[type="file"] {
                display: none;
            }
        }

        .wk-info-text{
            color: var(--lightyellow);
            margin-bottom: 10px;
        }

        .workspace-cover {
            width: 100%;
            height: 200px;
        }

        p {
            color: white;
            width: 100%;

            word-wrap: break-word;
        }
    }

    .workspace-control {
        position: absolute;
        display: flex;
        width: 100%;
        left: 0;
        right: 0;
        bottom: 0;
        padding-left: 20px;
        box-sizing: border-box;

        .load-workspace,
        .delete-workspace {
            cursor: pointer;
            color: var(--dark);
            text-align: center;
            width: 100%;
            font-size: 20px;
            padding: 10px;
            border-radius: 5px;
            border: solid 2px var(--dark);
            box-sizing: border-box;
            background-color: skyblue;
        }

        .load-workspace:hover,
        .delete-workspace:hover {
            filter: brightness(70%);
        }

        .delete-workspace{
            background-color: rgb(226, 90, 131);
        }
    }

    p {
        pointer-events: none;
        font-size: 15px;
        overflow: hidden;
        color: var(--popupdark);
    }

    .item-active{
        background-color: skyblue !important;
    }
</style>