<template>
    <div>
        <a-modal
            :visible="visible"
            :maskClosable=false
            :title="$t('langMap.button.actions.authorizationMenu')"
            :okText="$t('langMap.button.actions.confirmSubmit')"
            :cancelText="$t('langMap.button.actions.cancel')"
            @cancel="() => { $emit('grantMenusFormCancel')}"
            @ok="handleDialogSubmit"
        >
            <a-tree
                checkable
                :expandedKeys="treeConf.expandedKeys"
                :autoExpandParent="treeConf.autoExpandParent"
                v-model="treeConf.treeCheckdKeys"
                :selectable="treeConf.selectable"
                :treeData="treeData"
                @check="onCheck"
            />
        </a-modal>
    </div>
</template>
<script>
    import jquery from 'jquery' ;
    export default {
        name: "RoleGrantMenusFormComp",
        props:{
            visible:Boolean,
            roleId:String,
            treeData:Array,
            checkArr:Array
        },
        data() {
            return {
                treeConf:{
                    selectable:false,
                    expandedKeys: [],
                    treeCheckdKeys:[],
                    halfCheckedKeys:[],
                    autoExpandParent: true,
                    defaultExpandAll:true,
                    defaultExpandParent:true,
                },

            };
        },
        watch: {
            visible:{
                handler(val,oval){  //隐藏与展示弹窗时监听
                    if(val){
                        console.log("授权页面展示...") ;
                        this.treeConf.treeCheckdKeys = this.checkArr ;
                        this.handleInitDefaultExpandedKeys() ;
                    }
                },
                deep: true,
                immediate:true
            }
        },
        methods: {
            onCheck(treeCheckdKeys,e) {
                this.treeConf.treeCheckdKeys = treeCheckdKeys;
                this.treeConf.halfCheckedKeys = e.halfCheckedKeys;
                //console.log(this.treeConf.treeCheckdKeys,this.treeConf.halfCheckedKeys);
            },
            handleDialogSubmit(e){  //提交
                var treeCheckdKeysTemp = this.treeConf.treeCheckdKeys ;     //已勾选/子节点也都勾选 的节点
                var halfCheckedKeysTemp = this.treeConf.halfCheckedKeys ;   //半勾选的 父节点
                this.$emit('grantMenusFormSubmit',e,this.roleId,treeCheckdKeysTemp,halfCheckedKeysTemp) ;
            },
            handleInitDefaultExpandedKeys(){    //展开所有节点
                var _this = this ;
                var defaultExpandedKeyArr = [];
                if(_this.treeData && _this.treeData.length > 0){
                    jquery.each(_this.treeData,function (idx,val) {
                        _this.dealRecursionGetExpandedKeys(val,defaultExpandedKeyArr);
                    })
                }
                _this.treeConf.expandedKeys = defaultExpandedKeyArr ;
            },
            dealRecursionGetExpandedKeys(val,expandedKeyArr){
                var _this = this ;
                if(val && val.children){
                    expandedKeyArr.push(val.key);
                    jquery.each(val.children,function (idx,val) {
                        _this.dealRecursionGetExpandedKeys(val,expandedKeyArr);
                    })
                }
            }
        },
        mounted(){

        }
    }
</script>

<style scoped>

</style>
