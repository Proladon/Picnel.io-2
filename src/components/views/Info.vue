<template>
    <div id="info-view" class="views-page">
        <div class="info-content-wrapper views-page-wrapper">
            
            <div class="info-btn-wrapper">

                <div class="info-btn" @click="about" :class="{active_info_btn : info==='about'}">
                    <p>🔰 About</p>
                </div>
                
                <div class="info-btn url-btn" @click="update">
                    <p>⚡ Check Update</p>
                </div>
                
                <div class="info-btn url-btn" @click="docs">
                    <p>📚 Documentation</p>
                </div>

                <div class="info-btn url-btn" @click="report" >
                    <p>🔥 Issues report</p>
                </div>

                
            </div>
            


            <div class="info-content">

                <div class="about" v-if="info === 'about'">
                    <p class="content-h1">About</p>
                    <div class="intro content-block">
                        <img src="@/assets/icon/pic2.png" alt="">
                        <div class="intro-content">
                            <p>Version: {{version}}</p>
                        </div>
                    </div>   
                    <div class="related-img content-block">
                        <img src="@/assets/img/electron 2.png" alt="">
                        <img src="@/assets/img/vue 2.png" alt="">
                    </div>   

                    <p class="content-h2">Developers</p>
                    <div class="profile-wrapper content-block">
                        <div class="profile-img" :style="{ backgroundImage: 'url(' + require('@/assets/img/Oreki.png') + ')' }"></div>
                        <div class="profile-content">
                            <p>Proladon</p>
                            <div class="link-wrapper">
                                <a class="link" @click="openlink('https://github.com/Proladon')">Github Profile</a>
                                <a class="link"  @click="openlink('https://shelter-zone.github.io/SHELTER-ZONE/#/')">Discord Server</a>
                            </div>
                        </div>
                    </div>

                    <p class="content-h2">OpenSource</p>
                    <a class="link" @click="openlink('https://github.com/Proladon/Picnel.io-2')">Github Repository</a>

                </div>

            </div>

        </div>
    </div>
</template>

<script>
import {remote} from 'electron'
    export default {
        name: 'Info',
        data(){
            return{
                info: 'about',
                version: "",
            }
        },
        methods:{
            openlink(link){
                remote.shell.openExternal(link)
            },
            release(){
                remote.shell.openExternal('https://github.com/Proladon/Picnel.io-2/releases')
            },
            about(){
                this.info = 'about'
            },
            docs(){
                remote.shell.openExternal('https://proladon.github.io/Picnel.io-2_Documentation/')
            },
            report(){
                remote.shell.openExternal('https://github.com/Proladon/Picnel.io-2/issues/new')
            },
            update(){
                const axios = require('axios')
                axios.get('https://api.github.com/repos/Proladon/Picnel.io-2/releases')
                    .then(res => {
                        let curversion = remote.app.getVersion()
                        // let curversion = '1.0.0'
                        let newset = res.data[0].name

                        if (curversion === newset) {
                            this.$modal.show('dialog', {
                                text: `
                                    <p class="version">Newest: <b class="cur-version">${newset}</b></p>
                                    <p class="version">Current: <b class="cur-version">${curversion}</b></p>
                                    <p class="update-notice">✅ You're in newest version</p>
                                `,
                                buttons: [
                                    {
                                        title: 'Cancel',
                                        class: "dialog-btn dialog-gray-btn",
                                        handler: ()=>{
                                            this.$modal.hide('dialog')
                                        }
                                    },
                                ]
                            })
                        }
                        else{
                            this.$modal.show('dialog', {
                                text: `
                                    <p class="version">Newest: <b class="new-version">${newset}</b></p>
                                    <p class="version">Current: <b class="cur-version">${curversion}</b></p>
                                    <p class="update-notice">⚡ New version available !</p>
                                `,
                                buttons: [
                                    {
                                        title: 'Go Download',
                                        class: "dialog-btn dialog-green-btn",
                                        handler: ()=>{
                                            remote.shell.openExternal(`https://github.com/Proladon/Picnel.io-2/releases/tag/${newset}`)
                                            this.$modal.hide('dialog')
                                        }
                                    },
                                ]
                            })
                        }
                    }).catch(()=>{
                        this.$modal.show('dialog', {
                            text: 'Checking update failed'
                        })
                    })

            }
        },
        mounted(){
            this.version = remote.app.getVersion()
        }
    }
</script>

<style scoped lang="scss">
    //    #info-view{}
    .link{
        color: skyblue;
        text-decoration: underline;
        cursor: pointer;
        font-size: 12px;
        margin-top: 5px;
        margin-right: 20px;
    }
    .info-content-wrapper {}

    .active_info_btn{
        background-color: mediumspringgreen !important;
    }

    .info-btn-wrapper{
        width: 30%;
        height: 100%;
        box-sizing: border-box;
        padding-right: 50px;

        // Side Info Buttons
        .info-btn {
            cursor: pointer;
            display: flex;
            font-size: 15px;
            justify-content: center;
            align-items: center;
            height: 30px;
            margin-bottom: 10px;
            border-radius: 5px;
            background-color: lightgray;
            transition: ease-in-out .3s;
        }

        .info-btn:hover{
            background-color: mediumspringgreen !important;
        }

        .url-btn{
            // background-color: orange;
        }
    }
    

    .info-content{
        width: 100%;
        height: 100%;
        overflow-y: scroll;

        .content-block{
            margin-bottom: 50px;
        }
    }

    .content-h1{
        font-size: 40px;
        color: var(--lightyellow);
        margin-bottom: 30px;
    }

    .content-h2{
        font-size: 25px;
        color: var(--lightyellow);
        margin-bottom: 20px;
    }
    
    a{
        color: skyblue;
        margin-right: 10px;
    }

    .about{
        width: 100%;
        height: 100%;
    }

    .related-img{
        img{
            width: 170px;
            height: 90px;
        }
    }

    .intro{
        display: flex;
        align-items: center;
        img{
            width: 70px;
        }
        .intro-content{
            color: lightgray;
        }
    }
// ---------------- //
//               Profile             //
// ---------------- //
    .profile-wrapper{
        display: flex;
        align-items: center;

        .profile-img{
            width: 100px;
            height: 100px;
            margin-right: 50px;
            background-size: cover;
            background-repeat: no-repeat;
            background-position: center center;
            border-radius: 50px;
        }

        .profile-content{
            .link-wrapper{
                display: flex;
            }
            p{
                font-size: 30px;
                color: white;
            }
            
        }
    }
</style>