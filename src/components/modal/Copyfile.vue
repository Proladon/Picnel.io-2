<template>
   <div id="copyfile-modal">
       <div class="modal-select-btn" @click="copyimg">
           <p>Copy to clipboard</p>
           <p class="notice">*only support image file</p>
       </div>

       <div class="modal-select-btn" @click="copypath">
           <p>Copy Path</p>
       </div>

       <div class="modal-select-btn" @click="copyname">
           <p>Copy name</p>
       </div>

       <!-- Notify -->
        <notifications
            group="copyfile"
            position="bottom right"
            animation-type="velocity"
        />
   </div>
</template>

<script>
import {clipboard, nativeImage} from 'electron'
   export default {
       name: 'Copyfile',
       props:['curfile', 'filename'],
       methods:{
           copyimg(){
               const img = nativeImage.createFromPath(this.curfile)
               clipboard.writeImage(img)
               //    Notify
               this.$emit("close")
           },
           copypath(){
               clipboard.writeText(this.curfile)
               //    Notify
               this.$emit("close")
           },
           copyname(){
               clipboard.writeText(this.filename)
               //    Notify
               this.$emit("close")
           }
       }
   }
</script>

<style scoped lang="scss">
   #copyfile-modal{
       width: 100%;
       height: 100%;
   }
</style>