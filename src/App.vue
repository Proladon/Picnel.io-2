<template>
    <div id="app">
        
        <div class="menu" style="-webkit-app-region: drag;">
            <img src="@/assets/icon/pic2.png" id="appicon" alt="" srcset="">

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
            <Workspaces v-if="views.workspacesView"/>
            <Info v-if="views.infoView"/>
        </transition>

        <!-- Notify -->
        <notifications group="home" position="bottom right" animation-type="velocity"/>
        
        <!-- Dialog (Global) -->
        <v-dialog />

    </div>
</template>

<script>
    // Splitpanes
    import {Splitpanes,Pane} from 'splitpanes'
    import 'splitpanes/dist/splitpanes.css'

    // Components
    import Viewer from './components/Viewer.vue'
    import Sidebar from './components/Sidebar.vue'
    import Logger from './components/Logger.vue'
    import Folderslist from './components/Folderslist.vue'
    import Statusbar from './components/Statusbar.vue'

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
                    this.$modal.show("dialog")
                }
                else{
                    remote.app.exit()
                }
            }
        },
        computed:{
            views(){
                return this.$store.state.app.views
            },
            workspace(){
                return this.$store.state.app.workspace
            }
        },
        mounted(){

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
</style>