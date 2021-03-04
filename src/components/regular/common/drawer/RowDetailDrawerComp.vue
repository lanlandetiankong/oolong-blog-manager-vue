<template>
    <div>
        <a-drawer
           v-bind="drawerConfObj"
            @close="handleDetailDrawerClose"
        >
            <simple-detail-drawer-comp
                :dataObj="dataObj"
                :visible="visible"
                :drawerFieldConf="drawerFieldConfObj"
            />
        </a-drawer>
    </div>
</template>
<script>
    import {ObjectUtils,DataUtils} from "~Utils/basic/BeeUtil";
    import SimpleDetailDrawerComp from '~Components/regular/common/drawer/SimpleDetailDrawerComp';
    import {DrawerFieldTypeEnum,CommonDateFormatTypeEnum} from "./drawer_define";
    export default {
        name: "RowDetailDrawerComp",
        components:{SimpleDetailDrawerComp},
        props:{
            drawerConf:{
                type:Object,
                default:{}
            },
            dataObj:{
                type:Object
            },
            visible:{
                type:Boolean
            },
            drawerFieldConf:{
                type:Object
            },
            autoAddFixedField:{ //是否自动追加固定字段
                type:Boolean,
                default:true
            }
        },
        data(){
            return {
                fixedFieldConf:{
                    remark:{
                        fieldLabel:this.$t('langMap.table.fields.common.remark'),
                        fieldName:'remark'
                    },
                    createUserName:{
                        fieldLabel:this.$t('langMap.table.fields.common.createUserName'),
                        fieldName:'createUserName'
                    },
                    updateUserName:{
                        fieldLabel:this.$t('langMap.table.fields.common.updateUserName'),
                        fieldName:'updateUserName'
                    },
                    createTime:{
                        fieldLabel:this.$t('langMap.table.fields.common.createTime'),
                        fieldName:'createTime',
                        type:DrawerFieldTypeEnum.Date,
                        format:{
                            date:CommonDateFormatTypeEnum.yMdhms_cn
                        }
                    },
                    updateTime:{
                        fieldLabel:this.$t('langMap.table.fields.common.updateTime'),
                        fieldName:'updateTime',
                        type:DrawerFieldTypeEnum.Date,
                        format:{
                            date:CommonDateFormatTypeEnum.yMdhms_cn
                        }
                    },
                }
            };
        },
        computed:{
            drawerConfObj(){
                //prop.drawerConf 默认初始化
                var _this = this ;
                const obj = {};
                obj['title'] = DataUtils.defaultIfNull(_this.drawerConf['title'],this.$t('langMap.drawer.actions.detail'));
                obj['closable'] = DataUtils.defaultIfNull(_this.drawerConf['closable'],true);
                obj['visible'] = _this.$props.visible ;
                obj['placement'] = DataUtils.defaultIfNull(_this.drawerConf['placement'],"right");
                obj['mask'] = DataUtils.defaultIfNull(_this.drawerConf['mask'],true);
                obj['maskStyle'] = DataUtils.defaultIfNull(_this.drawerConf['maskStyle'],{
                    overFlowY:"auto"
                });
                obj['wrapStyle'] = DataUtils.defaultIfNull(_this.drawerConf['wrapStyle'],{
                    overFlowY:"auto"
                });
                obj['drawerStyle'] = DataUtils.defaultIfNull(_this.drawerConf['drawerStyle'],{
                    overFlowY:"auto"
                });
                obj['maskClosable'] = DataUtils.defaultIfNull(_this.drawerConf['maskClosable'],true);
               return obj ;
            },
            drawerFieldConfObj(){
                var _this = this ;
                if(_this.$props.autoAddFixedField == false){
                    return _this.$props.drawerFieldConf ;
                }
                var obj = ObjectUtils.deepClone(_this.$props.drawerFieldConf) ;
                if(obj.hasOwnProperty('remark') === false){
                    obj['remark'] = _this.fixedFieldConf['remark'] ;
                }
                if(obj.hasOwnProperty('createUserName') === false){
                    obj['createUserName'] = _this.fixedFieldConf['createUserName'] ;
                }
                if(obj.hasOwnProperty('updateUserName') === false){
                    obj['updateUserName'] = _this.fixedFieldConf['updateUserName'] ;
                }
                if(obj.hasOwnProperty('createTime') === false){
                    obj['createTime'] = _this.fixedFieldConf['createTime'] ;
                }
                if(obj.hasOwnProperty('updateTime') === false){
                    obj['updateTime'] = _this.fixedFieldConf['updateTime'] ;
                }
                return obj ;
            }
        },
        methods:{
            handleDetailDrawerClose(e) { //Drawer-公告 详情关闭
                this.$emit('execClose',e);
            }
        }
    }
</script>

<style scoped>

</style>
