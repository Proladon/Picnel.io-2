<template>
    <div id="warning">
        <!-- <h1>Warning</h1> -->
        <h1>Warning</h1>
        <div class="dialog-btn-wrapper">
            <div class="dialog-confirm dialog-btn" @click="deleteGroup">Confirm</div>
            <div class="dialog-cancel dialog-btn" @click="$emit('close')">Cancel</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Warning',

        methods:{
            deleteGroup(){
                
            }
        }
    }
</script>

<style scoped lang="scss">
    *{
        margin: 0;
        color: var(--lightyellow);
    }
    #warning {
        width: 100%;
        height: 100%;
        background-color: var(--popupdark);
    }

    .dialog-btn-wrapper{
        display: flex;
        justify-content: space-around;
        align-items: center;
    
        .dialog-btn{
            width: 100%;
            text-align: center;
            padding: 10px;
            background-color: var(--popupdark);
        }
        .dialog-btn:hover{
            background-color: var(--popupdark);
            
            filter: contrast(110%);            
        }

        .dialog-cancel:hover{
            color: hotpink;
        }
    }

</style>