<template>
    <div id="folderslist">
        <div class="tab-control">
            <button >ADD Folder</button>
            <button @click="addGroupModal">ADD Group</button>
        </div>  
        <splitpanes>

            <!-- Folders -->
            <pane size="70">
                <draggable v-model="folderlist">
                    <div v-for="i in folderlist" :key="i.name" class="draggable-item">
                        {{i.name}}
                    </div>
                </draggable>
            </pane>

            <!-- Group -->
            <pane>
                <draggable v-model="foldergroups">
                    <div class="draggable-item" 
                        v-for="group in foldergroups" 
                        :key="group.name"
                        @click="changeGroup(group.name)">
                        {{group.name}}
                    </div>
                </draggable>
            </pane>

        </splitpanes>

        <!-- Modal -->
        <modal name="addgroup">
            <input type="text" 
                autofocus  
                ref ="inputGroupName" 
                @keypress.enter.prevent="addgroup">
            This is an example
        </modal>

    </div>
</template>

<script>
    // Splitpanes
    import {
        Splitpanes,
        Pane
    } from 'splitpanes'
    import draggable from 'vuedraggable'
    import 'splitpanes/dist/splitpanes.css'

    export default {
        name: 'Folderslist',
        components: {
            Splitpanes,
            Pane,
            draggable,
        },
        methods: {
            changeGroup(name) {
                this.$store.commit('CHANGE_ACTIVE_GROUP', name)
            },
            addGroupModal(){
                this.$modal.show('addgroup')
            },
            addgroup(){
                const name = this.$refs.inputGroupName.value
                if (name.trim(' ') === '') return
                else{
                    const data = {
                        name: name,
                        path: ""
                    }
                    this.$store.commit('ADD_GROUP', data)
                }
            },

        },
        computed: {
            foldergroups:{
                get(){
                    return this.$store.state.folderGroups
                },
                set(data){
                    this.$store.commit('UPDATE_GROUP', data)
                }
            },
            folderlist: {
                get(){
                    let act = this.$store.state.activeGroup
                    return this.$store.state.folderLists[act]
                },
                set(data){
                    this.$store.commit('UPDATE_LISTS', data)
                }
            },
            activegroup(){
                return this.$store.state.activeGroup
            }
        },
    }
</script>

<style scoped lang="scss">
    #folderslist {
        width: 100%;
        height: 100%;
        background-color: rgb(44, 44, 44);
    }


    .tab-control {
        width: 100%;
        height: 30px;
        background-color: cadetblue;
    }

    .draggable-item {
        width: 100%;
        margin: 5px;
        background-color: white;
    }
</style>