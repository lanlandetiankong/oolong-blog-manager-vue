const _import = require('~Router/_import_' + process.env.NODE_ENV);

let basePath = 'member/' ;
const Error4XXRouter = [
    {
        path:basePath+'404',
        component:_import('error/4xx/Error404View'),
        name:'error4xx-404',
        meta:{title:'页面找不到',icon:"user",noCache:true}
    },
    {
        path:basePath+'server_down',
        component:_import('error/serverDown/ServerDownView'),
        name:'error-serverDown',
        meta:{title:'服务器维护中',icon:"close",noCache:true}
    }
];
export default Error4XXRouter ;
