<template>
    <table-operate-btn
        v-bind="this.$props"
        @click="()=>{ this.$emit('click')}"
    />
</template>

<script>
    import TableOperateBtn from '~Components/regular/common/table/operate/TableOperateBtn'
    export default {
        name: "TableDeleteOperateBtn",
        components:{
            TableOperateBtn
        },
        props: {
            title: {
                type: String,
                default(){
                    return this.$t('langMap.table.actions.popover.defaultConf.title') ;
                }
            },
            content: {
                type: String,
                default(){
                    return this.$t('langMap.button.actions.delById') ;
                }
            },
            size: {
                type: String,
                default: 'small'
            },
            icon: {
                type: String,
                default: 'delete'
            },
            type: {
                type: String,
                default: 'danger'
            },
            shape: {
                type: String,
                default: 'circle'
            },
            block:{
                type: Boolean,
                default: false
            }
        },
        data(){
            return {}
        }
    }
</script>

<style scoped>

</style>
