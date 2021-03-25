const _import = require('~Router/_import_' + process.env.NODE_ENV);

let basePath = '/error/' ;
const Error4XXRouter = [
    {
        path:basePath+'server_down',
        component:_import('error/serverDown/ServerDownView'),
        name:'ServerDownView',
        meta:{title:'服务器维护中',icon:"close",noCache:true}
    },
    {
        path:'*/404',
        component:_import('error/4xx/Error404View'),
        name:'Error404View',
        meta:{title:'页面找不到',icon:"user",noCache:true}
    }
];
export default Error4XXRouter ;
