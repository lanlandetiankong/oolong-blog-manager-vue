<template>
    <div>
        <a-alert :message="alterMsg" type="info" icon="check-circle" style="text-align:left;"/>
    </div>
</template>

<script>
    export default {
        name: "TableHeadInfo",
        props:{
            show:{
                type:Boolean,
                default:true
            },
            checkedSize:{
                type:Number,
                default:0
            }
        },
        data(){
            return {

            }
        },
        computed:{
            alterMsg(){
                return this.$t('langMap.message.info.tableCheckedSize',[this.checkedSize]) ;
            }
        }
    }
</script>

<style scoped>

</style>
