const _import = require('~Router/_import_' + process.env.NODE_ENV)
const MemberRegisterRouter = {
    path:'register',
    component:_import('member/register/RegisterPage'),
    name:'member_register_page',
    meta:{
        visitLimit:false ,
    },
    children:[

    ]
};
export default MemberRegisterRouter ;
