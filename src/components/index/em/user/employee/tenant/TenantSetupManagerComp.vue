<template>
    <div>
        <a-modal
            :visible="visible"
            :maskClosable=false
            :title="$t('langMap.button.actions.setAdminManager')"
            :okText="$t('langMap.button.actions.confirmSubmit')"
            :width="1000"
            :centered="true"
            :cancelText="$t('langMap.button.actions.cancel')"
            @cancel="() => { $emit('setupManagerCancel')}"
            @ok="handleSubmit"
        >
            <user-table-select-comp
                :maxSize="userTableSelect.conf.maxSize"
                :minSize="userTableSelect.conf.minSize"
                :checkIdList="userTableSelect.conf.checkIdList"
                :searchFlagConf="userTableSelect.conf.searchFlagConf"
            />
        </a-modal>
    </div>
</template>
<script>
    import AFormItem from "ant-design-vue/es/form/FormItem";
    import ATextarea from "ant-design-vue/es/input/TextArea";
    import UserTableSelectComp from "~Components/regular/common/user/tableSelect/UserTableSelectComp.vue";
    export default {
        name: "TenantSetupManagerComp",
        components: {ATextarea, AFormItem,UserTableSelectComp},
        props:{
            visible:Boolean,
            tenantId:{
                type:String,
                required:true
            }
        },
        data(){
            var _this = this ;
            return {
                userTableSelect:{
                    conf:{
                        maxSize:1,
                        minSize:1,
                        checkIdList: [],
                        searchFlagConf:{
                            belongTenantId:{
                                show:true,
                                search:false,
                                modifyVal:false,
                                defaultVal:_this.$props.tenantId
                            },
                            belongDepartmentId: {
                                show:true,
                                search:true,
                                modifyVal:true,
                                defaultVal:''
                            },
                            account: {
                                show:true,
                                search:true,
                                modifyVal:true,
                                defaultVal:''
                            },
                            userName: {
                                show:true,
                                search:true,
                                modifyVal:true,
                                defaultVal:''
                            },
                            email: {
                                show:true,
                                search:true,
                                modifyVal:true,
                                defaultVal:''
                            },
                            userType: {
                                show:true,
                                search:true,
                                modifyVal:true,
                                defaultVal:''
                            },
                            locked: {
                                show:true,
                                search:true,
                                modifyVal:true,
                                defaultVal:''
                            }
                        }
                    },

                }
            }
        },
        methods:{
            handleSubmit(e){
                //传递数据到父组件处理
                this.$emit('setupManagerSubmit');
            }
        },
        computed:{

        },
        watch:{
            visible:{
                handler(val,oval){  //隐藏与展示弹窗时监听
                    if(val == true){
                        console.log("here");
                    }
                },
                deep: true,
                immediate:true
            }
        }
    }
</script>

<style scoped>

</style>
