<template>
   <div class="settings-item">

       <div class="settings-item-contains">
           <p class="settings-item-title">{{name}}</p>
           <p class="settings-item-description">{{description}}</p>
       </div>

       <div class="controls-wrapper">
           <VueToggles v-if="type === 'toggle' " @click="toggle" :value="val" checkedText="On" uncheckedText="Off" checkedBg="skyblue"/>
           
       </div>

   </div>
</template>

<script>
import VueToggles from 'vue-toggles';

   export default {
       name: 'Settingsitem',
       components:{VueToggles},
       props:[
           "name",
           "description",
           "type",
           "config",
           "val",
       ],
       
       methods:{
           toggle(){
               this.$store.commit('TOGGLE_CONFIG', this.config)
           }
       },
   }
</script>

<style scoped lang="scss">
   .settings-item{
       padding: 10px;
       display: flex;
       justify-content: space-between;
       align-items: center;
    //    border: solid 2px greenyellow;
   }
    .settings-item:hover{
        background-color: rgba(white, .15);
    }
   .vue-toggles{
       outline: none;
   }


    .settings-item-contains{

        
        .settings-item-title{
            font-size: 16px;
            margin-bottom: 5px;
        }
        .settings-item-description{
            color: gray;
        }
    }
</style>