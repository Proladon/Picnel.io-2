<template>
    <div id="viewer" 
        @dragover.prevent="dragging" 
        @dragleave.prevent="dragleave" 
        @drop.prevent="drop">

        
        <div id="view-area" v-viewer="{navbar: false}">
            <img :src="`local-resource://${curfile}`" v-show=" curfile !== 'undefined' && filetype === 'image'">
            <video :src="`local-resource://${curfile}`" controls v-show=" curfile !== 'undefined' && filetype === 'video'"></video>
            <audio :src="`local-resource://${curfile}`" controls v-show=" curfile !== 'undefined' && filetype === 'audio'"></audio>
        </div>

        <div id="delete-btn">
            <button @click="del">╳</button>
        </div>

        <div id="random-mode" class="view-control" v-show="mode==='random'">
            <button @click="random">Random</button>
        </div>
        
        <div id="prenext-mode" class="view-control" v-show="mode==='prenext'">

        </div>
        
        <!-- Notify -->
        <notifications group="random" position="bottom right" animation-type="velocity"/>
        <notifications group="nofiles" position="bottom right" animation-type="velocity"/>
        
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import anime from 'animejs'
    import 'viewerjs/dist/viewer.css'
    import fs from 'fs-extra'
    import mime from 'mime-types'
    export default {
        name: 'Viewer',
        components:{
            
        },
        methods:{
            dragging(){

            },
            dragleave(){

            },
            drop(e){
                if (e.dataTransfer.items){
                    if (e.dataTransfer.items[0].kind === 'file'){
                        const file = e.dataTransfer.items[0].getAsFile()
                        if (fs.lstatSync(file.path).isDirectory()){
                            // Directory
                            let readable = ['image', 'video', 'audio']
                            let readablelist = fs.readdirSync(file.path).filter(f => {
                                let type = mime.lookup(f)
                                if (type !== false && readable.includes(type.split('/')[0])){
                                    return f 
                                }
                            })

                            // No readable files
                            if (readablelist.length === 0){
                                this.$notify({
                                    group: 'nofiles',
                                    type: 'error',
                                    title: 'Error',
                                    text: 'No readable files in the directory'
                                })
                            }
                            else{
                                this.$store.commit('SET_CURFILE', `${file.path}/${readablelist[0]}`)
                            }
                        }
                        else{
                            // Single File
                            this.$store.commit('SET_CURFILE', file.path)
                        }
                        // Logging
                        // this.$store.commit('UPDATE_LOG', "update folder")
                    }
                }
            },
            random(){
                if (this.filename === 'picnel.io.png') {
                    this.$notify({
                        group: 'random',
                        type: 'error',
                        title: 'Error',
                        text: 'Please open a main folder first.'
                    })
                    return   
                }
                this.$store.dispatch('RANDOM_FILE')
            },
            del(){
                // 警告永久刪除
                const Warning = () => import(/* webpackChunkName: "Warning" */ "@/components/modal/Warning.vue")
                this.$modal.show(
                    Warning,
                    { text: 'This text is passed as a property' },
                )
            }
        },
        computed:{
            ...mapGetters({
                curfile: 'getCurFilePath',
                filename: 'getFileName',
                filetype: 'getFileType',
                mode: 'getMode',
            })
        },
        watch:{
            curfile:()=>{
                anime({
                    targets:['img', 'video'],
                    opacity: ['0', '100'],
                    duration: 5000,
                    easing: 'easeInOutQuad',
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    #viewer {
        width: 100%;
        height: 100%;
        position: relative;
        background-color: #1C1E26;
    }

    #view-area{
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        img, video{
            max-width: 100%;
            max-height: 100%;
        }
    }

    #delete-btn{
        width: 30px;
        height: 30px;
        top: 10px;
        right: 0;
        position: absolute;
        
        button{
            width: 100%;
            height: 100%;
            color: transparent;
            border: none;
            outline: none;
            background-color: transparent;
        }
    }
    #delete-btn:hover{
        background-color: rgba($color: white, $alpha: .1);
        button{
            color: red;
        }
    }
    #delete-btn:active{
        background-color: rgba(200, 200, 200,.1);
    }

    .view-control{
        width: 100%;
        height: 50px;
        position: absolute;
        bottom: 0;
        opacity: 0;
        transition: ease-in-out .3s;

        button{
            border: none;
            outline: none;
        }
        button:active{
            background-color: rgb(200, 200, 200);
        }
    }

    #random-mode button{
        width: 100%;
        height: 100%;
        
    }

    #random-mode:hover{
        opacity: 30%;
    }

    .context-active {
    transform: scale(1) !important;
}


</style>