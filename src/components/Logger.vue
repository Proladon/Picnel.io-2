<template>
    <div id="logger">
        <div class="tab-header">
            <!-- Copy -->
            <div class="copy-logger tab-item" 
                @click="tabActive('Copylog')"
                :class="{tab_active:activetab==='Copylog'}">
                <p>Copy Log</p>
                <div class="unread" v-show="this.Copylog_Unread !== 0">{{this.Copylog_Unread}}</div>
            </div>
            <!-- Move -->
            <div class="move-logger tab-item" 
                @click="tabActive('Movelog')"
                :class="{tab_active:activetab==='Movelog'}">
                <p>Move Log</p>
                <div class="unread" v-show="this.Movelog_Unread !== 0">{{this.Movelog_Unread}}</div>
            </div>
            <!-- Delete -->
            <div class="move-logger tab-item" 
                @click="tabActive('Deletelog')"
                :class="{tab_active:activetab==='Deletelog'}">
                <p>Delete Log</p>
                <div class="unread" v-show="this.Deletelog_Unread !== 0">{{this.Deletelog_Unread}}</div>
            </div>
            <!-- Rename -->
            <div class="move-logger tab-item" 
                @click="tabActive('Renamelog')"
                :class="{tab_active:activetab==='Renamelog'}">
                <p>Rename Log</p>
                <div class="unread" v-show="this.Renamelog_Unread !== 0">{{this.Renamelog_Unread}}</div>
            </div>

            <div class="clear-log tab-item" @click="clearLog">
                🗑
            </div>
        </div>

        <div class="logging-viewer">
            <keep-alive>
                <component :is='logger_component' />
            </keep-alive>
        </div>

    </div>
</template>

<script>
    import Copylog from '@/components/loggers/Copylog.vue'
    import Movelog from '@/components/loggers/Movelog.vue'
    import Deletelog from '@/components/loggers/Deletelog.vue'
    import Renamelog from '@/components/loggers/Renamelog.vue'
    import {mapState} from 'vuex'
    export default {
        name: 'Logger',
        components: {
            Copylog,
            Movelog,
            Deletelog,
            Renamelog,
        },
        data(){
            return{
                logger_component: "Copylog",
            }
        },
        methods:{
            tabActive(tab){
                this.logger_component = tab
                this.$store.commit('ACTIVE_TAB', tab)
                this.$store.commit('CLEAR_UNREAD')
                const logger = document.getElementById('logger')
                setTimeout(() => {
                    logger.scrollTop = logger.scrollHeight
                }, 0);
            },

            clearLog(){
                this.$modal.show("dialog",{
                    title: `Clear log`,
                    text: `Clear all ${this.activetab} log ?`,
                    buttons: [
                        {
                            title: "Clear",
                            class: "dialog-red-btn dialog-btn",
                            handler: () => {
                                this.$store.commit('CLEAR_LOG')
                                this.$modal.hide("dialog")
                            }
                        },
                        {
                            title: "Cancel",
                            class: "dialog-green-btn dialog-btn",
                            handler: () => {
                                this.$modal.hide("dialog")
                            }
                        }
                    ]
                })
            },
        },
        computed: {
            ...mapState({
                activetab: state => state.log.activeTab,
                Copylog_Unread: state => state.log.Copylog_Unread,
                Movelog_Unread: state => state.log.Movelog_Unread,
                Deletelog_Unread: state => state.log.Deletelog_Unread,
                Renamelog_Unread: state => state.log.Renamelog_Unread,
            }),

            
        },
        watch: {
            logging: () => {
                const logger = document.getElementById('logger')
                // Wait for DOM create element.
                setTimeout(() => {
                    logger.scrollTop = logger.scrollHeight
                }, 0);
            }
        }
    }
</script>

<style scoped lang="scss">
    #logger {
        color: rgba($color: white, $alpha: .5);
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        position: relative;
        background-color: #1C1E26;
        overflow: auto;
    }

    .tab-header {
        position: sticky;
        top: 0;
        width: 100%;
        height: 30px;
        display: flex;
        background-color: #1C1E26;
        border-bottom: solid 2px var(--popupdark);

        .tab-item {
            cursor: pointer;
            text-align: center;
            display: flex;
            align-items: center;
            padding-top: 3px;
            padding-bottom: 3px;
            padding-left: 10px;
            padding-right: 10px;
            box-sizing: border-box;
            background-color: var(--popupdark);
        }

        .tab_active {
            color: var(--popupdark);
            background-color: var(--lightyellow);
        }

        .clear-log{
            position: absolute;
            right: 0;
        }
        .clear-log:hover{
            background-color: rgb(228, 41, 97);
        }

        .unread{
            margin-left: 10px;
            width: auto;
            height: 14px;
            padding: 5px;
            color: black;
            border-radius: 20px;
            background-color: rgb(226, 90, 131);
        }
    }
</style>