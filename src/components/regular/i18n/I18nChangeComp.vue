<template>
    <div>
        <a-button v-if="langLocale==='zh-CN'" @click="langChange">
            English
        </a-button>
        <a-button  v-else @click="langChange">
            中文
        </a-button>
    </div>
</template>
<!-- i18n 切换语言 组件 -->
<script>
    import {i18nUtil} from "~Config/i18n/i18nUtil";


    export default {
        name:'I18nChangeComp',
        data(){
            return {}
        },
        computed:{
            langLocale(){
                return (this.$i18n.locale) ? this.$i18n.locale : 'zh-CN' ;
            }
        },
        methods:{
            langChange(){
                let lang = this.$i18n.locale === 'zh-CN' ? 'en-US' : 'zh-CN'
                this.$i18n.locale = lang ;
                i18nUtil.reflushCache(this.$i18n.locale);
                //手动更新那些npm组件的内容
                this.manualUpdateText();
            },
            /**
             * 手动更新那些npm组件的内容
             */
            manualUpdateText(){
                const verifyDom = document.getElementsByClassName('verify-change-code');
                if(verifyDom && verifyDom[0]){
                    verifyDom[0].innerHTML = this.$t('langMap.button.actions.switchToNextOne') ;
                }
            }
        }
    }
</script>
