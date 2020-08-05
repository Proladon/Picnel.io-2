<template>
    <div id="viewer" 
        @dragover.prevent="dragging" 
        @dragleave.prevent="dragleave" 
        @drop.prevent="drop">

        
        <div id="view-area">
            <img :src="`local-resource://${filepath}`" v-show=" filepath !== 'undefined' && filetype === 'image'">
            <video :src="`local-resource://${filepath}`" controls v-show=" filepath !== 'undefined' && filetype === 'video'"></video>
        
        </div>

        <div id="random-control">

        </div>
        
        <div id="prenext-control">

        </div>

    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import anime from 'animejs'
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
                        console.log(file)
                        this.$store.commit('LOAD_FILE', file)
                    }
                }
            }
        },
        computed:{
            ...mapGetters({
                filename: 'getFileName',
                filepath: 'getFilePath',
                filetype: 'getFileType',
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
</style>