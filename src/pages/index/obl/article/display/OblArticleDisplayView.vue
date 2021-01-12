<template>
    <div>
        <div >
            <a-page-header
                style="border: 1px solid rgb(235, 237, 240)"
                :backIcon="false"
                :ghost="false"
                :title="formData.title"
                :sub-title="formData.summary"
                @back="() => null"
            >
                <mavon-read-only-comp
                    :formData="formData"
                />
                <a-row slot="footer"
                       type="flex"
                       justify="end">
                    <a-col>
                        {{createTimeStr}}
                    </a-col>
                </a-row>
            </a-page-header>
        </div>
    </div>
</template>

<script>
    import BeeUtil from '~Assets/js/util/bee/BeeUtil.js'
    import MavonReadOnlyComp from '~Components/regular/common/mavon/MavonReadOnlyComp';
    import {OblArticleDisplayApi} from './oblArticleDisplayApi'
    export default {
        name: "OblArticleDisplayView",
        components: {MavonReadOnlyComp},
        comments:{
            MavonReadOnlyComp
        },
        data(){
            return {
                formData:{
                    fid:'',
                    title:'',
                    summary:'',
                    createTime:undefined,
                    originContent:''
                },
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
            },
            createTimeStr(){
                var createTime = (this.formData.createTime) ? BeeUtil.DateUtils.formatDateTimePatternShow(this.formData.createTime) : '' ;
                return createTime ;
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
