const _import = require('~Router/_import_' + process.env.NODE_ENV) ;
let basePath = 'permission/' ;

const PermissionRouter = [
    {
        path:basePath+'manager',
        component:_import('index/em/permission/manager/PermissionManagerView'),
        name:'permissionManager',
        meta:{
            title:'权限管理',icon:"user",keepAliveFlag:true,
            selfCompName:'PermissionManagerView'
        }
    },
    {
        path:basePath+'role/manager',
        component:_import('index/em/permission/role/PermissionRoleManagerView'),
        name:'permissionRoleManager',
        meta:{
            title:'角色定义',icon:"user",keepAliveFlag:true,
            selfCompName:'PermissionRoleManagerView'
        }
    },
    {
        path:basePath+'menu/manager',
        component:_import('index/em/permission/menu/MenuManagerView'),
        name:'menuManager',
        meta:{
            title:'菜单管理',icon:"user",keepAliveFlag:true,
            selfCompName:'MenuManagerView'
        }
    },
    {
        path:basePath+'module/manager',
        component:_import('index/em/permission/module/ModuleManagerView'),
        name:'moduleManager',
        meta:{
            title:'模块管理',icon:"user",keepAliveFlag:true,
            selfCompName:'ModuleManagerView'
        }
    }
];
export default PermissionRouter ;
