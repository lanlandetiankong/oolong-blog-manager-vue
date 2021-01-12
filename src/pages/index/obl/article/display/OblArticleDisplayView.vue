<template>
    <div>
        <h1>OblArticleDisplayView {{formFid}}</h1>
        <div v-html="formData.content">
        </div>
    </div>
</template>

<script>
    import {OblArticleDisplayApi} from './oblArticleDisplayApi'
    export default {
        name: "OblArticleDisplayView",
        data(){
            return {
                formData:{
                    content:''
                }
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
        methods:{
            renderFormData(){
                var _this = this ;
                if(!this.formFid){
                    return ;
                }
                OblArticleDisplayApi.getItemById(this.formFid).then((res) =>{
                    if(res.success){
                        _this.formData = res.bean ;
                    }
                });
            }
        },
        watch: {
            $route(route) {
                if(!this.formFid){
                    return ;
                }
                this.renderFormData();
            }
        },
        mounted() {
            this.renderFormData();
        }
    }
</script>

<style scoped>

</style>
