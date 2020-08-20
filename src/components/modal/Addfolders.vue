<template>
   <div id="addfolders" >
       <p class="modal-title">Add Folders</p>

        <div class="upload-folder-btn-wrapper">
            <label class="directory-upload">
                <input type="file" @change="uploadfolders" multiple webkitdirectory directory />
                <p>Upload Folder</p>
            </label>
        </div>
        <p class="upload-notice">*Only support single folder</p>

        <h2>OR</h2>

       <div class="folders-drop-zone" >
           <input type="text" @drop="drop" name="" id="">
           <p>Drop Folders</p>
       </div>

       <!-- Notify -->
       <notifications group="onlyfolder" position="bottom right" animation-type="velocity"/>
   </div>
</template>

<script>
   export default {
       name: 'Addfolders',
       props: ['group'],
       methods:{
           uploadfolders(e){
               console.log(e)
           },
           drop(e){
            let folders = []
            const ignore = ['image', 'video', 'audio']
            let count = 0
            let warn = false

            // Get every 
            for(let i of e.dataTransfer.items){
                if (i.kind !== 'file' || ignore.includes(i.type.split('/')[0])) {
                    warn = true
                    break
                }
                else {
                    count += 1
                    folders.push(i.getAsFile().path)
                }
            }

            // Notify
            if (warn){
                this.$notify({
                    group: 'onlyfolder',
                    type: 'error',
                    title: 'Upload Error',
                    text: 'Only support folder !',
                })
            }
            else{
                this.$notify({
                    group: 'foo',
                    title: 'Done',
                    text: `Add ${count} folders to ${this.group}`,
                })

                // this.$store.commit()
            }

           },

           drag(e){
               console.log(e)
           }
       },
       computed:{
       }
   }
</script>

<style scoped lang="scss">
   #addfolders{
       width: 100%;
       height: 100%;
   }

   .modal-title{
       font-size: 30px;
       color: var(--lightyellow);
       background-color: var(--popupdark);
       border-radius: 5px;
       text-align: center;
   }

   .upload-notice{
       text-align: center;
   }

   .folders-drop-zone{
       width: 100%;
       height: 200px;
       display: flex;
       justify-content: center;
       align-items: center;
       box-sizing: border-box;
       position: relative;

       input{
           cursor: default;
           width: 100%;
           height: 100%;
           margin: 0 auto;
           box-sizing: border-box;
           border: solid 5px gray;
           border-style: dashed;
           border-radius: 10px;
           outline: none;
           caret-color: transparent;
       }

       p{
           pointer-events: none;
           position: absolute;
           font-size: 30px;
           letter-spacing: 10px;
       }
   }

   .upload-folder-btn-wrapper {
        cursor: pointer;
        width: 50%;
        margin: 0 auto;
        margin-top: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: hotpink;
        border-radius: 10px;

        p{
            color: var(--dark);
            font-size: 30px;
            padding: 5px;
        }
    }

    .upload-folder-btn-wrapper:hover{
        filter:brightness(70%)
    }

    .directory-upload {
        color: lightgrey;
        display: inline-block;
        cursor: pointer;

        input[type="file"] {
            display: none;
        }
    }

    h2{
        text-align: center;
        margin-top: 20px;
        margin-bottom: 20px;
    }
</style>