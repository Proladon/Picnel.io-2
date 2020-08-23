<template>
    <div id="addfolders">
        <p class="modal-title">Create New Group</p>

        <input
            type="text"
            id="inputGroupName"
            autofocus
            placeholder="New group name"
            @keypress.enter.prevent="addgroup"
        />

        <!-- Notify -->
        <notifications
            group="onlyfolder"
            position="bottom right"
            animation-type="velocity"
        />
    </div>
</template>

<script>
export default {
    name: "Addfolders",
    props:['foldergroups'],
    methods: {
        addgroup() {
            let el = document.getElementById("inputGroupName");
            let newName = el.value.trim(" ");
            let repeat = false;

            // Check Repeat Name
            for (let name of this.foldergroups) {
                if (newName === name.name) {
                    repeat = true;
                }
            }
            // Check Empty
            if (newName === "" || repeat === true) {
                el.value = "";
                this.$notify({
                    group: 'foo',
                    type: 'warn',
                    title: 'Repeat Warn',
                    text: `${newName} already in groups`
                })
                return;
            } else {
                const data = {
                    name: newName,
                }
                this.$store.commit('ADD_GROUP', data)
                this.$store.commit('ADD_LIST', newName)

                this.$notify({
                    group: 'foo',
                    title: 'Create group',
                    text: `Create group: ${newName} successful`
                })

                this.$emit('close')

                setTimeout(() => {
                    el.value = "";
                });
            }
        },
    },
    mounted(){
        document.getElementById('inputGroupName').focus()
    }
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

#inputGroupName {
    width: 100%;
    margin-top: 20px;
    margin-bottom: 20px;
}
</style>
