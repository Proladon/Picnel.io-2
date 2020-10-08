<template>
    <div id="app">
        
        <div class="menu" style="-webkit-app-region: drag;">
            <div class="icon-wrapper">
                <img src="@/assets/icon/pic2.png" id="appicon" alt="" srcset="">
                <p>Picnel.io 2</p>
            </div>

            <div class="window-controls-wrapper">
                <svg style="-webkit-app-region: no-drag;" @click="winmin">
                    <circle id="minimized" class="circle-outline" />
                    <circle class="circle-inline" />
                </svg>

                <svg style="-webkit-app-region: no-drag;" @click="winmax">
                    <circle id="maximized" class="circle-outline" />
                    <circle class="circle-inline" />
                </svg>

                <svg style="-webkit-app-region: no-drag;" @click="quit">
                    <circle id="quit" class="circle-outline" />
                    <circle class="circle-inline" />
                </svg>
            </div>
        </div>

        <div id="main-panel-wrapper" ref="mainpanel">
            <Sidebar />
            <splitpanes id="full-panel">
                <pane>
                    <splitpanes horizontal>
                        <pane size="80">
                            <viewer />
                        </pane>
                        <pane>
                            <logger />
                        </pane>
                    </splitpanes>
                </pane>

                <pane size="40">
                    <Folderslist />
                </pane>
            </splitpanes>
        </div>

        <!-- Statusbar -->
        <Statusbar />

        <!-- Views -->
        <transition name="fade">
            <Workspaces v-if="views === 'workspaces'"/>
            <Info v-if="views === 'info'"/>
            <Settings v-if="views === 'settings'"/>
        </transition>

        <!-- Notify -->
        <notifications group="home" position="bottom right" animation-type="velocity"/>
        
        <!-- Dialog (Global) -->
        <v-dialog />

    </div>
</template>

<script>
    // import {version} from 'package.json'
    // Splitpanes
    import {Splitpanes,Pane} from 'splitpanes'
    import 'splitpanes/dist/splitpanes.css'

    // Components
    import Viewer from './components/Viewer.vue'
    import Sidebar from './components/Sidebar.vue'
    import Logger from './components/Logger.vue'
    import Folderslist from './components/Folderslist.vue'
    import Statusbar from './components/Statusbar.vue'

    import {configfilter} from '@/assets/func/statefilter.js'

    import {remote} from 'electron'

    export default {
        name: 'App',
        components: {
            Splitpanes,
            Pane,
            Viewer,
            Sidebar,
            Logger,
            Folderslist,
            Statusbar,
            Workspaces: () => import('./components/views/Workspaces.vue'),
            Info: () => import('./components/views/Info.vue'),
            Settings: () => import('./components/views/Settings.vue'),
        },
        data(){
            return{
                winMaximized: false,
            }
        },
        methods:{
            winmin(){
                const win = remote.BrowserWindow.getFocusedWindow()
                win.minimize()
            },
            winmax(){
                const win = remote.BrowserWindow.getFocusedWindow()
                if (this.winMaximized === false){
                    win.maximize()
                    this.winMaximized = true
                }
                else{
                    win.unmaximize()
                    this.winMaximized = false
                }
            },
            quit(){
                if (this.workspace.name.includes('*')){
                    this.$modal.show("dialog", {
                        title: 'Do you want to quit ?',
                        text: 'Workspace have been changed and unsave.',
                        buttons: [
                            {
                                title: 'Save & Quit',
                                class: 'dialog-btn dialog-green-btn',
                                handler: () => {
                                    this.$bus.$emit('quit:save')
                                    this.$modal.hide("dialog")
                                }
                            },
                            {
                                title: 'Unsave & Quit',
                                class: 'dialog-btn dialog-red-btn',
                                handler: () => {
                                    remote.app.exit()
                                }
                            },
                        ]
                    })
                }
                else{
                    remote.app.exit()
                }
            }
        },
        computed:{
            views(){
                return this.$store.state.app.curView
            },
            workspace(){
                return this.$store.state.app.workspace
            },
            check_update(){
                return this.$store.state.config.check_update
            }
        },
        mounted(){
            const Store = require('electron-store')
            const store = new Store()
            // init config
            if (store.get('user_configs') === undefined){
                store.set('user_configs', configfilter)
            }
            else{
                this.$store.commit('SET_CONFIG', store.get('user_configs'))
            }

            // Check Update
            // 
            if(! this.check_update) return
            const axios = require('axios')
            axios.get('https://api.github.com/repos/Proladon/Picnel.io-2/releases')
                .then(res => {
                    let curversion = remote.app.getVersion()
                    // let curversion = '1.0.0'
                    let newset = res.data[0].name

                    if (curversion !== newset) {
                        this.$modal.show('dialog', {
                            text: `
                                <p class="version">Newest: <b class="new-version">${newset}</b></p>
                                <p class="version">Current: <b class="cur-version">${curversion}</b></p>
                                <p class="update-notice">⚡ New version available !</p>
                            `,
                            buttons: [
                                {
                                    title: 'Go Download',
                                    class: "dialog-btn dialog-green-btn",
                                    handler: ()=>{
                                        remote.shell.openExternal(`https://github.com/Proladon/Picnel.io-2/releases/tag/${newset}`)
                                        this.$modal.hide('dialog')
                                    }
                                },
                            ]
                        })
                    }
                }).catch(()=>{
                    this.$modal.show('dialog', {
                        text: 'Checking update failed'
                    })
                })

        }
    }
