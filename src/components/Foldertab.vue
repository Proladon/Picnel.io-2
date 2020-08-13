<template>
    <div class="foldertab" 
        @drop="drop" 
        @dragover="dragover" 
        @dragleave="dragleave">

    </div>
</template>

<script>
    export default {
        name: "Foldertab",
        methods: {
            drop(e) {
                if (e.dataTransfer.items) {
                    if (e.dataTransfer.items[0].kind === 'file') {
                        const file = e.dataTransfer.items[0].getAsFile()
                        this.$store.commit('SET_CURFILE', file.path)
                    }
                }
            },
            dragover(e) {
                console.log(e)
            },
            dragleave(e) {
                console.log(e)
            }
        }
    }
</script>

<style scoped lang="scss">
    .foldertab {
        width: 100%;
        height: 100%;
    }
</style>