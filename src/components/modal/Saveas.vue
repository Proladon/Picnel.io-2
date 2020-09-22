<template>
   <div id="saveas-modal">
       <p class="modal-title">Save as</p>
       <div class="openfolder"  @click="selectFolder">
           Select Folder
       </div>
       <input type="text" placeholder="newWorkspace">
   </div>
</template>

<script>
    import {remote} from 'electron'
   export default {
       name: 'Saveas',
       methods:{
           selectFolder(){
               let folderpath = remote.dialog.showSaveDialog()
           }
       }
   }
</script>

<style scoped lang="scss">
   #saveas-modal{
       width: 100%;
       height: 100%;
   }
</style>