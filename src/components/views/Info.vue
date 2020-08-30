<template>
    <div id="info-view" class="views-page">
        <div class="info-content-wrapper views-page-wrapper">
            
            <div class="info-btn-wrapper">
                <div class="info-btn">
                    <p>Release</p>
                </div>

                <div class="info-btn">
                    <p>Documentation 📚</p>
                </div>

                <div class="info-btn">
                    <p>About 🔰</p>
                </div>
            </div>

            <div class="info-content">
                <div class="about" v-show="info === 'about'">
                    <p class="content-h1">About</p>

                    <div class="related-img content-block">
                        <img src="@/assets/img/electron.png" alt="">
                        <img src="@/assets/img/vuejs.png" alt="">
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
    export default {
        name: 'Info',
        data(){
            return{
                info: 'about',
            }
        }
    }
</script>

<style scoped lang="scss">
    //    #info-view{}

    .info-content-wrapper {}

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
            background-color: mediumspringgreen;
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
            width: 150px;
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