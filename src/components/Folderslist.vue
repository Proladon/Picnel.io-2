<template>
   <div id="folderslist">
      <div class="tab-control">

      </div>
      <splitpanes>
         <pane size="70">
            <draggable>
               <div v-for="i in obj" :key="i.name" class="draggable-item">
                  {{i.name}}
               </div>
            </draggable>
         </pane>

         <pane>

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
   import draggable from 'vuedraggable'
   import 'splitpanes/dist/splitpanes.css'
   export default {
      name: 'Folderslist',
      components: {
         Splitpanes,
         Pane,
         draggable,
      },
      data: () => ({
         obj: [{
               name: "test1",
               order: 1,
               fixed: false,
            },
            {
               name: "test2",
               order: 1,
               fixed: false,
            }
         ]
      })
   }
</script>

<style scoped lang="scss">
   #folderslist {
      width: 100%;
      height: 100%;
      background-color: rgb(44, 44, 44);
   }


   .tab-control{
      width: 100%;
      height: 30px;
      background-color: cadetblue;
   }

   .draggable-item {
      width: 100%;
      margin: 5px;
      background-color: white;
   }
</style>