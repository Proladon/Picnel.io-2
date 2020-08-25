<template>
    <div id="logger">
        <div class="tab-header">
            <div class="copy-logger tab-item" 
                @click="tabActive('Copylog')"
                :class="{tab_active:activetab==='Copylog'}">
                <p>Copy Log</p>
            </div>
            <div class="move-logger tab-item" 
                @click="tabActive('Movelog')"
                :class="{tab_active:activetab==='Movelog'}">
                <p>Move Log</p>
            </div>
            <div class="move-logger tab-item" 
                @click="tabActive('Deletelog')"
                :class="{tab_active:activetab==='Deletelog'}">
                <p>Delete Log</p>
            </div>
            <div class="move-logger tab-item" 
                @click="tabActive('Renamelog')"
                :class="{tab_active:activetab==='Renamelog'}">
                <p>Rename Log</p>
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
            },

            clearLog(){
                this.$store.commit('CLEAR_LOG', this.activetab)
            }
        },
        computed: {
            activetab() {
                return this.$store.state.log.activeTab
            }
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
    }
</style>