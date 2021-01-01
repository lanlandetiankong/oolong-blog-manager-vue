<template>
    <div>
        <a-modal
            :visible="visible"
            :maskClosable=false
            :title="$t('langMap.button.actions.assigningRoles')"
            :okText="$t('langMap.button.actions.confirmSubmit')"
            :cancelText="$t('langMap.button.actions.cancel')"
            @cancel="() => { $emit('grantRoleFormCancel')}"
            @ok="handleDialogSubmit"
        >
            <a-transfer
                v-if="transferConf.initFlag"
                showSearch
                :dataSource="allItemArr"
                :titles="transferConf.titleArr"
                :locale="transferConf.locale"
                :operations="transferConf.operations"
                :targetKeys="transferConf.targetKeys"
                :selectedKeys="transferConf.selectedKeys"
                :render="item=>item.title"
                @change="handleTransferChange"
                @selectChange="handleTransfeSelectChange"
            >
                <span slot="notFoundContent">
                    {{$t('langMap.table.config.emptyData')}}
                </span>
            </a-transfer>
        </a-modal>
    </div>
</template>
<script>
    export default {
        name: "UserGrantRoleFormComp",
        components: {},
        props:{
            visible:Boolean,
            allItemArr:{
                type:Array,
                default:[]
            },
            checkArr:{
                type:Array,
                default:[]
            },
            userAccountId:String
        },
        data(){
            return {
                transferConf:{
                    initFlag:false,
                    titleArr:this.$t('langMap.commons.valueMap.transferConf.titleArr'),
                    locale:this.$t('langMap.commons.valueMap.transferConf.locale'),
                    targetKeys:[],
                    operations:this.$t('langMap.commons.valueMap.transferConf.operations'),
                    showSearch:true,
                    dataSourceArr:[],
                    selectedKeys:[]
                },
            }
        },
        methods:{
            handleTransferChange(targetKeys, direction, moveKeys){
                console.log(targetKeys, direction, moveKeys);
                this.transferConf.targetKeys = targetKeys;
            },
            handleTransfeSelectChange(sourceSelectedKeys, targetSelectedKeys){
                this.transferConf.selectedKeys = [...sourceSelectedKeys, ...targetSelectedKeys];
            },
            handleDialogSubmit(e){
                var transferTargetList = this.transferConf.targetKeys ;
                this.$emit('grantRoleFormSubmit',e,this.userAccountId,transferTargetList) ;
            }
        },
        computed:{

        },
        created(){
            console.log("created");
        },
        mounted(){
            console.log("mounted");
            console.log(this.checkArr);
            this.transferConf.targetKeys = this.checkArr ;
        },
        watch:{
            allItemArr:{
                handler(val,oval){
                    if(this.allItemArr && this.allItemArr.length> 0){
                        this.transferConf.initFlag = true ;
                    }
                },
                deep: true,
                immediate:true
            },
            visible:{
                handler(val,oval){  //隐藏与展示弹窗时监听
                    if(val){
                        this.transferConf.targetKeys = this.checkArr ;
                    }   else {
                        this.transferConf.targetKeys = [] ;
                    }
                    this.transferConf.selectedKeys = [] ;
                },
                deep: true,
                immediate:true
            }
        }
    }
</script>

<style scoped>

</style>
