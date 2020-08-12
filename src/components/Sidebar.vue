<template>
    <div id="sidebar">
        <div class="nav" @click="changemode">{{mode}}</div>
        <div class="nav" >Mode</div>
        <div class="nav" @click="readjdata">Read test</div>
        <div class="nav" @click="writejdata">Write test</div>
        
        <div class="nav">
            <label class="directory-upload">
                <input type="file"  webkitdirectory directory />
                Save as
            </label>
        </div>

        <!-- Notify -->
        <notifications group="foo" position="bottom right" animation-type="velocity"/>
    </div>
</template>

<script>
    import fs from 'fs-extra'
    export default {
        name: 'Sidebar',
        methods: {
            changemode() {
                this.$notify({
                    group: 'foo',
                    type: 'error',
                    title: 'Important message',
                    text: 'Hello user! This is a notification!'
                })
            },
            // 測試
            readjdata(){
                fs.readJson('C:/Users/Proladon/Desktop/test.json')
                    .then(res => {
                        console.log(res)
                    })
                    .catch(err => {
                        console.log(err)
                    })
            },
            writejdata(){
                const url = 'C:/Users/Proladon/Desktop/test.json'
                fs.readJson(url)
                    .then(res => {
                        res.name3 = "Renloter";
                        fs.outputJson(url, res)
                            .then(() => {
                                console.log("done")
                            })
                            .catch(err => {
                                console.log(err)
                            })
                    })
                    .catch(err => {
                        console.log(err)
                    })
            },
        },
        computed: {
            mode() {
                return this.$store.state.mode
            }
        }
    }
</script>

<style scped lang="scss">
    #sidebar {
        width: 50px;
        // height: 100%;
        padding-top: 20px;
        padding-bottom: 20px;
        background-color: rgb(51, 108, 131);
    }

    .nav {
        margin-bottom: 30px;
    }
</style>