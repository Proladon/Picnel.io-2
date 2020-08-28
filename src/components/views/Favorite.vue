<template>
    <div id="favorite">
        <div class="favorite-list-wrapper">
            <div class="favorite-item">
                <button>1010</button>
            </div>
        </div>
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
    computed:{
    }
};
</script>

<style scoped lang="scss">
#favorite {
    width: 100%;
    position: fixed;
    top: 30px;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 2;
    background-color: var(--dark);
}
</style>
