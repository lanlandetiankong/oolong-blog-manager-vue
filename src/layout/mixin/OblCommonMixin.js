import { mapGetters } from 'vuex' ;
import {ConstantObj} from "~Components/constant_define";
import {routerConst} from  '~Config/BaseDataConst.js'
import {UrlUtils} from "~Utils/basic/BeeUtil";

export const OblCommonMixin = {
    data(){
        return {
            //数据必须都写到mixinData之下
            mixinData:{
                routerConst
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
        mixin_goToIndex(){
            var _currentRoute = this.$route;
            if(_currentRoute){
                if(_currentRoute.fullPath == "" || _currentRoute.fullPath == "/index"){
                    //当前已经在 index页面了，无需再跳转
                }   else {
                    this.$router.push(this.mixinData.routerConst.basic.index);
                }
            }
        },
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
        mixin_refreshChildViewCaches(self){    //使用在 *Page.vue，用于优化页面组件缓存
            var _this = self;
            var cachedViewArr = this.$store.state.tagsView.cachedViews ;
            if(typeof cachedViewArr != "undefined" && cachedViewArr != null && cachedViewArr.length > 0){
                _this.cachedChildrenViews = cachedViewArr ;
            }   else {
                _this.cachedChildrenViews = [] ;
            }
        },
        mixin_invokeQuery(self,refName){
            refName = (refName) ? refName : ConstantObj.queryFormCompRef ;
            self.$refs[refName].triggerQuery();
        },
        mixin_closeTagAndJump(goToRoute,params){  //关闭当前标签并跳转到指定路由
            let _this = this ;
            var selectedTag = this.$route ;
            params = (params) ? params : {} ;
            //关闭当前所选标签
            this.$store.dispatch('doDelVisitedViews',selectedTag).then((views) => {
                if(goToRoute){
                    let routerUrl = UrlUtils.objToUrl(goToRoute,params);
                    //有指定路由，跳转
                    this.$router.push(routerUrl) ;
                }   else {
                    //无指定路由，跳转上一个tag
                    const latestView = views.slice(-1)[0] ;
                    if(latestView) {
                        this.$router.push(latestView.path) ;
                    }   else {
                        this.$router.push(_this.mixinData.routerConst.basic.index) ;
                    }
                }
            })
        },
        mixin_jump(goToRoute,params){  //跳转到指定路由
            if(!goToRoute){
                return ;
            }
            params = (params) ? params : {} ;
            this.$router.push({path:goToRoute,query:params}) ;
        },
        mixin_getFilterOption(input,option){
            return (option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0);
        }
    }


}
