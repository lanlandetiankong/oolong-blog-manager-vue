<template>
    <a-page-header style="border: 1px solid rgb(235, 237, 240)">
        <!-- 复合搜索-区域 -->
        <a-card :bordered="false">
            <div class="table-page-search-wrapper">
                <a-form ref="searchFormRef"
                        layout="inline"
                        :form="searchForm"
                        @submit="handleSearchFormSubmit"
                >
                    <a-row :gutter="48">
                        <template v-for="(item,idx) in theFormItemConf">
                            <a-col v-if="item.formType==formItemTypeEnum.Input"
                                   :md="8" :sm="24">
                                <a-form-item :label="item.label">
                                    <a-input allowClear
                                        v-decorator="item.decorator"/>
                                </a-form-item>
                            </a-col>
                            <a-col v-else-if="item.formType==formItemTypeEnum.InputNumber"
                                   :md="8" :sm="24"
                            >
                                <a-form-item :label="item.label">
                                    <a-input-number allowClear
                                                    :style="{width:'130px'}"
                                                    v-decorator="item.decorator"/>
                                </a-form-item>
                            </a-col>
                            <a-col v-else-if="item.formType==formItemTypeEnum.Select"
                                   :md="8" :sm="24">
                                <a-form-item :label="item.label">
                                    <a-select showSearch allowClear
                                              :placeholder="(typeof item.placeholder == 'undefined' || item.placeholder == null) ? $t('langMap.commons.forms.pleaseChoose') : item.placeholder "
                                              style="width: 180px"
                                              optionFilterProp="children"
                                              :disabled="item.disabled"
                                              :options="item.options"
                                              :filterOption="mixin_getFilterOption"
                                              v-decorator="item.decorator"
                                    >
                                    </a-select>
                                </a-form-item>
                            </a-col>
                            <a-col v-else-if="item.formType==formItemTypeEnum.TreeSelect"
                                   :md="8" :sm="24">
                                <a-form-item :label="item.label">
                                    <a-tree-select
                                        style="width: 150px"
                                        :placeholder="(typeof item.placeholder == 'undefined' || item.placeholder == null) ? $t('langMap.commons.forms.pleaseChoose') : item.placeholder"
                                        showSearch allowClear
                                        :treeNodeFilterProp="item.treeNodeFilterProp"
                                        :treeDefaultExpandAll="item.treeDefaultExpandAll"
                                        v-decorator="item.decorator"
                                        :treeData="item.treeData"
                                    >
                                    </a-tree-select>
                                </a-form-item>
                            </a-col>
                        </template>
                        <a-col :span="6" :style="{ }">
                            <a-button type="primary" html-type="submit" icon="search"
                                      :loading="loadingFlag"
                            >
                                {{$t('langMap.button.actions.query')}}
                            </a-button>
                            <a-button :style="{  }" icon="close-square"
                                      @click="handleSearchFormReset">
                                {{$t('langMap.button.actions.reset')}}
                            </a-button>

                            <a-button type="link" v-show="searchConf.showAll"
                                      @click="triggerUnfold">
                                {{$t('langMap.button.actions.packUp')}} <a-icon type="up"/>
                            </a-button>
                            <a-button type="link" v-show="!searchConf.showAll"
                                      @click="triggerUnfold">
                                {{$t('langMap.button.actions.unfold')}} <a-icon type="down"/>
                            </a-button>
                        </a-col>
                    </a-row>
                </a-form>
            </div>
            <a-divider/>
        </a-card>
    </a-page-header>
</template>

<script>
    import BeeUtil from '~Assets/js/util/bee/BeeUtil.js' ;
    import {OblCommonMixin} from '~Layout/mixin/OblCommonMixin';
    import {FormItemTypeEnum,ConstantObj} from '~Components/constant_define';
    export default {
        name: "QueryFormComp",
        mixins:[OblCommonMixin],
        props:{
            formItemConf:{
                type:Object,
                default:{}
            },
            loadingFlag:{
                type:Boolean,
                default:false
            }
        },
        data(){
            return {
                formItemTypeEnum:FormItemTypeEnum,
                searchForm:this.$form.createForm(this,{name:'search_form'}),
                searchConf:{
                    defaultColSpan: 8,
                    binding:{
                        announcementTagList:[]
                    },
                    showAll:false
                },
            }
        },
        computed:{
            theFormItemConf(){
                if(!this.formItemConf){
                    return {} ;
                }
                //object的自定义属性的数量小于2,则返回当前所有
                if(Object.getOwnPropertyNames(this.formItemConf).length <= 2){
                    return this.formItemConf ;
                }
                //超过2个，flag允许展示所有
                if(this.searchConf.showAll == true){
                    return this.formItemConf ;
                }   else {
                    //超过两个，flag不允许展示所有，取前两个。
                    return BeeUtil.ObjectUtils.getTopNItem(this.formItemConf,2) ;
                }
            }
        },
        methods:{
            triggerUnfold(){
                this.searchConf.showAll = !this.searchConf.showAll ;
            },
            triggerQuery(){ //触发 查询表单的提交，配合mixin使用，请勿随意改方法名
                this.$refs.searchFormRef.$emit('submit');
            },
            handleSearchFormReset() {    //重置 搜索列表 的值
                this.searchForm.resetFields();
            },
            handleSearchFormSubmit(e) {
                var _this = this ;
                if (e) {
                    e.preventDefault();
                }
                this.searchForm.validateFields((err, values) => {
                    if (!err) {
                        _this.$emit('execQuery',e,values) ;
                    }
                });
            }
        }
    }
</script>

<style scoped>

</style>
