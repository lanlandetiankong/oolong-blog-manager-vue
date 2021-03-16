const _import = require('~Router/_import_' + process.env.NODE_ENV);
let basePath = 'sys/' ;
const SysRouter = [{
    path:basePath+'dic',
    component:_import('index/em/sys/dic/SysDicView'),
    name:'sysDic',
    meta:{
        title:'字典配置',icon:"dic",keepAliveFlag:true,
        selfCompName:'SysDicView'
    }
},{
    path:basePath+'feedback/all_list',
    component:_import('index/em/sys/feedback/allList/SysFeedbackView'),
    name:'sysFeedback',
    meta:{
        title:'系统反馈',icon:"flag",keepAliveFlag:true,
        selfCompName:'SysFeedbackView'
    }
},{
    path:basePath+'feedback/my_create_list',
    component:_import('index/em/sys/feedback/myCreateList/SysFeedbackMyCreateListView'),
    name:'SysFeedbackMyCreateListView',
    meta:{
        title:'我的反馈',icon:"flag",keepAliveFlag:true,
        selfCompName:'SysFeedbackMyCreateListView'
    }
},{
    path:basePath+'feedback/my_draft_list',
    component:_import('index/em/sys/feedback/myDraftList/SysFeedbackMyDraftListView'),
    name:'SysFeedbackMyDraftListView',
    meta:{
        title:'我的反馈草稿',icon:"bars",keepAliveFlag:true,
        selfCompName:'SysFeedbackMyDraftListView'
    }
},{
    path:basePath+'feedback_type/manager',
    component:_import('index/em/sys/feedback/type/SysFeedbackTypeView'),
    name:'sysFeedbackType',
    meta:{
        title:'系统反馈类别',icon:"tag",keepAliveFlag:true,
        selfCompName:'SysFeedbackTypeView'
    }
},{
    path:basePath+'feedback/create',
    component:_import('index/em/sys/feedback/create/SysFeedbackCreateView'),
    name:'sysFeedbackCreate',
    meta:{
        title:'编辑系统反馈',icon:"edit",keepAliveFlag:true,
        selfCompName:'SysFeedbackCreateView'
    }
}, {
    path:basePath+'feedback/display',
    component:_import('index/em/sys/feedback/display/SysFeedbackDisplayView'),
    name:'EmSysFeedbackDisplayView',
    meta:{
        title:'反馈详情',icon:"book",keepAliveFlag:true,
        visitLimit:false ,
        selfCompName:'EmSysFeedbackDisplayView'
    }
},];
export default SysRouter ;
