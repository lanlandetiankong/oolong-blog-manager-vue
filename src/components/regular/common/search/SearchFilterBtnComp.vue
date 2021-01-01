<template>
    <a-button type="primary" :icon="showFlag ? 'eye-invisible' : 'eye'"
              v-show="showFlag"
              @click="() =>{$emit('btnClick')}"
    >
        {{$t('langMap.button.actions.filter')}}
    </a-button>
</template>

<script>
    export default {
        name: "SearchFilterBtnComp",
        props:{
            showFlag:{
                type:Boolean,
                default:true
            }
        }
    }
</script>

<style scoped>

</style>
