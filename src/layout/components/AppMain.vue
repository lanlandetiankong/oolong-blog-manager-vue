<template>
    <div class="app_main" ref="appMain">
        <transition name="fade" mode="out-in">
            <keep-alive :include="cachedChildrenViews">
                <router-view :style="styleConf"></router-view>
            </keep-alive>
        </transition>
    </div>
</template>

<script>
    import {OblCommonMixin} from '~Layout/mixin/OblCommonMixin';
    export default {
        name: 'AppMain',
        mixins:[OblCommonMixin],
        data(){
            return {
                cachedChildrenViews : [],
                styleConf:{
                    height:500
                }
            }
        },
        computed:{
            cachedViews() {
                return this.$store.state.tagsView.cachedViews ;
            }
        },
        watch:{
            cachedViews() {
                this.mixin_refreshChildViewCaches(this) ;
            }
        },
        created(){
            this.mixin_refreshChildViewCaches(this);
            this.$nextTick(()=>{ // 页面渲染完成后的回调
                const appMainRef = this.$refs.appMain ;
                if(appMainRef){
                    const heightVal = appMainRef.offsetHeight ;
                    this.$store.dispatch('doSetStyleOfAppMain',{
                        height:heightVal
                    }) ;
                }
                this.styleConf = this.$store.getters.styleStore_appMain;
            })
        },
    }
</script>
<style>
    .app_main{
        min-height: 100%;
    }
</style>
