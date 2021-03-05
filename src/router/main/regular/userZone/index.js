const _import = require('~Router/_import_' + process.env.NODE_ENV)
//所挂载的 page 组件名
const parentRouterCompName = "UserZonePage" ;
let basePath = 'regular/userZone/' ;
const UserZoneRouter = [{
    path:basePath+'center',
    component:_import('index/regular/userZone/center/UserZoneCenterView'),
    name:'userZoneCenterView',
    meta:{
        title:'用户中心',icon:"user",keepAliveFlag:true,
        visitLimit:false ,
        parentRouterCompName,
        selfCompName:'UserZoneCenterView'
    }
}];
export default UserZoneRouter ;
