<template>
    <span :is="domType">
        <slot name="operates" />
    </span>
</template>

<script>
    export default {
        name: "OblTableAction",
        props:{
            domType:{
                type:String,
                default:'span'
            }
        }
    }
</script>

<style scoped>

</style>
