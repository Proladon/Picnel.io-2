<template>
    <div id="settings-view" class="views-page">
        <div class="settings-content-wrapper views-page-wrapper">

            <div class="settings-wrapper">

                <div class="controls-wrapper">
                    
                    <div class="settings-category">
                        <p class="settings-category-title">💨 Animation</p>
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

                    <div class="settings-category">
                        <p class="settings-category-title">📢 Notification</p>
                        <Settingsitem 
                            type="toggle"
                            config="mode_notify"
                            name="Mode Change" 
                            description="Changing view mode notification"
                            :val="mode_notify"
                        />
                        
                        <Settingsitem 
                            type="toggle"
                            config="copy_notify"
                            name="Copy Change" 
                            description="Copy file notification"
                            :val="copy_notify"
                        />

                        <Settingsitem 
                            type="toggle"
                            config="move_notify"
                            name="Move Change" 
                            description="Move file notification"
                            :val="move_notify"
                        />

                        <Settingsitem 
                            type="toggle"
                            config="delete_notify"
                            name="Delete File" 
                            description="Delete file notification"
                            :val="delete_notify"
                        />
                    </div>

                    <div class="settings-category">
                        <p class="settings-category-title">⚡ Update</p>
                        <Settingsitem 
                            type="toggle"
                            config="check_update"
                            name="Auto Check" 
                            description="Auto check update on startup"
                            :val="check_update"
                        />
                    </div>

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
               // Anime
               viewer_anime: state => state.config.viewer_anime,
               folders_anime: state => state.config.folders_anime,
               
               // Notify
               mode_notify: state => state.config.mode_notify,
               copy_notify: state => state.config.copy_notify,
               move_notify: state => state.config.move_notify,
               delete_notify: state => state.config.delete_notify,
                
               // Update
               check_update: state => state.config.check_update,
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
        flex-direction: column;
        width: 100%;
        height: 100%;
    }

    .controls-wrapper {
        overflow: auto;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        padding-right: 15px;

        .settings-category{
            margin-bottom: 30px;
        }

        .settings-category-title {
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