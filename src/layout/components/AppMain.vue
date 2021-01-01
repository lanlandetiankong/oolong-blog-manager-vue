<template>
    <div class="app_main" ref="appMain">
        <transition name="fade" mode="out-in">
            <keep-alive :include="cachedBasePages">
                <router-view :style="styleConf"></router-view>
            </keep-alive>
        </transition>
    </div>
</template>

<script>
    export default {
        name: 'AppMain',
        data(){
            return {
                cachedBasePages : [],
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
        methods:{
            doBasePageCachesRefresh(){
                var _this = this;
                var cachedViewMap = this.$store.state.tagsView.cachedViews ;
                var hasChildPageNameArr = [] ;  //需要保持或添加缓存 子页面的page
                var hasNoChildPageNameArr = [] ;    //无需需要缓存子页面的 page
                if(typeof cachedViewMap != "undefined" && cachedViewMap != null && cachedViewMap.size > 0){
                    cachedViewMap.forEach(function (value, key, map) {
                        var keyChildViews = cachedViewMap.get(key);
                        if(typeof keyChildViews != "undefined" && keyChildViews != null ){
                            if(keyChildViews.length > 0 ){
                                hasChildPageNameArr.push(key);
                            }
                        }
                    });
                    var cachedBasePageTemp = _this.cachedBasePages ;
                    for ( var i = 0; i <cachedBasePageTemp.length; i++){
                        var pageName = cachedBasePageTemp[i] ;
                        var keyIndex = hasChildPageNameArr.indexOf(pageName);
                        if (keyIndex == -1) {
                            hasNoChildPageNameArr.push(pageName);
                        }
                    }
                }

                if(hasChildPageNameArr.length > 0){ //有带缓存的page
                    if(hasNoChildPageNameArr.length > 0){   //有需要移除的page 项
                        for ( var i = 0; i <hasNoChildPageNameArr.length; i++){
                            var delPageName = hasNoChildPageNameArr[i] ;
                            var keyIndex = _this.cachedBasePages.indexOf(delPageName);
                            if (keyIndex > -1) {    //移除
                                _this.cachedBasePages.splice(keyIndex,1);
                            }
                        }
                    }
                    for ( var i = 0; i <hasChildPageNameArr.length; i++){   //有 需要缓存子页面的 page
                        var pageName = hasChildPageNameArr[i] ;
                        var keyIndex = _this.cachedBasePages.indexOf(pageName);
                        if (keyIndex == -1) {   //如果不在数组中则添加
                            _this.cachedBasePages.push(pageName);
                        }
                    }
                }   else {  //没有缓存的page
                    _this.cachedBasePages = [] ;
                }
            }
        },
        watch:{
            cachedViews() {
                this.doBasePageCachesRefresh() ;
            }
        },
        created(){
            this.doBasePageCachesRefresh();
        },
        mounted(){
            this.$nextTick(()=>{ // 页面渲染完成后的回调
                const heightVal = this.$refs.appMain.offsetHeight ;
                this.$store.dispatch('doSetStyleOfAppMain',{
                    height:heightVal
                }) ;
                this.styleConf = this.$store.getters.styleStore_appMain;
            })
        }
    }
</script>
<style>
    .app_main{
        min-height: 100%;
    }
</style>
