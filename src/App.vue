<template>
    <div id="app">
        <div id="main-panel-wrapper">
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

        <div id="status-bar">
            <div class="upload-btn-wrapper status-item">
                <label class="directory-upload">
                    <input type="file" @change="uploaddir" webkitdirectory directory />
                    {{file.foldername}}
                </label>
            </div>

            <div class="folder-info status-item">
                <p style="color: white;">{{folderinfo}}</p>
            </div>
            <div>
                <p>{{folderinfo.folders}}</p>
            </div>
        </div>
        
    </div>
</template>

<script>
    // Splitpanes
    import {Splitpanes,Pane} from 'splitpanes'
    import 'splitpanes/dist/splitpanes.css'

    import path from 'path'
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
        },
        methods:{
            uploaddir(e){
                let folder = e.target.files[0].path.split('\\')
                folder.pop()
                folder = folder.join('\\')
                const file = {
                    name: path.basename(folder),
                    path: folder,
                    type: ""
                }
                this.$store.dispatch('LOAD_FILE', file)
            }
        },
        computed:{
            file(){
                return this.$store.state.curFile
            },
            folderinfo(){
                return this.$store.getters.getFolderInfo
            }
        }
    }
</script>

<style lang="scss">
    :root{
        --spliter: rgb(117, 147, 151);
        --dark: rgb(32, 32, 32);
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
        flex-direction: column;
        position: relative;
    }

    #full-panel {
        height: 100%;
    }

    #main-panel-wrapper{
        display: flex;
        width: 100%;
        height: 97%;
        position: fixed;
        left: 0;
        right: 0;
        bottom: 25px;
        margin: 0 auto;
    }

    #status-bar{
        width: 100%;
        height: 25px;
        position: fixed;
        display: flex;
        align-items: center;
        bottom: 0;
        background: var(--dark);

        .status-item{
            margin-right: 10px;
        }
    }

    // Input: directory
    .upload-btn-wrapper{
        height: 100%;
        display: flex;
        align-items: center;
        transition: ease-in-out .3s;
    }

    .upload-btn-wrapper:hover{
        background-color: rgba($color: white, $alpha: .2);
    }

    .directory-upload {
        color: lightgrey;
        display: inline-block;
        cursor: pointer;
        
        input[type="file"] {
            display: none;
        }
    }


     /* 分割線感應區域 */
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

    /* 分割線樣式 */
    .splitpanes--vertical>.splitpanes__splitter {
        background: var(--spliter);
    }

    .splitpanes--horizontal>.splitpanes__splitter {
        background: var(--spliter);
    }

</style>