<template>
   <div id="folderslist">
      <button @click="panesNumber++">Add pane</button>
<button @click="panesNumber--">Remove pane</button>
      <splitpanes class="default-theme" style="height: 100%">
         <pane v-for="i in panesNumber" :key="i">
            <span>{{ i }}</span>
         </pane>
      </splitpanes>

   </div>
</template>

<script>
   // Splitpanes
   import {
      Splitpanes,
      Pane
   } from 'splitpanes'
   import 'splitpanes/dist/splitpanes.css'
   export default {
      name: 'Folderslist',
      components:{
         Splitpanes,
         Pane,
      },
      data: () => ({
         panesNumber: 3
      })
   }
</script>

<style scoped lang="scss">
   #folderslist {
      width: 100%;
      height: 100%;
      background-color: rgb(44, 44, 44);
   }
</style>