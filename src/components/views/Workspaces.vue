<template>
    <div id="workspaces" class="views-page">
        <div class="workspaces-list-wrapper views-page-wrapper" >

            <div class="workspaces-list">

                <div class="workspace-item-wrapper">
                    <div class="workspace-item" v-for="(space, index) in workspaces" :key="space.name"
                        @click="choiceWorkspace(space, index)">
                        <p>{{space.name}}</p>
                        <p>{{space.path}}</p>
                    </div>

                    <div class="workspace-btn">
                        <div class="import-workspace-btn" @click="importworkspace">
                            <p>import</p>
                        </div>
                        <div class="new-workspace-btn" @click="newworkspace">
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
                        <div class="load-workspace" @click="loadworkspace">Load</div>
                        <div class="delete-workspace" @click="deleteworkspace">Remove</div>
                    </div>
                    
                </div>

            </div>

        </div>

        <!-- Notify -->
        <notifications group="workspace" position="bottom right" animation-type="velocity"/>

    </div>
</template>

<script>
    import Store from 'electron-store'
    import fs from 'fs-extra'
    import anime from "animejs";
    import { remote } from 'electron';

    export default {
        name: "Workspaces",
        data() {
            return {
                workspaces: "",
                data: "",
                index: String,
                cover: "",
            }
        },
        methods: {
            altcover(){
                this.$refs.cover.src = require("@/assets/img/kr2.gif")
            },
            choiceCover(e) {
                if (this.data !== ''){
                    const cover = e.target.files[0].path
                    this.cover = cover
                    this.$refs.cover.src = `local-resource://${cover}`

                    const store = new Store()
                    let workspace = store.get('workspaces')
                    workspace[this.index].cover = cover
                    store.set('workspaces', workspace)
                    e.target.value = null
                }else{
                    this.$notify({
                        group: "workspace",
                        type: 'error',
                        title: 'No Workspace',
                        text: 'No selected workspace'
                    })
                }
            },
            choiceWorkspace(workspace, index) {
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
            },
            importworkspace(){
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
                            
                            workspaces.forEach(element => {
                                if (selectPath === element.path){
                                    this.$notify({
                                        group: 'workspace',
                                        title: 'Workspace exist',
                                        text: `${element.name} already exist`
                                    })
                                    return
                                }
                            })

                            const data = {
                                name: selectWorkspace,
                                path: selectPath,
                                cover: ''
                            }
                            workspaces.push(data)
                            this.workspaces = workspaces
                            store.set('workspaces', workspaces)
                        })
                })
            },
            newworkspace(){
                const newstate = {
                    mode: "Random",
                    curFile: '',
                    activeGroup: "",
                    folderGroups: [],
                    folderLists: {
                        Wallpaper: [],
                        ACG: [],
                    },
                    tempColor: Object,
                    app:{
                        isChanged: false,
                        workspace: {
                            name: "untitled",
                            path: "",
                        },
                        curView: 'home',
                    },
                    logger: {
                        activeTab: "Copylog",
                        Copylog: [],
                        Movelog: [],
                        Deletelog: [],
                        Renamelog: [],
                        
                        Copylog_Unread: 0,
                        Movelog_Unread: 0,
                        Deletelog_Unread: 0,
                        Renamelog_Unread: 0,
                    }
                }
                this.$store.commit('SET_STATE', newstate)
                // this.$store.commit('SET_VIEW', 'home')
            },
            loadworkspace() {
                
                this.$store.commit('CLEAR_TEMP_FILES_LIST')

                fs.readJson(this.data.path)
                    .then((res) => {
                        this.$store.commit('SET_STATE', res)
                        this.$store.commit('SET_VIEW', 'home')

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
                        this.$notify({
                            group: 'workspace',
                            type: 'error',
                            title: 'Workspace Error',
                            text: "Can't not load workspace"
                        })
                    })

                
                
            },
            deleteworkspace(){
                if (this.data === ''){
                    this.$notify({
                        group: 'workspace',
                        type: 'error',
                        title: 'Workspace Error',
                        text: "Can't not load workspace"
                    })
                }
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
                anime({
                    targets: ".workspace-item",
                    opacity: ['0', '1'],
                    translateY: ['50', '0'],
                    delay: anime.stagger(100, {
                        start: 800
                    }),
                    duration: 2000,
                })

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
            anime({
                targets: ".workspace-item",
                opacity: ['1', '0'],
                translateY: ['50', '0'],
                delay: anime.stagger(50),
                duration: 1000,
            })

            anime({
                targets: [".workspace-btn", ".workspace-control"],
                opacity: ['1', '0'],
                translateY: ['0', '50'],
                delay: anime.stagger(100),
                duration: 2000,
            })
        }
    };
</script>

<style scoped lang="scss">
    // #workspaces {}

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
        font-size: 15px;
        overflow: hidden;
        color: var(--popupdark);
    }
</style>