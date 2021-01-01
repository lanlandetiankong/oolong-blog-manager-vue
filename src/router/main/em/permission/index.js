const _import = require('~Router/_import_' + process.env.NODE_ENV) ;
//所挂载的 page 组件名
const parentRouterCompName = "PermissionPage" ;

const PermissionRouter = {
    path:'permission',
    component:_import('index/em/permission/PermissionPage'),
    name:'permission',
    meta:{
        selfCompName:'PermissionPage'
    },
    children:[
        {
            path:'manager',
            component:_import('index/em/permission/manager/PermissionManagerView'),
            name:'permissionManager',
            meta:{
                title:'权限管理',icon:"user",keepAliveFlag:true,
                parentRouterCompName,
                selfCompName:'PermissionManagerView'
            }
        },
        {
            path:'role/manager',
            component:_import('index/em/permission/role/PermissionRoleManagerView'),
            name:'permissionRoleManager',
            meta:{
                title:'角色定义',icon:"user",keepAliveFlag:true,
                parentRouterCompName,
                selfCompName:'PermissionRoleManagerView'
            }
        },
        {
            path:'menu/manager',
            component:_import('index/em/permission/menu/MenuManagerView'),
            name:'menuManager',
            meta:{
                title:'菜单管理',icon:"user",keepAliveFlag:true,
                parentRouterCompName,
                selfCompName:'MenuManagerView'
            }
        },
        {
            path:'module/manager',
            component:_import('index/em/permission/module/ModuleManagerView'),
            name:'moduleManager',
            meta:{
                title:'模块管理',icon:"user",keepAliveFlag:true,
                parentRouterCompName,
                selfCompName:'ModuleManagerView'
            }
        }
    ]
};
export default PermissionRouter ;
