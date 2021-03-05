<template>
    <div>
        <a-page-header
            style="border: 1px solid rgb(235, 237, 240)"
            :title="$t('langMap.button.member.forgetPassword')"
            @back="goBack"
        >
            <template slot="extra">
                <i18n-change-comp />
                <a-button type="primary"
                          @click="goLogin">
                    {{$t('langMap.button.member.login')}}
                </a-button>
                <a-button  @click="goRegister()">
                    {{$t('langMap.button.member.registerAnAccount')}}
                </a-button>
            </template>
        </a-page-header>

        <a-card v-show="rstConf.current == rstConf.status.theDefault"
            :body-style="{padding: '24px 32px'}" :bordered="false">
            <a-row type="flex" v-show="rstConf.current == rstConf.status.theDefault">
                <a-col span="auto">
                    <a-button-group>
                        <a-button v-if="stepConf.current > 0"
                                  @click="goPreviousStep"
                        > {{$t('langMap.button.actions.goPreviousStep')}}
                            <a-icon type="left"/>
                        </a-button>
                        <a-button type="primary"
                                  v-if="stepConf.current < Object.keys(stepConf.steps).length - 1"
                                  @click="goNextStep"
                        >
                            <a-icon type="right"/>
                            {{$t('langMap.button.actions.goNextStep')}}
                        </a-button>
                    </a-button-group>
                </a-col>
            </a-row>
            <!-- 步骤 -->
            <a-steps v-show="rstConf.current == rstConf.status.theDefault"
                     :current="stepConf.current" type="navigation" size="small" :style="stepConf.stepStyle">
                <a-step v-for="(item,index) in stepConf.steps" :key="index" v-bind="item"/>
            </a-steps>
            <a-form @submit="handleSubmit" :form="form">
                <a-form-item
                    v-show="showVerifyOldPwd"
                    :label="$t('langMap.table.fields.em.user.userAccount')"
                    v-bind="formConf.style">
                    <a-input v-decorator="formFieldConf.account"/>
                </a-form-item>
                <a-form-item
                    v-show="showVerifyOldPwd"
                    :label="$t('langMap.table.fields.em.user.oldPwd')"
                    v-bind="formConf.style">
                    <a-input-password v-decorator="formFieldConf.oldPwd"  />
                </a-form-item>
                <a-form-item
                    v-show="requiredNewPwd"
                    :label="$t('langMap.table.fields.em.user.newPwd')"
                    v-bind="formConf.style">
                    <a-input-password v-decorator="[
                          'newPwd',
                          { rules: [{ required: requiredNewPwd, message: $t('langMap.commons.forms.pleaseFillOut',[$t('langMap.table.fields.em.user.newPwd')]) }] },
                        ]" />
                </a-form-item>
                <a-form-item
                    v-show="!showVerifyOldPwd"
                    :wrapperCol="{ span: 24 }"
                    style="text-align: center"
                >
                    <a-button htmlType="submit" type="primary">{{ $t('langMap.button.actions.confirm') }}</a-button>
                </a-form-item>
            </a-form>
        </a-card>
        <!-- Result Dom Write Here -->
        <div class="result">
            <!-- Dom-操作成功 -->
            <div v-show="rstConf.current == rstConf.status.success">
                <a-result
                    status="success"
                    :title="$t('langMap.results.universal.success.title')"
                >
                    <template #extra>

                    </template>
                </a-result>
            </div>
        </div>
    </div>
</template>

