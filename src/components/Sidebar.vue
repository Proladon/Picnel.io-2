<template>
  <div id="sidebar">
      <div class="nav">{{mode}}</div>
      <div class="nav">Mode</div>
  </div>
</template>

<script>
export default {
    name: 'Sidebar',
    methods:{

    },
    computed:{
        mode(){
            return this.$store.state.mode
        }
    }
}
</script>

<style scped lang="scss">
#sidebar{
    width: 50px;
    height: 100%;
    padding-top: 20px;
    padding-bottom: 20px;
    background-color: rgb(51, 108, 131);
}

.nav{
    margin-bottom: 30px;
}
</style>