import Vue from 'vue'
import VueRouter from 'vue-router'
import {Modal} from 'ant-design-vue';
import constantParams from '~Config/constantParams';
import {TokenUtil,RouteConst} from '~Router/routeSecurityUtil';
const _import = require('~Router/_import_' + process.env.NODE_ENV)

//index的基本布局
import Layout from '@/layout/Layout'

//em
import EmployeeRouter from './main/em/employee/index'
import PermissionRouter from './main/em/permission/index'
import AnnouncementRouter from './main/em/announcement/index'
import SysRouter from './main/em/sys/index'

//obl
import ArticleRouter from './main/obl/article/index'


//登录、注册
import UserZoneRouter from './main/regular/userZone/index'
import MemberRouter from './member/index.js'
//错误页面
import Error4XXRouter from './error'


Vue.use(VueRouter);

var indexParentRouterCompName = "Layout"

export const constantRouterMap = [
    {
        path:'',
        redirect:'/index',
    },
    {
        path:'/index',
        component:Layout,
        redirect:'main',
        name:'Index',
        meta:{
            title:'Index',
            icon:'home'
        },
        children:[
            {
                path:'',
                component:_import('index/regular/dashboard/DashBoardPage'),
                name:'dashboard',
                meta:{
                    title:'首页',icon:"dashboard",keepAliveFlag:true,
                    visitLimit:false ,
                    parentRouterCompName:indexParentRouterCompName,
                    selfCompName:'UserZoneCenterView'
                }
            },
            AnnouncementRouter,
            SysRouter,
            EmployeeRouter,
            PermissionRouter,
            ArticleRouter,
            UserZoneRouter,
        ]
    },
    MemberRouter,
    Error4XXRouter
]


//默认可访问的路径，不进行拦截
const defaultPassRouterUrls = [] ;


const vueRouter = new VueRouter({
    mode:'history',
    linkExactActiveClass: 'active', // 保持要跳转后的路由页面标题高亮
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRouterMap,
    beforeRouteLeave:(to, from, next) =>{
        next();
    }
})

vueRouter.beforeEach((to,from,next) => {
    var passFlag = true ;
    //判断token等信息，决定路由是否可以放行
    let carryOnFlag = TokenUtil.isRouteCarryOn(to,from);
    if(carryOnFlag == false){
        next(RouteConst.login);
    }
    if(to && from){
        const toPath = to.fullPath ;
        if(defaultPassRouterUrls.indexOf(toPath) == -1){    //要访问的路径不在 [默认放行路径] ?
            if(to.meta.visitLimit == false){    //在router定义的meta配置 visitLimit = false ，标识该路径默认可访问，不会受权限控制 而无法访问!
                passFlag = true ;
            }   else {
                var visibleRouterUrlsStr = window.sessionStorage.getItem("visibleRouterUrls") ;
                if(visibleRouterUrlsStr){
                    var visibleRouterUrlsSet = JSON.parse(visibleRouterUrlsStr);
                    if(visibleRouterUrlsSet.indexOf(toPath) == -1){   //验证根据用户角色 返回的可访问路径
                        passFlag = false ;
                    }
                }
            }
        }
    }
    if(passFlag){   //放行
        //顶部标题名称变动
        document.title = (to.meta.title) ? to.meta.title : constantParams.defaultObj.projectTitle;
        next();
    }   else {  //拦截,判断用户是否跳转到首页
        Modal.confirm({
            title:"您当前没有权限访问该路径！已拦截您的跳转请求！",
            closable:true,
            okText:"留在当前页面",
            cancelText:"跳转到首页",
            maskClosable:true,
            onCancel(close){
                if(typeof close == "function"){
                    close();
                }
                if(from.path != "/index" && from.path != ""){
                    next({path:"/index"});
                }   else {
                    //next(false);
                }
            },
            onOk(close){
                close();
                //next(false);
            }
        })
    }
})

export default vueRouter;
