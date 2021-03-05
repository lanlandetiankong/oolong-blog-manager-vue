const _import = require('~Router/_import_' + process.env.NODE_ENV)

let basePath = '/member/' ;
/**
 * 用户 的路由(登录、注册
 */
const MemberRouter = [
    {
        path:basePath+'login',
        component:_import('member/login/LoginPage'),
        name:'member_login_page',
        meta:{
            visitLimit:false ,title:'登录页面',
            visitedCacheAble:false
        }
    },
    {
        path:basePath+'register',
        component:_import('member/register/RegisterPage'),
        name:'member_register_page',
        meta:{
            visitLimit:false ,title:"注册账号"
        }
    },
    {
        path:basePath+'password/forget',
        component:_import('member/forgetPwd/ForgetPwdPage'),
        name:'member_register_page',
        meta:{
            visitLimit:false ,title:"忘记密码"
        }
    }
];
export default MemberRouter ;


