const _import = require('~Router/_import_' + process.env.NODE_ENV)
import MemberLoginRouter from './login/index' ;
import MemberRegisterRouter from './register/index' ;
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
        MemberRegisterRouter
    ]
};
export default MemberRouter ;


