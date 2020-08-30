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

                    <div class="worspace-control">
                        <div class="load-workspace" @click="loadworkspace">Load</div>
                        <div class="delete-workspace" @click="deleteworkspace">Delete</div>
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
            loadworkspace() {

                fs.readJson(this.data.path)
                    .then((res) => {
                        this.$store.commit('SET_STATE', res)
                    })
                    .catch(() => {
                        this.$notify({
                            group: 'workspace',
                            type: 'error',
                            title: 'Workspace Error',
                            text: "Can't not load workspace"
                        })
                    })
            },
            deleteworkspace(){
                this.$modal.show('dialog', {
                    title: 'Delete Workspace',
                    text: 'This will delete workspace.json file permanently!',
                    buttons: [
                        {
                            title: 'Delete',
                            class: "dialog-red-btn dialog-btn",
                            handler: () => {
                                fs.remove(this.data.path)
                                    .then(()=> {
                                        const store = new Store()
                                        let wks = store.get('workspaces')
                                        wks.splice(this.index, 1)
                                        store.set('workspaces', wks)
                                        this.workspaces = wks
                                        this.data = ""
                                        this.cover = ""
                                    })
                                    .catch((res) => {
                                        this.$notify({
                                            group: 'workspace',
                                            type: 'error',
                                            title: 'Error',
                                            text: res
                                        })
                                    })
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
        computed: {},
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

    .worspace-control {
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
            background-color: springgreen;
        }
    }

    p {
        font-size: 15px;
        overflow: hidden;
        color: var(--popupdark);
    }
</style>