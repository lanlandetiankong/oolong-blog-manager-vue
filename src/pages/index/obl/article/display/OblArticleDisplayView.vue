<template>
    <h1>OblArticleDisplayView {{formFid}}</h1>
</template>

<script>
    import {OblArticleDisplayApi} from './oblArticleDisplayApi'
    export default {
        name: "OblArticleDisplayView",
        data(){
            return {
                formConf:{}
            }
        },
        computed:{
            formFid(){
                if(this.queryConf){
                    return this.queryConf.fid ;
                }
                return '';
            },
            queryConf(){
                return this.$route.query ;
            }
        },
        watch: {
            formFid(oval,nval){
                if(!nval){
                    return ;
                }
                this.renderObj();
            }
        },
        methods:{
            renderObj(){
                if(!this.formFid){
                    return ;
                }
                OblArticleDisplayApi.getItemById(this.formFid).then((res) =>{
                    if(res.success){
                        _this.formConf = res.bean ;
                    }
                });
            }
        }
    }
</script>

<style scoped>

</style>
