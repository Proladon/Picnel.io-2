<template>
    <div id="renamefile-modal">
        <p class="modal-title">Rename</p>
        <input type="text" :placeholder="fname" id="fullinput" ref="fullinput"
            @keyup.enter="renamefull"
        >
        <hr>
        <div class="modal-select-btn" @click="plusnum">
            <p>Filename + 1</p>
        </div>
        <div class="modal-select-btn" @click="pluswithbracket">
            <p>Filename + (1)</p>
        </div>
        <div class="modal-select-btn">
            <p>Filename + <input type="text" ref="customplus" @keyup.enter="customplus"></p>
        </div>
    </div>
</template>

<script>
    import path from 'path'
    import {renameJoin, renameLogging} from '@/assets/func/helper.js'
    export default {
        name: 'Renamefile',
        props: ['filepath', 'filename'],
        methods: {
            renamefull() {
                let newName = this.$refs.fullinput.value
                const newPath = renameJoin(this.filepath, this.filename, newName, this.extname)
                // Handle cache files list
                if (this.tempfileslist.length > 3000){
                    this.$store.commit('RENAME_TEMP_FILES_ITEM', {index:this.fileindex, data:newPath})
                }
                this.$store.commit('SET_CURFILE', newPath)
                this.$store.commit('UPDATE_LOG', {
                    logger: 'Renamelog', 
                    log: renameLogging(this.filepath, this.fname, newName)
                })
                this.$emit("close")
            },
            plusnum() {
                let lastword = (+ this.fname[this.fname.length-1]) 
                if (Number.isInteger(lastword)){
                    let newnum = lastword + 1
                    let newName = this.fname.replace(/.$/, newnum)
                    const newPath = renameJoin(this.filepath, this.filename, newName, this.extname)
                    // Handle cache files list
                    if (this.tempfileslist.length > 3000){
                        this.$store.commit('RENAME_TEMP_FILES_ITEM', {index:this.fileindex, data:newPath})
                    }
                    this.$store.commit('SET_CURFILE', newPath)
                    this.$store.commit('UPDATE_LOG', {
                        logger: 'Renamelog', 
                        log: renameLogging(this.filepath, this.fname, newName)
                    })
                }
                else{
                    let newName = this.fname + " 1"
                    const newPath = renameJoin(this.filepath, this.filename, newName, this.extname)
                    // Handle cache files list
                    if (this.tempfileslist.length > 3000){
                        this.$store.commit('RENAME_TEMP_FILES_ITEM', {index:this.fileindex, data:newPath})
                    }
                    this.$store.commit('SET_CURFILE', newPath)
                    this.$store.commit('UPDATE_LOG', {
                        logger: 'Renamelog', 
                        log: renameLogging(this.filepath, this.fname, newName)
                    })
                }

                this.$emit("close")
            },
            pluswithbracket(){
                let newName = this.fname + ' (1)'
                const newPath = renameJoin(this.filepath, this.filename, newName, this.extname)
                

                // Handle cache files list
                if (this.tempfileslist.length > 3000){
                    this.$store.commit('RENAME_TEMP_FILES_ITEM', {index:this.fileindex, data:newPath})
                }
                
                this.$store.commit('SET_CURFILE', newPath)
                this.$store.commit('UPDATE_LOG', {
                    logger: 'Renamelog', 
                    log: renameLogging(this.filepath, this.fname, newName)
                })
                // const match = this.fname.match(/\(([^)]+)\)$/)
                // if (match !== null && Number.isInteger(+ match[1])){
                    
                //     let newnum = (+ match[1]) + 1
                //     let newName = this.fname.replace(/\(([^)]+)\)$/, `(${newnum})`)
                //     const newPath = renameJoin(this.filepath, this.filename, newName, this.extname)
                //     this.$store.commit('SET_CURFILE', newPath)
                //     this.$store.commit('UPDATE_LOG', {
                //         logger: 'Renamelog', 
                //         log: renameLogging(this.filepath, this.fname, newName)
                //     })
                // }
                // else{
                //     let newName = this.fname + ' (1)'
                //     const newPath = renameJoin(this.filepath, this.filename, newName, this.extname)
                //     this.$store.commit('SET_CURFILE', newPath)
                //     this.$store.commit('UPDATE_LOG', {
                //         logger: 'Renamelog', 
                //         log: renameLogging(this.filepath, this.fname, newName)
                //     })
                // }
                this.$emit("close")
            },
            customplus(){
                let newName = this.fname + ` ${this.$refs.customplus.value}`
                const newPath = renameJoin(this.filepath, this.filename, newName, this.extname)
                // Handle cache files list
                if (this.tempfileslist.length > 3000){
                    this.$store.commit('RENAME_TEMP_FILES_ITEM', {index:this.fileindex, data:newPath})
                }
                this.$store.commit('SET_CURFILE', newPath)
                this.$store.commit('UPDATE_LOG', {
                    logger: 'Renamelog', 
                    log: renameLogging(this.filepath, this.fname, newName)
                })
                this.$emit("close")
            }
        },
        computed: {
            fileindex(){
                return this.$store.getters.getFileIndex
            },
            tempfileslist(){
                return this.$store.state.cache.tempFilesList
            },
            fname() {
                return this.filename.replace(path.extname(this.filename), '')
            },
            extname(){
                return path.extname(this.filename)
            }
        }
    }
</script>

<style scoped lang="scss">
    #renamefile-modal {
        width: 100%;
        height: 100%;
    }

    hr{
        margin-top: 20px;
    }

    #fullinput{
        height: 50px;
        margin-top: 20px;
    }

    .modal-select-btn input {
        width: 100px;
    }
</style>