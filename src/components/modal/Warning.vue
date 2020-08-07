<template>
   <div id="warning">
       Hello
       <button @click="$emit('close')">Close</button>
   </div>
</template>

<script>
   export default {
       name: 'Warning',
       props:['text']
   }
</script>

<style scoped lang="scss">
   #warning{
       width: 100%;
       height: 200px;
   }
</style>