<template>
    <div id="sidebar" ref="sidebar">
        <div class="tools">
            <h1 align="center" @click="changeMode">M</h1>
            <p align="center">{{viewmode}}</p>
        </div>
        <!-- Notify -->
        <notifications 
            group="mode" 
            position="center center" width="500px"
            animation-type="velocity" />
        
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    export default {
        name: 'Sidebar',
        methods: {
            changeMode(){
                if (this.viewmode === 'Random'){
                    this.$store.commit('CHANGE_MODE', 'PreNext')
                }
                else{
                    this.$store.commit('CHANGE_MODE', 'Random')
                }
                this.$notify({
                    group: 'mode',
                    type: 'mode',
                    title: 'Mode Change',
                    text: `${this.viewmode}`,
                })
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
    
    #sidebar {
        width: 70px;
        height: 100%;
        box-sizing: border-box;
        // background-color: rgb(51, 108, 131);
        background-color: cadetblue;
    }

    // .mode-notify{
    //     text-align: center !important;
    //     border-radius: 10px;
    //     box-sizing: border-box;
    //     padding: 15px;
    //     font-size: 30px;
    //     height: 100px;
    // }

</style>