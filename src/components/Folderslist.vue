<template>
    <div id="folderslist">
        <div class="tab-control">
            <p>{{worksapce}}</p>
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
                    <div class="draggable-group" 
                        v-for="group in foldergroups" 
                        :key="group.name"
                        @click="changeGroup(group.name, $event)">
                        {{group.name}}
                    </div>
                </draggable>
            </pane>

        </splitpanes>

        <!-- Modal -->
        <modal name="addgroup">
            <input type="text" 
                id ="inputGroupName" 
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
            //:: Changing active group
            changeGroup(name, e) {
                // remove all element active class
                (document.getElementsByClassName('draggable-group')).forEach(element => {
                    element.classList.remove('active')
                })
                // add clicked element active class
                e.target.classList.add('active')
                this.$store.commit('CHANGE_ACTIVE_GROUP', name)
            },
            
            //:: Show add new group modal
            addGroupModal(){
                this.$modal.show('addgroup')
                setTimeout(() => {
                    document.getElementById('inputGroupName').focus()
                });
            },
            
            //:: Add new group
            addgroup(){
                let el = document.getElementById('inputGroupName')
                if (el.value.trim(' ') === '') {
                    el.value = ""
                    return
                }
                else{
                    const data = {
                        name: el.value.trim(' '),
                        path: ""
                    }
                    this.$store.commit('ADD_GROUP', data)
                    setTimeout(() => {
                        el.value = ""
                    });
                }
            },

        },
        computed: {
            worksapce(){
                return this.$store.state.worksapce
            },
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
        display: flex;
        align-items: center;
        background-color: cadetblue;
    }

    .draggable-item {
        width: 100%;
        margin: 5px;
        background-color: white;
    }

    .draggable-group{
        width: 100%;
        margin: 5px;
        color: white;
    }

    .draggable-group:hover{
        background-color: cadetblue;
    }

    .active{
        background-color: hotpink;
    }
</style>