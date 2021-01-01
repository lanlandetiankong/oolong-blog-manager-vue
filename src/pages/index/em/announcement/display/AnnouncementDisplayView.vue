<template>
    <div>
        <div v-if="typeof(announcement.obj) != 'undefined' && announcement.obj != null"
        >
            <a-layout>
                <a-layout-header :style="styleConf.layout.header.base">
                    <a-row type="flex" justify="center">
                        <a-col :span="24" style="font-size: 30px;">
                            {{announcement.obj.title}}
                        </a-col>
                    </a-row>
                </a-layout-header>
                <a-layout-content :style="styleConf.layout.content.baae">
                    <div class="ql-container ql-snow" :style="styleConf.layout.content.rootDiv">
                        <div class="ql-editor">
                            <div v-html="announcement.obj.content">
                                {{announcement.obj.content}}
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
                announcement:{
                    obj:{},
                    fid:''
                },
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
        mounted(){
            var _this = this ;
            var routeQuery = this.$route.query ;
            if(routeQuery){
                _this.announcement.fid = routeQuery.fid ;
            }
            if(_this.announcement.fid){
                AnnouncementDisplayApi.getItemById(_this.announcement.fid).then((res) =>{
                    if(res.success){
                        _this.announcement.obj = res.bean ;
                    }
                });
            }
        },
        destroyed(){
            console.log("公告展示-页面销毁 ...")
        }
    }
</script>
<style scoped>

</style>
