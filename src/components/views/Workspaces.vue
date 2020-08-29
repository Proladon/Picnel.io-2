<template>
    <div id="workspaces">
        <div class="workspaces-list-wrapper">

            <div class="workspaces-list">

                <div class="workspace-item-wrapper">
                    <div class="workspace-item" v-for="space in workspaces" :key="space.name"
                        @click="choiceWorkspace(space)">
                        <p>{{space.name}}</p>
                        <p>{{space.path}}</p>
                    </div>
                </div>

                <div class="workspace-info">
                    <img src="@/assets/img/kr2.gif" alt="" class="workspace-cover">
                    <p>Workspace:</p>
                    <p>{{data.name}}</p>
                    <p>Path:</p>
                    <p>{{data.path}}</p>

                    <div class="worspace-control">
                        <div class="load-workspace" @click="loadworkspace">Load</div>
                        <div class="delete-workspace">Delete</div>
                    </div>
                </div>

            </div>

        </div>

    </div>
</template>

<script>
    import Store from 'electron-store'
    import fs from 'fs-extra'
    import anime from "animejs";
    export default {
        name: "Workspaces",
        data() {
            return {
                workspaces: Array,
                data: "",
            }
        },
        methods: {
            choiceWorkspace(workspace) {
                this.data = workspace
            },
            loadworkspace(){
                fs.readJson(this.data.path)
                    .then((res) => {
                        this.$store.commit('SET_STATE', res)
                        console.log("done")
                    })
                    .catch(error => {
                        console.error(error)
                    })
            }
        },
        computed: {},
        mounted() {
            anime({
                targets: "#workspaces",
                width: ["0", "100%"],
                easing: "easeInOutCubic",
                duration: 1200,
            })
            setTimeout(() => {
                anime({
                    targets: ".workspace-item",
                    opacity: ['0', '1'],
                    translateY: ['50', '0'],
                    delay: anime.stagger(100, {
                        start: 800
                    }),
                    duration: 2000,
                })
            });
            // Get all workspaces from config.json
            const store = new Store()
            this.workspaces = store.get('workspaces')
        },
        beforeDestroy() {
            anime({
                targets: ".workspace-item",
                opacity: ['1', '0'],
                translateY: ['50', '0'],
                delay: anime.stagger(50),
                duration: 1000,
            })
        }
    };
</script>

<style scoped lang="scss">
    #workspaces {
        position: fixed;
        width: 100%;
        top: 30px;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 2;
        padding-bottom: 60px;
        box-sizing: border-box;
        background-color: var(--dark);
    }

    .workspaces-title {
        color: white;
        font-size: 50px;
        padding-left: 100px;
    }

    .workspaces-list-wrapper {
        display: flex;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 50px;
        right: 0;
        box-sizing: border-box;
        padding: 50px;


    }

    .workspaces-list {
        display: flex;
        width: 100%;
        height: 100%;

        .workspace-item-wrapper {
            width: 70%;
            overflow-y: auto;

            .workspace-item {
                cursor: pointer;
                display: inline-block;
                width: 40%;
                padding: 10px;
                margin-bottom: 20px;
                margin-right: 20px;
                background-color: rgba($color: white, $alpha: 0.7);
                border-radius: 10px;
            }

            .workspace-item:hover {
                filter: brightness(80%);
            }
        }
    }

    .workspace-info {
        width: 30%;
        padding-left: 20px;
        position: relative;
        box-sizing: border-box;
        overflow: hidden;
        .workspace-cover {
            width: 100%;
            height: 300px;
        }

        .worspace-control{
            position: absolute;
            display: flex;
            width: 100%;
            left: 0;
            right: 0;
            bottom: 0;

            .load-workspace, .delete-workspace{
                cursor: pointer;
                color: var(--dark);
                text-align: center;
                width: 100%;
                font-size: 20px;
                padding: 10px;
                background-color: paleturquoise;
            }
            .load-workspace:hover, .delete-workspace:hover{
                filter: brightness(70%);
            }
        }

        p {
            color: white;
            width: 100%;
            
            word-wrap: break-word;
        }
    }

    p {
        font-size: 25px;
        overflow: hidden;
        color: var(--popupdark);
    }
</style>