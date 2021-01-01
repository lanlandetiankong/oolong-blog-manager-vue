<template>
    <div>
        <a-list itemLayout="horizontal" :dataSource="dataObjArr">
            <a-list-item slot="renderItem" slot-scope="item, index">
                <a-list-item-meta
                    :key="item.fieldName"
                >
                    <a-tag :color="item.success ? 'blue' : '#f50'"
                           slot="title">
                        {{item.fieldLabel}}
                    </a-tag>
                    <span slot="description">
                        <template v-if="!item.success">    <!-- 异常处理 -->
                            <a-tag color="#f50">
                                Error: {{item.msg}}
                            </a-tag>
                        </template>
                        <template v-else>
                            <template v-if="item.fieldType == 'icon'">      <!-- 图标展示 -->
                                <a-icon :type="item.fieldVal"/>
                            </template>
                            <template v-else-if="item.fieldType == 'htmlDom'">  <!--htmlDom 内容-->
                                <div v-html="item.fieldVal">
                                </div>
                            </template>
                            <template v-else>
                                {{item.fieldVal}}
                            </template>
                        </template>
                    </span>
                </a-list-item-meta>
            </a-list-item>
        </a-list>
    </div>
</template>
<script>
    import {DrawerFieldTypeEnum,CommonDateFormatTypeEnum} from '~Components/regular/common/drawer/drawer_define.js'

    import BeeUtil from '~Assets/js/util/bee/BeeUtil.js'
    export default {
        name: "SimpleDetailDrawerComp",
        props: {
            dataObj: Object,
            visible:Boolean,
            drawerFieldConf:Object
        },
        data() {
            return {
                msgConf:{
                    undefinedEnum:this.$t('langMap.drawer.common.undefinedEnumKeyValue')
                },
            };
        },
        methods: {
            dealEmptyToDefaultVal(checkVal,ifEmptyVal){
                if(typeof checkVal == "undefined" || checkVal == null || (typeof checkVal == "string" && checkVal =="")){
                    return ifEmptyVal;
                }   else {
                    return checkVal ;
                }
            },
            dealGetFieldConfValue(obj,fieldConfObj){    //根据配置取得字段的值
                var _this = this ;
                var fieldVal = obj[fieldConfObj.fieldName];
                //是否需要拆分fieldKey字段数组并遍历取值,如未设置则为否
                var isNeedSplitTemp = _this.dealEmptyToDefaultVal(fieldConfObj.isNeedSplit,false);
                if(isNeedSplitTemp === true){
                    var fieldKeySplitArrTemp = _this.dealEmptyToDefaultVal(fieldConfObj.fieldKeySplitArr,[fieldConfObj.fieldName]);
                    if(fieldKeySplitArrTemp.length > 1){
                        var fieldValObj = obj[fieldKeySplitArrTemp[0]] ;
                        fieldVal = _this.dealRecurveGetRealValue(fieldKeySplitArrTemp,fieldValObj,0);
                    }
                }
                return fieldVal ;
            },
            dealRecurveGetRealValue(fieldKeySplitArrTemp,fieldValObj,idx){  //递归取得真实的取值
                //console.log(fieldValObj);
                if(typeof fieldValObj == "undefined" || fieldValObj == null){
                    return fieldValObj ;
                }   else if(fieldKeySplitArrTemp.length == idx +1){
                    return fieldValObj ;
                }   else {
                    return this.dealRecurveGetRealValue(fieldKeySplitArrTemp,fieldValObj[fieldKeySplitArrTemp[idx+1]],idx+1);
                }
            },
            dealGetFieldObjFromConf(fieldConfObj,fieldVal){  //尝试从配置中取得 fieldVal的 其他处理方式后
                var _this = this;
                fieldConfObj.drawerAble =_this.dealEmptyToDefaultVal(fieldConfObj.drawerAble,true);
                if(fieldConfObj.drawerAble != true){
                    return null ;
                }
                fieldConfObj.fieldLabel = (fieldConfObj.fieldLabel) ? fieldConfObj.fieldLabel : '';
                fieldConfObj.type = (fieldConfObj.type) ? fieldConfObj.type : DrawerFieldTypeEnum.String;
                var fieldResObj = {     //默认的返回对象
                    fieldName:fieldConfObj.fieldName,
                    fieldKeySplitArr:fieldConfObj.fieldKeySplitArr,
                    fieldLabel:fieldConfObj.fieldLabel,
                    fieldVal:fieldVal,
                    fieldType:fieldConfObj.type,
                    success:true,
                    errorMsg:""
                };
                // ==> 字段值的temp及格式化处理
                var fieldValTemp = typeof fieldVal == "undefined" ? "" : fieldVal ;
                var fieldType = fieldConfObj.type;
                if(typeof fieldType != "undefined" && fieldType != null){
                    if(DrawerFieldTypeEnum.Enum == fieldType){    //枚举类型
                        var enumValMap = fieldConfObj.enumValMap ;
                        if(typeof enumValMap != "undefined" && enumValMap != null){
                            fieldValTemp = enumValMap[fieldVal] ;
                            if(typeof fieldValTemp == "undefined"){
                                fieldResObj.success = false ;
                                fieldResObj.msg = _this.msgConf.undefinedEnum ;
                            }
                        }
                    }   else if(DrawerFieldTypeEnum.Date == fieldType){ //日期类型
                        var fieldFormatConf = fieldConfObj.format ;
                        if(typeof fieldFormatConf != "undefined" && fieldFormatConf != null){
                            var dateFormatFlag = false ;  //是否可被格式化为日期
                            if(typeof fieldVal == "number"){
                                dateFormatFlag = true;
                            }
                            if(dateFormatFlag === true){
                                var fieldDateFormat = fieldFormatConf.date ;
                                fieldDateFormat = typeof fieldDateFormat != "undefined" ? fieldDateFormat : CommonDateFormatTypeEnum.yMdhms_cn ;
                                fieldValTemp = BeeUtil.DateUtils.format(fieldVal,fieldDateFormat);
                            }
                        }
                    }
                }
                fieldResObj.fieldVal = fieldValTemp ;
                return fieldResObj ;
            },
            dealDataObjToArr(obj) {  //将object转化为展示的数组
                var dataObjArr = [];
                if (typeof this.drawerFieldConf != "undefined" && this.drawerFieldConf != null) {
                    var fieldConfKeys = Object.keys(this.drawerFieldConf);
                    for (var idx in fieldConfKeys) {
                        var fieldConfKey = fieldConfKeys[idx] ;
                        if (obj.hasOwnProperty(fieldConfKey)) {
                            var fieldConfObj = this.drawerFieldConf[fieldConfKey];
                            var visibleVal = this.dealEmptyToDefaultVal(fieldConfObj.visible, true);
                            if (visibleVal === true) {
                                var fieldVal = this.dealGetFieldConfValue(obj, fieldConfObj);
                                var fieldResObj = this.dealGetFieldObjFromConf(fieldConfObj, fieldVal);
                                if(fieldResObj){
                                    dataObjArr.push(fieldResObj);
                                }
                            }
                        }
                    }
                }
                return dataObjArr;
            }
        },
        computed:{
            dataObjArr(){
                var dataObjTemp = this.dataObj ;
                var dataObjArr = [] ;
                if(dataObjTemp){
                    dataObjArr = this.dealDataObjToArr(dataObjTemp);
                }
                return dataObjArr;
            }
        }
    }
</script>
<style>

</style>
