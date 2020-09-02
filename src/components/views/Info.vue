<template>
    <div id="info-view" class="views-page">
        <div class="info-content-wrapper views-page-wrapper">
            
            <div class="info-btn-wrapper">

                <div class="info-btn" @click="about" :class="{active_info_btn : info==='about'}">
                    <p>🔰 About</p>
                </div>

                <div class="info-btn" @click="release" :class="{active_info_btn : info==='release'}">
                    <p>Release</p>
                </div>

                <div class="info-btn url-btn" @click="docs">
                    <p>📚 Documentation</p>
                </div>

                <div class="info-btn url-btn" @click="report" :class="{active_info_btn : info==='report'}">
                    <p>🔥 Bugs report</p>
                </div>
            </div>
            


            <div class="info-content">

                <div class="release-info" v-if="info === 'release'">
                    <p class="content-h1">Release</p>
                    <div class="content-block">
                        <p class="content-h2">Ver. 1.0 Alpha</p>
                    </div>
                </div>


                <div class="about" v-if="info === 'about'">
                    <p class="content-h1">About</p>

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
                                <a href="https://github.com/Proladon">Github Profile</a>
                                <a href="https://github.com/Proladon">Discord Server</a>
                            </div>
                        </div>
                    </div>

                    <p class="content-h2">OpenSource</p>
                    <a href="https://github.com/Proladon/Picnel.io-2">Github</a>

                </div>

            </div>

        </div>
    </div>
</template>

<script>
import {shell, remote} from 'electron'
    export default {
        name: 'Info',
        data(){
            return{
                info: 'about',
            }
        },
        methods:{
            release(){
                this.info = 'release'
            },
            about(){
                this.info = 'about'
            },
            docs(){
                remote.dialog.showMessageBox({
                    message: "Sorry, we don't have documentation yet :("
                })
            },
            report(){
                shell.openExternal('https://github.com/Proladon/Picnel.io-2/issues/new')
            }
        }
    }
</script>

<style scoped lang="scss">
    //    #info-view{}

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