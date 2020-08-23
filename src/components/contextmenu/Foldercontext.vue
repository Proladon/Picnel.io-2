<template>
   <div id="folder-context">
       <div class="context-item-wrapper">
            <p class="context-item" @click="$emit('deletefolder')">Delete</p>
        </div>
   </div>
</template>

<script>
   export default {
       name: 'Foldercontext',
   }
</script>

<style scoped lang="scss">
   #folder-context{
        width: auto;
        height: auto;
        padding: 10px;
        border-radius: 5px;
        position: fixed;
        z-index: 10000;
        transform: scale(0);
        transform-origin: top left;
        transition: .1s ease-in-out;
        color: var(--lightyellow);
        background-color: var(--popupdark);
        box-shadow: 3px 3px 10px 1px black;
   }

    .context-item-wrapper {
        width: 100%;
        height: 100%;
    }

    .context-item {
        cursor: pointer;
    }

    .context-item:hover {
        background-color: cadetblue;
    }
</style>