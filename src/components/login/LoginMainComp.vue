<template>
    <div class="login-main-comp-root">
        <div class="login-box">
            <a-form
                :form="loginForm"
                @submit="handleLoginSubmit"
            >
                <a-form-item
                    :label-col="loginFormConf.labelCol"
                    :wrapper-col="loginFormConf.wrapperCol"
                    v-model="loginForm.userAccount"
                >
                    <template slot="label">
                        <span class="formBaseCls">{{$t('langMap.button.member.account')}}</span>
                    </template>
                    <a-input
                        :placeholder="$t('langMap.button.placeholder.pleaseEnterUserAccount')"
                        v-model="loginForm.userAccount"
                    >
                        <a-icon
                            slot="prefix"
                            type="user"
                            style="color: rgba(0,0,0,.25)"
                        />
                    </a-input>
                </a-form-item>
                <a-form-item
                    :label-col="loginFormConf.labelCol"
                    :wrapper-col="loginFormConf.wrapperCol"
                    v-model="loginForm.password"
                >
                    <template slot="label">
                        <span class="formBaseCls">{{$t('langMap.button.member.password')}}</span>
                    </template>
                    <a-input
                        type="password"
                        :placeholder="$t('langMap.button.placeholder.pleaseEnterUserPwd')"
                        v-model="loginForm.password"
                    >
                        <a-icon
                            slot="prefix"
                            type="lock"
                            style="color: rgba(0,0,0,.25)"
                        />
                    </a-input>
                </a-form-item>
                <a-form-item
                    :colon=false
                    :label-col="loginFormConf.labelCol"
                    :wrapper-col="loginFormConf.wrapperCol"
                >
                    <template slot="label">
                        <span class="formBaseCls">{{$t('langMap.button.member.verificationCode')}}</span>
                    </template>
                    <Verify
                        ref="loginVerifyRef"
                        :type="verifyConf.picture.type"
                        :width="verifyConf.picture.width"
                        :height="verifyConf.picture.height"
                        :fontSize="verifyConf.picture.fontSize"
                        :codeLength="verifyConf.picture.codeLength"
                        :showButton="verifyConf.picture.showButton"
                        @success="handleVerifySuccess"
                        @error="handleVerifyError"
                    />
                </a-form-item>
                <a-form-item
                    label=" "
                    :colon=false
                    :label-col="loginFormConf.labelCol"
                    :wrapper-col="loginFormConf.wrapperCol"
                >
                    <a-row>
                        <a-col :span=5>
                            <i18n-change-comp />
                        </a-col>
                        <a-col :span=7>
                            <a-switch
                                :checkedChildren="$t('langMap.button.member.rememberMe')"
                                unCheckedChildren=""
                            >
                            </a-switch>
                        </a-col>
                        <a-col :span=12>
                            <a-button block
                                      icon="login"
                                      type="primary"
                                      html-type="submit"
                                      :loading="loadingFlag"
                                      :disabled="hasLoginFormError()"
                            >
                                {{$t('langMap.button.member.login')}}
                            </a-button>
                        </a-col>
                    </a-row>
                </a-form-item>
            </a-form>
        </div>
    </div>
</template>

<script>
    import {RouteConst} from '~Router/routeSecurityUtil';
    import {OblCommonMixin} from '~Layout/mixin/OblCommonMixin';
    import {LoginMainCompApi} from './_LoginMainCompApi'
    import AFormItem from "ant-design-vue/es/form/FormItem";
    import ARow from "ant-design-vue/es/grid/Row";
    import ACol from "ant-design-vue/es/grid/Col";


    import Verify from 'vue2-verify'
    import I18nChangeComp from "~Components/regular/i18n/I18nChangeComp";

    export default {
        name: "LoginMainComp",
        components: {I18nChangeComp, ACol, ARow, AFormItem,Verify},
        mixins:[OblCommonMixin],
        data() {
            return {
                RouteConst,
                loadingFlag:false,
                loginForm: {
                    userAccount: 'SuperRoot',
                    password: '123456'
                },
                loginFormConf: {
                    labelCol: {span: 4},
                    wrapperCol: {span: 20}
                },
                verifyConf:{
                    picture:{
                        type:"picture",
                        width:"100%",
                        height:"100%",
                        fontSize:"30px",
                        codeLength:4,
                        showButton:false    //是否展示按钮
                    },
                    more:{
                        success:false
                    }
                },
            }
        },
        methods: {
            changeLoading(loadingFlag){   //修改[axios]是否在 加载状态中
                this.loadingFlag = this.mixin_defaultIfNull(loadingFlag,false);
            },
            dealTriggerVerify(){    //触发 Verify 的验证事件
                this.$refs.loginVerifyRef.$refs.instance.checkCode() ;
            },
            dealVerifySubmit(){ //触发Verify提交事件并验证
                var _this = this ;
                _this.dealTriggerVerify();
                if(_this.verifyConf.more.success == false){
                    _this.$message.error(this.$t('langMap.message.error.wrongVerificationCode'));
                }
                return _this.verifyConf.more.success ;
            },
            handleLoginSubmit(e) {
                var _this = this ;
                e.preventDefault(); //拦截form提交的默认事件
                var verifyFlag = this.dealVerifySubmit() ;
                if(verifyFlag == true){
                    _this.changeLoading(true);
                    LoginMainCompApi.submitLoginFormByAccount(this.loginForm).then((res) => {
                        if(res.success){
                            this.$emit('login-form-submit',e,this.loginForm,res);
                        }
                        _this.changeLoading(false);
                    }).catch((e) =>{
                        _this.changeLoading(false);
                    });
                }
            },
            hasLoginFormError() {
                //判断loginForm是否有错误
                return false;
            },
            handleVerifySuccess(e){
                this.verifyConf.more.success = true;
            },
            handleVerifyError(e){
                this.verifyConf.more.success = false;
            },
        }
    }
</script>

<style lang="less" scoped>
   @import "_LoginMainComp.less";


</style>
