<template>
    <div id="viewer" 
        @dragover.prevent="dragging" 
        @dragleave.prevent="dragleave" 
        @drop.prevent="drop">

        
        <div id="view-area" v-viewer="{navbar: false}">
            <img :src="`local-resource://${filepath}`" v-show=" filepath !== 'undefined' && filetype === 'image'">
            <video :src="`local-resource://${filepath}`" controls v-show=" filepath !== 'undefined' && filetype === 'video'"></video>
        </div>

        <div id="delete-btn">
            <button @click="del">╳</button>
        </div>

        <div id="random-mode" class="view-control" v-show="mode==='random'">
            <button @click="random">Random</button>
        </div>
        
        <div id="prenext-mode" class="view-control" v-show="mode==='prenext'">

        </div>

        <modal name="my-first-modal">
            This is my first modal
        </modal>

    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import anime from 'animejs'
    import 'viewerjs/dist/viewer.css'
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
                        this.$store.dispatch('LOAD_FILE', file)
                    }
                }
            },
            random(){
                if (this.filepath ==- 'public/static/picnel.io.png') return
                this.$store.dispatch('RANDOM_FILE')
            },
            del(){
                // 警告永久刪除
                const Warning = () => import(/* webpackChunkName: "Warning" */ "@/components/modal/Warning.vue")
                this.$modal.show(
                    Warning,
                    { text: 'This text is passed as a property' },
                    // { draggable: true }
                )

                // alert("警告")
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


</style>