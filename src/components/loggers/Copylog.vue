<template>
    <div id="copy-log">
        <div class="log" v-for="(log, index) in logging" :key="index">
            <p>{{log.split('//')[0]}}</p>
            <p>{{log.split('//')[1]}}</p>
            <p>{{log.split('//')[2]}}</p>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Copylog',
        computed: {
            logging() {
                return this.$store.state.log.copyLog
            },
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
    #copy-log {
        color: rgba($color: white, $alpha: .5);
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        background-color: #1C1E26;

        .log {
            margin: 15px;
        }
    }
</style>