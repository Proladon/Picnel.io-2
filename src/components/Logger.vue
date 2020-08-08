<template>
   <div id="logger">
       <div class="log" v-for="(log, index) in logging" :key="index">
          {{log}}
       </div>
   </div>
</template>

<script>
   export default {
       name: 'Logger',
       computed:{
          logging(){
             return this.$store.state.log
          }
       },
       watch:{
           logging:()=>{
             const logger = document.getElementById('logger')
             logger.scrollTop = logger.scrollHeight + 100
          }
       }
   }
</script>

<style scoped lang="scss">
   #logger{
      color: rgba($color: white, $alpha: .5);
      width: 100%;
      height: 100%;
      
      background-color: rgb(59, 59, 59);
      overflow: auto;

      .log{
         margin: 5px;
      }
   }
</style>