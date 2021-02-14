const _import = require('~Router/_import_' + process.env.NODE_ENV)
import MemberLoginRouter from './login/index' ;
import MemberPage from '~Pages/member/MemberPage'


/**
 * 用户 的路由(登录、注册
 */
const MemberRouter = {
    path:'/member',
    component:MemberPage,
    name:'member',
    children:[
        MemberLoginRouter,
        {
            path:'register',
            component:_import('member/register/RegisterPage'),
            name:'member_register_page',
            meta:{
                visitLimit:false ,title:"注册账号"
            }
        },
        {
            path:'password/forget',
            component:_import('member/forgetPwd/ForgetPwdPage'),
            name:'member_register_page',
            meta:{
                visitLimit:false ,title:"忘记密码"
            }
        }
    ]
};
export default MemberRouter ;


