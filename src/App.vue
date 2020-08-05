<template>
    <div id="app">
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

            <pane size="25">
                <folderstab />
            </pane>

        </splitpanes>
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
    import Folderstab from './components/Folderstab.vue'

    export default {
        name: 'App',
        components: {
            Splitpanes,
            Pane,
            Viewer,
            Sidebar,
            Logger,
            Folderstab,
        }
    }
</script>

<style lang="scss">
    :root{
        --spliter: rgb(117, 147, 151);
    }

    html,
    body,
    #app {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
    }

    #app {
        display: flex;
    }

    #full-panel {
        height: 100%;
    }

    // 分割線感應區域
    .splitpanes__splitter {
        background-color: #ccc;
        position: relative;
    }

    .splitpanes__splitter:before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
    }
    
    .splitpanes--vertical>.splitpanes__splitter:before {
        left: -5px;
        right: -5px;
        height: 100%;
    }

    .splitpanes--horizontal>.splitpanes__splitter:before {
        top: -5px;
        bottom: -5px;
        width: 100%;
    }

    // 分割線樣式
    .splitpanes--vertical>.splitpanes__splitter {
        background: var(--spliter);
    }

    .splitpanes--horizontal>.splitpanes__splitter {
        background: var(--spliter);
    }
</style>