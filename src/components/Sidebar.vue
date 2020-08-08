<template>
    <div id="sidebar">
        <div class="nav" @click="changemode">{{mode}}</div>
        <div class="nav">Mode</div>
        <notifications group="foo" position="bottom right" animation-type="velocity"/>
    </div>
</template>

<script>
    export default {
        name: 'Sidebar',
        methods: {
            changemode() {
                this.$notify({
                    group: 'foo',
                    type: 'error',
                    title: 'Important message',
                    text: 'Hello user! This is a notification!'
                });
            }
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