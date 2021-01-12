import { mapGetters } from 'vuex' ;
import {ConstantObj} from "~Components/constant_define";

export const OblCommonMixin = {
    data(){
        return {
            //数据必须都写到mixinData之下
            mixinData:{
                routerConst:{
                    article:{
                        display:'/index/article/display'
                    }
                }
            }
        }
    },
    computed:{
        ...mapGetters([
            'userInfoStore_grantedPermissions',
        ])
    },
    created(){

    },
    methods:{
        mixin_handlePermissionDomShow(permCode){    //根据后台传递的[可展示权限]列表进行[权限按钮]展示的控制
            return this.userInfoStore_grantedPermissions.includes(permCode) ;
        },
        mixin_handleGetCurMenuConf(){ //取得当前页面的meta
            const metaObj = this.$route.meta;
            if(metaObj){
                const menuConfTemp = metaObj.menuConf ;
                return (menuConfTemp) ? metaObj.menuConf : {} ;
            }
            return {} ;
        },
        mixin_handleGetCurMenuId(){ //取得当前页面的[菜单定义]fid,但例如/index等页面是无法取到对应的值的
            var menuId = "" ;
            const menuConf = this.mixin_handleGetCurMenuConf() ;
            if(menuConf){
                menuId = menuConf.fid ;
            }
            return menuId ;
        },
        mixin_dealGetSearchFormQueryConf(queryConf,queryObj){
            const queryFieldArr = [] ;
            if(queryObj) {
                for (const key in queryObj){
                    const searchFieldObj = queryConf[key];
                    if(typeof searchFieldObj == "undefined"){
                        continue ;
                    }
                    const searchAbleVal = this.mixin_defaultIfblank(searchFieldObj.searchAble,true);
                    if(searchAbleVal == false){
                        continue ;
                    }
                    const queryVal = queryObj[key] ;
                    if(queryVal || queryVal == 0){
                        queryFieldArr.push({
                            fieldName:searchFieldObj.fieldName,
                            value:queryObj[key],
                            matching:searchFieldObj.matching
                        });
                    }
                }
            }
            return queryFieldArr ;
        },
        mixin_defaultIfblank(val,defval){   //当blank时取默认值
            if(typeof val == "undefined" || val == null || val == ""){
                return defval ;
            }   else {
                return val ;
            }
        },
        mixin_defaultIfNull(val,defval){   //当null时取默认值
            if(typeof val == "undefined" || val == null){
                return defval ;
            }   else {
                return val ;
            }
        },
        mixin_dealNullStrToEmpty(str,repStr){ //如果遇到 Undefine或者null，替换为repStr
            if(typeof str == "undefined" || str == null){
                if(typeof repStr != "undefined" && repStr == null){
                    return repStr ;
                }   else {
                    return "";
                }
            }   else {
                return str;
            }
        },
        mixin_refreshChildViewCaches(self,pageCompName){    //使用在 *Page.vue，用于优化页面组件缓存
            var _this = self;
            var cachedViewMap = this.$store.state.tagsView.cachedViews ;
            if(typeof cachedViewMap != "undefined" && cachedViewMap != null && cachedViewMap.size > 0){
                var currentCacheChildCompNames = cachedViewMap.get(pageCompName);
                if(currentCacheChildCompNames && currentCacheChildCompNames.length > 0){
                    if(_this.cachedChildrenViews.length > 0){
                        for(let i = 0; i < currentCacheChildCompNames.length; i++){
                            if(_this.cachedChildrenViews.indexOf(currentCacheChildCompNames[i]) == -1){ //不重复添加
                                _this.cachedChildrenViews.push(currentCacheChildCompNames[i]);
                            }
                        }
                    }   else {
                        for(let i = 0; i < currentCacheChildCompNames.length; i++){
                            _this.cachedChildrenViews.push(currentCacheChildCompNames[i]);
                        }
                    }
                }   else {
                    _this.cachedChildrenViews = [] ;
                }
            }   else {
                _this.cachedChildrenViews = [] ;
            }
        },
        mixin_invokeQuery(self,refName){
            refName = (refName) ? refName : ConstantObj.queryFormCompRef ;
            self.$refs[refName].triggerQuery();
        },
        mixin_deepClone(obj) {  //对象深复制
            if(typeof obj == "undefined" || obj == null){
                return {};
            }
            //返回 深复制后的对象
            var _obj = JSON.stringify(obj),
                objClone = JSON.parse(_obj);
            return objClone;
        },
        mixin_closeTagAndJump(goToRoute){  //关闭当前标签并跳转到指定路由
            var selectedTag = this.$route ;
            //关闭当前所选标签
            this.$store.dispatch('doDelVisitedViews',selectedTag).then((views) => {
                if(goToRoute){
                    //有指定路由，跳转
                    this.$router.push(goToRoute) ;
                }   else {
                    //无指定路由，跳转上一个tag
                    const latestView = views.slice(-1)[0] ;
                    if(latestView) {
                        this.$router.push(latestView.path) ;
                    }   else {
                        this.$router.push('/') ;
                    }
                }
            })
        },
    }


}
