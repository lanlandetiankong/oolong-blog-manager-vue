<template>
    <span  @click="goToIndex">
        Oolong Blog Manager
    </span>
</template>

<script>
    import {OblCommonMixin} from '~Layout/mixin/OblCommonMixin';
    export default {
        name: "OblProjectTitle",
        mixins:[OblCommonMixin],
        props:{
            goAble:{
                type:Boolean,
                default:true
            }
        },
        methods:{
            goToIndex(){
                if(this.goAble){
                    this.mixin_goToIndex() ;
                }
            }
        }
    }
</script>

<style scoped>

</style>
