<template>
    <div class="login-page-root">
        <a-page-header
            style="border: 1px solid rgb(235, 237, 240)"
            :title="$t('langMap.button.member.registerAnAccount')"
            @back="goBack"
        >
            <template slot="extra">
                <i18n-change-comp />
                <a-button type="primary"
                    @click="goLogin">
                    {{$t('langMap.button.member.login')}}
                </a-button>
                <a-button @click="goForgetPwd">
                    {{$t('langMap.button.member.forgetPassword')}}
                </a-button>
            </template>
        </a-page-header>


        <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
            <a-form
                layout="vertical"
                @submit="handleSubmit" :form="form"
            >
                <a-form-item :label="$t('langMap.table.fields.em.user.userAccount')"
                             v-bind="FormBaseConfObj.formItemLayout"
                >
                    <a-input v-decorator="formFieldConf.account"/>
                </a-form-item>
                <a-form-item :label="$t('langMap.table.fields.em.user.userName')"
                             v-bind="FormBaseConfObj.formItemLayout"
                >
                    <a-input v-decorator="formFieldConf.userName"/>
                </a-form-item>
                <a-form-item :label="$t('langMap.table.fields.em.user.email')"
                             v-bind="FormBaseConfObj.formItemLayout"
                >
                    <a-input v-decorator="formFieldConf.email"/>
                </a-form-item>
                <a-form-item :label="$t('langMap.table.fields.em.user.avatarUrl')"
                             v-bind="FormBaseConfObj.formItemLayout"
                >
                    <head-img-upload
                        ref="headImgUploadRef"
                        :avatarUrl="formObj.avatarUrl"
                    >
                    </head-img-upload>
                </a-form-item>
                <a-form-item
                    :wrapperCol="{ span: 24 }"
                    style="text-align: center"
                >
                    <a-button htmlType="submit" type="primary">{{ $t('langMap.button.actions.confirm') }}</a-button>
                </a-form-item>
            </a-form>
        </a-card>
    </div>
</template>

<script>
    import {RegisterApi} from './RegisterApi.js'
    import {routerConst} from  '~Config/BaseDataConst.js'
    import {FormBaseConfObj} from "~Components/constant_define";
    import I18nChangeComp from "~Components/regular/i18n/I18nChangeComp";
    import {OblCommonMixin} from '~Layout/mixin/OblCommonMixin';
    import AFormItem from "ant-design-vue/es/form/FormItem";
    import HeadImgUpload from "~Components/regular/common/img/HeadImgUpload";

    export default {
        name: "RegisterPage",
        components: {
            I18nChangeComp,HeadImgUpload,AFormItem
        },
        mixins:[OblCommonMixin],
        props:{},
        data() {
            const paramsRules ={
                account:[
                    {required:true,message:this.$t('langMap.commons.forms.pleaseFillOut',[this.$t('langMap.table.fields.em.user.userAccount')])}
                ],
                userName:[
                    {required:true,message:this.$t('langMap.commons.forms.pleaseFillOut',[this.$t('langMap.table.fields.em.user.userName')])}
                ],
                email:[
                    {required:false,message:this.$t('langMap.commons.forms.pleaseFillOut',[this.$t('langMap.table.fields.em.user.email')])},
                    {type: 'email',message:this.$t('langMap.commons.forms.fillInValid',[this.$t('langMap.table.fields.em.user.email')])}
                ],
                avatarUrl:[],
            };
            return {
                FormBaseConfObj,
                form: this.$form.createForm(this),
                formFieldConf:{
                    account: ["account", {rules:paramsRules.account}],
                    userName: ["userName", {rules: paramsRules.userName}],
                    email: ["email", {rules: paramsRules.email}],
                    avatarUrl: ["avatarUrl", {rules: paramsRules.avatarUrl}],
                },
                formObj:{
                    userName: '',
                    account: '',
                    email: '',
                }
            }
        },
        methods:{
            goBack(){
                //跳转到-回退
                this.$router.push(routerConst.basic.login);
            },
            goLogin(){
                //跳转到-登录页面
                this.$router.push(routerConst.basic.login);
            },
            goForgetPwd(){
                //跳转到-修改密码
                this.$router.push(routerConst.basic.forgetPassword);
            },
            handleSubmit (e) {
                e.preventDefault();
                var _this = this ;
                this.form.validateFields((err, values) => {
                    if (!err) {
                        RegisterApi.registerUser(values).then((res) => {
                            if(res.success){
                                _this.$message.success(_this.$t('langMap.message.info.registerOkAndGo'),2)
                                    .then(() => _this.goLogin());
                            }
                        }) ;
                    }
                })
            },
        },
        created(){
            const _this = this ;
            _this.form = this.$form.createForm(_this,{
                name:'form',
                onFieldsChange: (_, changedFields) => {
                    //console.log(changedFields);
                    this.$emit('change', changedFields);
                },
                mapPropsToFields:() =>{
                    //console.log(_this.formObj);
                    return {
                        account: this.$form.createFormField({
                            ..._this.formObj,
                            value: _this.formObj.account
                        }),
                        userName: this.$form.createFormField({
                            ..._this.formObj,
                            value: _this.formObj.userName
                        }),
                        email: this.$form.createFormField({
                            ..._this.formObj,
                            value: _this.formObj.email
                        }),
                        avatarUrl: this.$form.createFormField({
                            ..._this.formObj,
                            value: _this.formObj.avatarUrl
                        }),
                    }
                }
            });
        },
    }
</script>
<style lang="less" scoped>

</style>
