<template>
    <span>
        <a-popover trigger="hover">
          <template slot="title">
                <slot name="title">
                    <a-icon :type="icon" />{{title}}
                </slot>
          </template>
          <template slot="content">
                <slot name="content">
                    {{content}}
                </slot>
          </template>
          <a-button :type="type"
                    :size="size"
                    :icon="icon"
                    :shape="shape"
                    @click="()=>{ this.$emit('click')}"
          />
        </a-popover>
    </span>
</template>

<script>
    export default {
        name: "TableOperateBtn",
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
                    return this.$t('langMap.table.actions.popover.defaultConf.title') ;
                }
            },
            size: {
                type: String,
                default: 'small'
            },
            icon: {
                type: String,
                default: 'question-circle'
            },
            type: {
                type: String,
                default: ''
            },
            shape: {
                type: String,
                default: 'circle'
            },
            block:{
                type: Boolean,
                default: false
            }
        }
    }
</script>

<style scoped>

</style>
