const _import = require('~Router/_import_' + process.env.NODE_ENV)
const Error4XXRouter = {
    path:'*',
    component:_import('error/ErrorPage'),
    redirect:'/errorPage/404',
    name:'error_page',
    children:[
        {
            path:'404',
            component:_import('error/4xx/Error404View'),
            name:'error4xx-404',
            meta:{title:'页面找不到',icon:"user",noCache:true}
        }
    ]
};
export default Error4XXRouter ;
