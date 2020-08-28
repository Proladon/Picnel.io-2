<template>
    <div id="favorite">
        123
    </div>
</template>

<script>
import anime from "animejs";
export default {
    name: "Favorite",
    mounted() {
        anime({
            targets: ["#favorite"],
            width: ["0", "100%"],
            easing: "easeInOutQuad",
        })
    },
    
};
</script>

<style scoped lang="scss">
#favorite {
    width: 100%;
    height: 100%;
    position: fixed;
    background-color: var(--dark);
}
</style>
