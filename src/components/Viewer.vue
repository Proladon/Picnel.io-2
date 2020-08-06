<template>
    <div id="viewer" 
        @dragover.prevent="dragging" 
        @dragleave.prevent="dragleave" 
        @drop.prevent="drop">

        
        <div id="view-area" v-viewer="{navbar: false}">
            <img :src="`local-resource://${filepath}`" v-show=" filepath !== 'undefined' && filetype === 'image'">
            <video :src="`local-resource://${filepath}`" controls v-show=" filepath !== 'undefined' && filetype === 'video'"></video>
        
        </div>

        <div id="random-mode" class="view-control" v-show="mode==='random'">
            <button @click="test">Random</button>
        </div>
        
        <div id="prenext-mode" class="view-control" v-show="mode==='prenext'">

        </div>

    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import anime from 'animejs'
    import 'viewerjs/dist/viewer.css'
    
    export default {
        name: 'Viewer',
        methods:{
            dragging(){

            },
            dragleave(){

            },
            drop(e){
                if (e.dataTransfer.items){
                    if (e.dataTransfer.items[0].kind === 'file'){
                        const file = e.dataTransfer.items[0].getAsFile()
                        this.$store.dispatch('LOAD_FILE', file)
                    }
                }
            },
            test(){
                this.$store.dispatch('RANDOM_FILE')
            }
        },
        computed:{
            ...mapGetters({
                filepath: 'getFilePath',
                filetype: 'getFileType',
                mode: 'getMode',
            })
        },
        watch:{
            filepath:()=>{
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
        background-color: rgb(32, 32, 32);
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


</style>