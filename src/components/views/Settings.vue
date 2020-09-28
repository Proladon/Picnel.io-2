<template>
    <div id="settings-view" class="views-page">
        <div class="settings-content-wrapper views-page-wrapper">

            <div class="settings-wrapper">

                <div class="controls-wrapper">
                    
                    <p class="settings-category">Animation</p>
                    <Settingsitem 
                        type="toggle"
                        config="folders_anime"
                        name="Target Folders" 
                        description="Listing target fodlers animation"
                        :val="folders_anime"
                    />
                    
                    <Settingsitem 
                        type="toggle"
                        config="viewer_anime"
                        name="Viewer" 
                        description="Changing file animation"
                        :val="viewer_anime"
                    />

                </div>

            </div>

        </div>
    </div>
</template>

<script>
    import Settingsitem from '@/components/settings/Settingsitem.vue'
    import {mapState} from 'vuex'
    import Store from 'electron-store'
    export default {
        name: 'Settings',
        components:{
            Settingsitem,
        },
        computed:{
           ...mapState({
               viewer_anime: state => state.config.viewer_anime,
               folders_anime: state => state.config.folders_anime,
           })
       },
       mounted(){
            const store = new Store()
            if (store.get('user_configs') === undefined){
                store.set('user_configs', {})
            }
       }
    }
</script>

<style scoped lang="scss">
    #settings-view {
        color: lightgray;
    }

    .settings-wrapper {
        display: flex;
        width: 100%;
        height: 100%;
    }



    .controls-wrapper {
        overflow: auto;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        // border: solid 2px lightsalmon;

        .settings-category {
            text-align: center;
            font-size: 20px;
            margin-bottom: 10px;
        }

        .config-item{
            padding: 10px;
            margin-bottom: 20px;
        }

        .config-item:hover{
            color: var(--dark);
            background-color: lightblue;
        }

        .config-name{
            font-size: 18px;
        }

        .config-description{
            color: gray;
        }
    }

</style>