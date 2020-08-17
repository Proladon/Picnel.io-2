<template>
    <div id="colorpicker">
        <div class="color-tag-title">
            {{title}}
        </div>
        <chrome-picker class="picker" v-model="tempColor" />
        <div class="colorpick-btn-wrapper">
            <div class="colorpick-confirm-btn" @click="changeTagColor">
                <p>Confirm</p>
            </div>
            <div class="colorpick-cancel-btn" @click="$emit('close')">
                <p>Cancel</p>
            </div>
        </div>
    </div>
</template>

<script>
    import {
        Chrome
    } from 'vue-color'
    export default {
        name: 'Colorpicker',
        components: {
            'chrome-picker': Chrome,
        },
        props: {
            title: String,
            color: String,
            index: Number,
        },
        methods:{
            changeTagColor(){
                this.folderlist[this.index].color = this.tempColor.hex
                this.$store.commit('UPDATE_LISTS', this.folderlist)
                this.$emit('close')
            }
        },
        computed:{
            folderlist(){
                let act = this.$store.state.activeGroup
                return this.$store.state.folderLists[act]
            },
            activegroup(){
                return this.$store.state.activeGroup
            },
            tempColor:{
                get(){
                    return this.$store.state.tempColor
                },
                set(color){
                    this.$store.commit('COLOR_UPDATE', color)
                }
            }
        },
        mounted() {
            this.tempColor = this.color
        },
    }
</script>

<style lang="scss">
    #colorpicker {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        span{
            margin-top: 30px;
            font-size: 30px;
        }

        input{
            font-size: 30px;
        }
    }

    .color-tag-title{
        font-size: 20px;
        text-align: center;
        color: var(--lightyellow);
        background-color: var(--popupdark);
    }

    .colorpick-btn-wrapper{
        height: 40px;
        display: flex;
        justify-content: space-around;

        .colorpick-cancel-btn, .colorpick-confirm-btn{
            cursor: default;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;            
            align-items: center;
            color: var(--lightyellow);
            background-color: var(--popupdark);
        }

        .colorpick-cancel-btn:hover, .colorpick-confirm-btn:hover{
            filter: contrast(110%);
        }
    }

    .picker {
        
        background-color: var(--popupdark) !important; 
        width: 100% !important;
        height: 100%;

        .vc-chrome-body{
            background-color: var(--popupdark); 
        }

        input{
            height: 50px !important;
            margin-top: 20px;
            margin-bottom: 20px;
            background-color: #4f5662;
            color: var(--lightyellow) !important;
        }


        .vc-chrome-controls{
            align-items: center;
            .vc-chrome-color-wrap{
                width: 70px;
                height: 70px;
                margin-right: 15px;

                .vc-chrome-active-color, .vc-checkerboard{
                    border-radius: 50%;
                    width: 100%;
                    height: 100%;
                }
            }

            .vc-chrome-hue-wrap, .vc-chrome-alpha-wrap{
                height: 25px !important;
            }
            .vc-hue-picker, .vc-alpha-picker{
                border-radius: 15px;
                width: 25px !important;
                height: 25px !important;
            }
        }

        .vc-chrome-toggle-btn{
            margin-top: 100px;
            .vc-chrome-toggle-icon-highlight{
                display: block !important;
            }
        }

    }

</style>