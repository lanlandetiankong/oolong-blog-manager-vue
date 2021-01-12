<template>
    <div>
        <div v-if="typeof(formData) != 'undefined' && formData != null"
        >
            <a-layout>
                <a-layout-header :style="styleConf.layout.header.base">
                    <a-row type="flex" justify="center">
                        <a-col :span="24" style="font-size: 30px;">
                            {{formData.title}}
                        </a-col>
                    </a-row>
                </a-layout-header>
                <a-layout-content :style="styleConf.layout.content.baae">
                    <div class="ql-container ql-snow" :style="styleConf.layout.content.rootDiv">
                        <div class="ql-editor">
                            <div v-html="formData.content">
                                {{formData.content}}
                            </div>
                        </div>
                    </div>
                </a-layout-content>
            </a-layout>
        </div>
    </div>
</template>
<script>
    import {AnnouncementDisplayApi} from './announcementDisplayApi.js'
    export default {
        name: "AnnouncementDisplayView",
        data(){
            return {
                formData:{},
                styleConf:{
                    layout:{
                        header:{
                            base:{
                                background: '#fff',
                                padding: 0
                            }
                        },
                        content:{
                            baae:{
                                margin: '0 16px'
                            },
                            rootDiv:{
                                padding: '24px',
                                background: '#fff',
                                minHeight: '360px',
                                margin:'16px 0',
                                textAlign:'left'
                            }
                        }
                    }
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
                //渲染formData 的值
                var _this = this ;
                if(!this.formFid){
                    return ;
                }
                AnnouncementDisplayApi.getItemById(this.formFid).then((res) =>{
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
