<template>
    <div id="clear-log">
        <div class="modal-select-btn" @click="clearCur">
            <p>Clear {{logger}} Log</p>
        </div>

        <div class="modal-select-btn" @click="clearAll">
            <p>Clear All Log</p>
        </div>
        <!-- <p>Export Log </p> -->
    </div>
</template>

<script>
    export default {
        name: 'Clearlog',
        props: ['logger'],
        methods:{
            clearCur(){
                this.$store.commit('CLEAR_LOG')
                this.$emit("close")
            },

            clearAll(){
                this.$store.commit('RESET_LOG')
                this.$emit("close")
            }
        }
    }
</script>

<style scoped lang="scss">
    #clear-log {
        width: 100%;
        height: 100%;
    }
</style>