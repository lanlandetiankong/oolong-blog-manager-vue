<template>
    <div>
        <!-- 复合搜索-区域 -->
        <div v-show="showAble">
            <div>
                <a-form ref="searchFormRef"
                        layout="inline"
                        :form="searchForm"
                        @submit="handleSearchFormSubmit"
                >
                    <a-row :gutter="6">
                        <template v-for="(item,idx) in formItemConf">
                            <a-col v-if="item.formType==formItemTypeEnum.Input"
                                :span="searchConf.defaultColSpan">
                                <a-form-item :label="item.label">
                                    <a-input allowClear
                                        v-decorator="item.decorator"/>
                                </a-form-item>
                            </a-col>
                            <a-col v-else-if="item.formType==formItemTypeEnum.InputNumber"
                                   :span="searchConf.defaultColSpan">
                                <a-form-item :label="item.label">
                                    <a-input-number allowClear
                                                    :style="{width:'130px'}"
                                                    v-decorator="item.decorator"/>
                                </a-form-item>
                            </a-col>
                            <a-col v-else-if="item.formType==formItemTypeEnum.Select"
                                   :span="searchConf.defaultColSpan">
                                <a-form-item :label="item.label">
                                    <a-select showSearch allowClear
                                              :placeholder="(typeof item.placeholder == 'undefined' || item.placeholder == null) ? $t('langMap.commons.forms.pleaseChoose') : item.placeholder "
                                              style="width: 180px"
                                              optionFilterProp="children"
                                              :disabled="item.disabled"
                                              :options="item.options"
                                              :filterOption="getFilterOption"
                                              v-decorator="item.decorator"
                                    >
                                    </a-select>
                                </a-form-item>
                            </a-col>
                            <a-col v-else-if="item.formType==formItemTypeEnum.TreeSelect"
                                   :span="searchConf.defaultColSpan">
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
                    </a-row>
                    <a-row>
                        <a-col :span="24" :style="{ textAlign: 'right' }">
                            <a-button type="primary" html-type="submit" icon="search"
                                      :loading="loadingFlag"
                            >
                                {{$t('langMap.button.actions.query')}}
                            </a-button>
                            <a-button :style="{ marginLeft: '8px' }" icon="close-square"
                                      @click="handleSearchFormReset">
                                {{$t('langMap.button.actions.reset')}}
                            </a-button>
                        </a-col>
                    </a-row>
                </a-form>
            </div>
            <a-divider/>
        </div>
    </div>
</template>

<script>
    import {FormItemTypeEnum,ConstantObj} from '~Components/constant_define';
    export default {
        name: "QueryFormComp",
        props:{
            formItemConf:{
                type:Object,
                default:{}
            },
            loadingFlag:{
                type:Boolean,
                default:false
            },
            showAble:{
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
                    }
                },
            }
        },
        methods:{
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
            },
            getFilterOption(input,option){
                return (option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0);
            },
        }
    }
</script>

<style scoped>

</style>
