<template>
    <div id="app">
        <div id="main-panel-wrapper" ref="mainpanel">
            <Sidebar />
            <splitpanes id="full-panel">
                <pane>
                    <splitpanes horizontal>
                        <pane size="85">
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

        <Statusbar />

        <!-- Notify -->
        <notifications group="home" position="bottom right" animation-type="velocity"/>
        
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
        },
        mounted(){
            const barheight = document.getElementById('statusbar').offsetHeight
            this.$refs.mainpanel.style.paddingBottom = barheight + 'px'
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

    :root{
        --spliter: #423f3b;
        --dark: #0F2232;
        --popupdark: rgb(31, 41, 53);
        --lightyellow: #CDC0B8;
        --statusbar: #353f52;
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

    #full-panel {
        height: 100%;
    }

    #main-panel-wrapper{
        display: flex;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: 0 auto;
    }

</style>