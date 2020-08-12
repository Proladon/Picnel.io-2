<template>
    <div id="statusbar">
        <!-- Folder Reset -->
        <div class="folder-reset status-button status-item" @click="resetfolder">
            ♻
        </div>

        <!-- Upload Folder -->
        <div class="upload-btn-wrapper status-button status-item">
            <label class="directory-upload">
                <input type="file" @change="uploaddir" webkitdirectory directory />
                <p v-if="foldername === 'static'">Upload Folder</p>
                <p v-if="foldername !== 'static'">{{foldername}}</p>
            </label>
        </div>

        <div class="folder-info status-item">
            <p style="color: white;">{{folderinfo}}</p>
        </div>

    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    // import path from 'path'
    export default {
        name: 'Statusbar',
        methods: {
            //:: Upload Folder
            uploaddir(e) {
                this.$store.commit('SET_CURFILE', e.target.files[0].path)
                // reset selected file, or it won't be firing onchange event!
                e.target.value = null
            },
            //:: Reset Folder
            resetfolder() {
                if (this.foldername === 'static') {
                    this.$notify({
                        group: 'home',
                        type: 'warn',
                        title: 'Notification',
                        text: 'No need to reset.'
                    });
                    return
                }
                this.$store.commit('SET_CURFILE', this.home)
                // logging
                this.$store.commit('UPDATE_LOG', "reset folder")
            }
        },
        computed: {
            home() {
                return this.$store.state.home
            },
            ...mapGetters({
                file: 'getCurFilePath',
                folderinfo: 'getFolderInfo',
                foldername: 'getFolderName'
            })
        },
        
    }
</script>

<style scoped lang="scss">
    // Status Bar
    #statusbar {
        width: 100%;
        height: 25px;
        position: absolute;
        display: flex;
        align-items: center;
        bottom: 0;
        background: var(--dark);

        .status-item {
            margin-right: 10px;
        }

        .status-button {
            cursor: pointer;
            background-color: transparent;
            transition: ease-in-out .3s;
        }

        .status-button:hover {
            background-color: rgba($color: white, $alpha: .2);
        }
    }

    // Input: directory
    .upload-btn-wrapper {
        height: 100%;
        display: flex;
        align-items: center;
    }

    .directory-upload {
        color: lightgrey;
        display: inline-block;
        cursor: pointer;

        input[type="file"] {
            display: none;
        }
    }
</style>