<script>
    import {ForgetPwdApi} from './ForgetPwdApi'
    import {routerConst} from  '~Config/BaseDataConst.js'
    import I18nChangeComp from "~Components/regular/i18n/I18nChangeComp";

    export default {
        name: "ForgetPwdPage",
        comments:{
            I18nChangeComp,
        },
        data(){
            var paramsRules ={
                account:[
                    {required:true,message:this.$t('langMap.commons.forms.pleaseFillOut',[this.$t('langMap.table.fields.em.user.userAccount')])}
                ],
                oldPwd:[
                    {required:true,message:this.$t('langMap.commons.forms.pleaseFillOut',[this.$t('langMap.table.fields.em.user.oldPwd')])}
                ],
                newPwd:[
                    {required:this.requiredNewPwd,message:this.$t('langMap.commons.forms.pleaseFillOut',[this.$t('langMap.table.fields.em.user.newPwd')])}
                ],
            };
            //A-Result(
            const rstStatus = {
                theDefault: 'theDefault',
                success: 'success'
            };
            const stepConstMap = new Map();
            stepConstMap.set("verifyOldPwd", this.$t('langMap.steps.forgetPwd.verifyOldPwd'));
            stepConstMap.set("setNewPwd", this.$t('langMap.steps.forgetPwd.setNewPwd'));
            let stepConst = Object.fromEntries(stepConstMap);
            return {
                form: this.$form.createForm(this),
                formFieldConf:{
                    account: ["account", {rules:paramsRules.account}],
                    oldPwd: ["oldPwd", {rules:paramsRules.oldPwd}],
                    newPwd: ["newPwd", {rules:paramsRules.newPwd}],
                },
                formConf:{
                    style:{
                        labelCol:{lg: {span: 7}, sm: {span: 7}},
                        wrapperCol:{lg: {span: 10}, sm: {span: 17} }
                    }
                },
                rstConf: {
                    current: rstStatus.theDefault,
                    status: rstStatus,
                    bean: {}
                },
                stepConf: {
                    current: 0,
                    steps: stepConst,
                    stepsMap: stepConstMap,
                    stepStyle: {
                        marginBottom: '20px',
                        boxShadow: '0px -1px 0 0 #e8e8e8 inset',
                    }
                },

            }
        },
        computed: {
            currentStepKey() {
                const arr = this.currentStepArr;
                return arr[this.stepConf.current];
            },
            currentStepArr() {
                if (!this.stepConf.stepsMap) {
                    return [];
                }
                return Array.from(this.stepConf.stepsMap.keys());
            },
            showVerifyOldPwd(){
                return this.currentStepKey == this.stepConf.steps.verifyOldPwd.key ;
            },
            requiredNewPwd(){
                return this.currentStepKey != this.stepConf.steps.verifyOldPwd.key ;
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
            goRegister(){
                //跳转到-注册页面
                this.$router.push(routerConst.basic.register);
            },
            handleSubmit (e) {
                e.preventDefault();
                this.form.validateFields((err, values) => {
                    if (!err) {
                        ForgetPwdApi.renewPassword(values).then((res) => {
                            if(res.success === true){
                                this.rstConf.current = this.rstConf.status.success ;
                            }
                        });
                    }
                })
            },
            handleNewPwdAddVerify(){
                //【字段-新密码】 添加验证
                this.form.getFieldDecorator('newPwd', {required:true,message:this.$t('langMap.commons.forms.pleaseFillOut',[this.$t('langMap.table.fields.em.user.newPwd')])});
            },
            goPreviousStep() {
                //上一步
                this.stepConf.current--;
            },
            goNextStep() {
                //下一步
                var _this = this;
                let currentKey = this.currentStepKey;
                //验证
                if (currentKey == _this.stepConf.steps.verifyOldPwd.key) {
                    this.form.validateFields((err, values) => {
                        if (!err) {
                            //验证旧密码
                            ForgetPwdApi.verifyPassword(values).then((res) => {
                                if(res.success === true){
                                    this.handleNewPwdAddVerify();
                                    this.stepConf.current++;
                                }
                            })
                        }
                    });
                }
                if (currentKey == this.stepConf.steps.setNewPwd.key) {
                    //最终步骤，next不会到这里，不拦截
                    this.stepConf.current++;
                }
            },
        }
    }
</script>
<style scoped>

</style>
