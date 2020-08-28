<template>
    <div id="sidebar" ref="sidebar">
        
        <div class="tools" @click="changeMode">
            <!-- <h1 align="center">M</h1> -->
            <img src="@/assets/icon/manual.svg" style="filter: contrast(100%); ">
            <p align="center">{{viewmode}}</p>
        </div>

        <div class="tools" @click="toggleFavorite">
            <img src="@/assets/icon/book.svg">
        </div>

        <div class="tools">
            <img src="@/assets/icon/info.svg" style="width:70%">
        </div>
        
        <div class="tools">
            <img src="@/assets/icon/update.svg">
        </div>
        
        <div class="tools">
            <img src="@/assets/icon/energy.svg">
        </div>

        <!-- Notify -->
        <notifications group="mode" position="top center" width="300px" animation-type="velocity" />

    </div>
</template>

<script>
    import {
        mapGetters
    } from 'vuex'
    export default {
        name: 'Sidebar',
        methods: {
            changeMode() {
                if (this.viewmode === 'Random') {
                    this.$store.commit('CHANGE_MODE', 'PreNext')
                } else {
                    this.$store.commit('CHANGE_MODE', 'Random')
                }
                this.$notify({
                    group: 'mode',
                    type: 'mode',
                    title: 'Mode Change',
                    text: `${this.viewmode}`,
                })
            },
            toggleFavorite(){
                this.$store.commit('TOGGLE_VIEW', "favoriteView")
            }
        },
        computed: {
            ...mapGetters({
                viewmode: 'getMode'
            })
        },
    }
</script>

<style scped lang="scss">
    *{
        font-size: 12px;
    }
    #sidebar {
        width: 50px;
        height: 100%;
        box-sizing: border-box;
        padding-top: 10px;
        padding-bottom: 10px;
        // background-color: rgb(51, 108, 131);
        background-color: var(--sidebar);
        z-index: 5;
    }

    .tools {
        cursor: pointer;
        padding: 10px;
        box-sizing: border-box;
        margin-bottom: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        img{
            filter: grayscale(100%);
            width: 80%;
        }
    }

    .tools:hover {
        background-color: rgba($color: #000000, $alpha: .3);
    }



</style>