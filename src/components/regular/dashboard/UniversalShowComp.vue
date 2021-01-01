<template>
    <div>
        <div :style="{ width: '300px', border: '1px solid #d9d9d9', borderRadius: '4px' }">
            <a-calendar :fullscreen="false" @panelChange="onPanelChange" />
        </div>
    </div>
</template>

<script>
    export default {
        name: "UniversalShowComp",
        methods: {
            onPanelChange(value, mode) {
                console.log(value, mode);
            },
        },
    }
</script>

<style scoped>

</style>