</script>

<style lang="scss">
// V-Dialog
@import "assets/scss/custom-v-dialog.scss";
@import "assets/scss/custom-v-splitpanes.scss";
@import "assets/scss/custom-v-modal.scss";
@import "assets/scss/custom-v-notify.scss";
@import "assets/scss/custom-scrollbar.scss";
@import "assets/scss/views.scss";

    :root{
        --spliter: #423f3b;
        // --dark: #0F2232;
        --dark: #1c1e26;
        --red: rgb(212, 91, 128);
        --popupdark: rgb(31, 41, 53);
        --lightyellow: #CDC0B8;
        
        --statusbar: #1c1e26;
        // --sidebar: cadetblue;
        --sidebar: rgb(142, 180, 192);
        --font: DisposableDroid BB;
    }
    

    *{
        // font-family: var(--font);
        margin: 0;
        padding: 0;
    }

    html,
    body,
    #app {
        width: 100%;
        height: 100%;
        overflow: hidden;
        font-family: Arial, Helvetica, sans-serif;
    }

    #app {
        display: flex;
        flex-direction: column;
        position: relative;
    }

    #appicon{
        height: 30px;
    }

    .menu{
        position: fixed;
        background-color: var(--statusbar);
        width: 100%;
        height: 30px;
        top: 0;
        display: flex;
        align-items: center;
        display: flex;
        justify-items: center;
        justify-content: space-between;
        box-sizing: border-box;
        padding-left: 15px;
        padding-right: 15px;
        color: skyblue;
        
        .icon-wrapper{
            width: 50%;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
    }

    .window-controls-wrapper{
        width: auto;
        height: auto;
        display: flex;

        svg{
            cursor: pointer;
            width: 30px;
            height: 30px;
            margin-left: 15px;

            #minimized{
                fill:rgb(230, 168, 53);
            }

            #maximized{
                fill:rgb(95, 158, 160);
            }

            #quit{
                fill:rgb(216, 70, 114);
            }
        }
        .circle-outline{
            cx: 15;
            cy: 15;
            r: 10;
            fill: white;
        }

        .circle-inline{
            cx: 15;
            cy: 15;
            r: 8;
            fill: var(--statusbar);
        }
    }

    #full-panel {
        height: 100%;
    }

    #main-panel-wrapper{
        display: flex;
        width: 100%;
        // height: 100%;
        box-sizing: border-box;
        position: absolute;
        top: 30px;
        left: 0;
        right: 0;
        bottom: 30px;
        margin: 0 auto;
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity 1s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
        opacity: 0;
    }

    .m-chckbox--group{
        border: 1px solid var(--lightyellow) !important;
    }
</style>