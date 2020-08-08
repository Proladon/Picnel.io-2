<template>
   <div id="logger">
       <p class="log" v-for="(log, index) in logging" :key="index" :id="`log-${index}`">
          {{log}}
       </p>
   </div>
</template>

<script>
   export default {
       name: 'Logger',
       computed:{
          logging(){
             return this.$store.state.log
          },
       },
       watch:{
           logging:()=>{
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
   #logger{
      color: rgba($color: white, $alpha: .5);
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0;
      background-color: rgb(59, 59, 59);
      overflow: auto;

      .log{
         margin: 5px;
      }
   }
</style>