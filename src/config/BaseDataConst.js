export const BaseDataConst = {
    routerConst: {
        basic: {
            index: '/index',
            index2: '/',
            login: '/member/login',
            register: '/member/register',
            forgetPassword: '/member/password/forget',
            serverDown: '/error/server_down'
        },
        article: {
            display: '/index/article/display',
            create: '/index/article/create'
        },
        announcement: {
            display: '/index/announcement/display',
            create: '/index/announcement/create'
        },
        feedback:{
            display: '/index/sys/feedback/display',
            create: '/index/sys/feedback/create'
        }
    }
};

export default BaseDataConst;
export const routerConst = BaseDataConst.routerConst;
