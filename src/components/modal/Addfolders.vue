<template>
    <div id="addfolders">
        <p class="modal-title">Add Folders</p>

        <div class="upload-folder-btn-wrapper">
            <label class="directory-upload">
                <input
                    type="file"
                    @change="uploadfolders"
                    multiple
                    webkitdirectory
                    directory
                />
                <p>Upload Folder</p>
            </label>
        </div>
        <p class="upload-notice">*Only support single folder and folder need some files inside</p>
        <p class="upload-notice">If not necessary recommend using drop folders</p>

        <h2>OR</h2>

        <div class="folders-drop-zone">
            <input type="text" @drop="drop" name="" id="" />
            <p>Drop Folders</p>
        </div>

        <!-- Notify -->
        <notifications
            group="onlyfolder"
            position="bottom right"
            animation-type="velocity"
        />
    </div>
</template>

<script>
import path from 'path'
export default {
    name: "Addfolders",
    props: ["group", "folderlist"],
    methods: {
        uploadfolders(e) {
            
            const abspath = e.target.files[0].path.split("\\");
            const relpath = e.target.files[0].webkitRelativePath.split("/")[0];
            let pass = false
            if (this.group === ''){
                this.$notify({
                    group: 'foo',
                    type: 'error',
                    title: 'Error',
                    text: 'None active group can be add folder'
                })
                e.target.value = null
                return
            }
            else{
                if (this.folderlist.length > 0){
                    for (let f of this.folderlist){
                        if (relpath === f.name){
                          this.$notify({
                                group: 'foo',
                                type: 'warn',
                                title: 'Warn',
                                text: `Folder ${relpath} already in list`
                            })
                            e.target.value = null
                            return  
                        }
                        else{
                            pass = true
                        }
                    }
                }
                else{
                    pass = true
                }
            }

            if (pass){
                let root = "";
                for (let p of abspath) {
                    if (p !== relpath) {
                        root += p + "/";
                    } else if (p === relpath) {
                        root += p;
                        break;
                    }
                }
                const folder = {
                    name: relpath,
                    path: root,
                    color: 'white'
                }
                
                this.$store.commit('ADD_FOLDER', {group:this.group, folder: folder})
    
                this.$notify({
                    group: 'foo',
                    title: 'Upload Folder',
                    text: `Upload 1 folder to ${this.group}`
                })

                e.target.value = null
            }
            else{
                console.log(false)
                e.target.value = null
            }
        },
        drop(e) {
            let folders = [];
            const ignore = ["image", "video", "audio"];
            let count = 0;

            // Get every
            for (let i of e.dataTransfer.items) {
                if (
                    i.kind !== "file" ||
                    ignore.includes(i.type.split("/")[0])
                ) {
                    // Error not folder
                    this.$notify({
                        group: "onlyfolder",
                        type: "error",
                        title: "Upload Error",
                        text: "Only support folder !",
                    })
                    return
                } else {
                    count += 1;
                    folders.push(i.getAsFile().path);
                }
            }

            // Check Repeat
            let exist = []
            for (let n of this.folderlist){
                exist.push(n.name)
            }
            
            let fname = ""
            for (let fpath of folders){
                fname = path.basename(fpath)
                if (exist.includes(fname)){
                    folders.splice(folders.indexOf(fpath), 1)
                }
                else{
                     let folder = {
                        name: fname,
                        path: fpath,
                        color: 'white'
                    }
                    this.$store.commit('ADD_FOLDER', {group: this.group, folder: folder})
                }
            }
            
            this.$notify({
                group: "foo",
                title: "Done",
                text: `Add ${count} folders to ${this.group}`,
            });

        },
    },
    
};
</script>

<style scoped lang="scss">
#addfolders {
    width: 100%;
    height: 100%;
}

.modal-title {
    font-size: 30px;
    color: var(--lightyellow);
    background-color: var(--popupdark);
    border-radius: 5px;
    text-align: center;
}

.upload-notice {
    text-align: center;
}

.folders-drop-zone {
    width: 100%;
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    position: relative;

    input {
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

    p {
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
    // background-color: hotpink;
    background-color: cadetblue;
    border-radius: 10px;

    label {
        width: 100%;
        height: 100%;
        text-align: center;
        color: var(--dark);
        font-size: 30px;
        padding: 5px;
    }
}

.upload-folder-btn-wrapper:hover {
    filter: brightness(70%);
}

.directory-upload {
    color: lightgrey;
    display: inline-block;
    cursor: pointer;

    input[type="file"] {
        display: none;
    }
}

h2 {
    text-align: center;
    margin-top: 20px;
    margin-bottom: 20px;
}
</style>
