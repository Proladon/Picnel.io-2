<template>
    <div id="sidebar" ref="sidebar">
        
        <div class="views" @click="changeMode">
            <!-- <h1 align="center">M</h1> -->
            <img src="@/assets/icon/manual.svg" style="filter: contrast(100%); ">
            <p align="center">{{viewmode}}</p>
        </div>

        <div class="views" id="homeview" @click="homeView" :class="{active_view: views === 'home'}">
            <img src="@/assets/icon/home.svg">
        </div>

        <div class="views" @click="worksapceView" :class="{active_view: views === 'workspaces'}">
            <img src="@/assets/icon/book.svg">
        </div>

        <div class="views" @click="infoView" :class="{active_view: views === 'info'}">
            <img src="@/assets/icon/info.svg" style="width:70%">
        </div>
        
        <div class="views" @click="updateView" :class="{active_view: views === 'update'}">
            <img src="@/assets/icon/update.svg">
        </div>
        
        <div class="views" @click="settingsView" :class="{active_view: views === 'settings'}">
            <img src="@/assets/icon/energy.svg">
        </div>

        <!-- Notify -->
        <notifications group="mode" position="top center" width="300px" animation-type="velocity" />

    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import {remote} from 'electron'
    export default {
        name: 'Sidebar',
        data(){
            return{
                target: "",
            }
        },
        methods: {
            
            homeView(e){
                this.target = e.target
                this.$store.commit('SET_VIEW', "home")
                // this.$store.commit('HOME_VIEW')
            },
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
            worksapceView(e){
                this.target = e.target
                this.$store.commit('SET_VIEW', "workspaces")
            },
            infoView(e){
                this.target = e.target
                this.$store.commit('SET_VIEW', "info")
            },
            updateView(){
                remote.dialog.showMessageBox({
                    message: "Sorry! this page is not done yet"
                })
                // this.$store.commit('SET_VIEW', "update")

                // this.target = e.target
            },
            settingsView(){
                remote.dialog.showMessageBox({
                    message: "Sorry! this page is not done yet"
                })
                // this.$store.commit('SET_VIEW', "settings")

                // this.target = e.target
            },
        },
        computed: {
            workspacesView(){
                return this.$store.state.app.views.workspacesView
            },
            views(){
                return this.$store.state.app.curView
            },
            ...mapGetters({
                viewmode: 'getMode'
            })
        },
        watch:{
            // workspacesView:{
            //     handler: function (view) {
            //         if(view === false){
            //             this.target = document.getElementById('homeview')
            //         }
            //     }
            // },
            // target: (e)=>{
            //     document.getElementsByClassName('views').forEach(element => {
            //         element.classList.remove('active_view')
            //     })
            //     e.classList.add('active_view')
            // }
        },
        // mounted(){
        //     document.getElementById('homeview').classList.add('active_view')
        // }
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

    .views {
        cursor: pointer;
        padding: 10px;
        box-sizing: border-box;
        margin-bottom: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        img{
            pointer-events: none;
            filter: grayscale(100%);
            width: 80%;
        }
    }

    .views:hover {
        background-color: rgba($color: #000000, $alpha: .3);
    }

    .active_view{
        background-color: rgba($color: #000000, $alpha: .3);
    }



</style>