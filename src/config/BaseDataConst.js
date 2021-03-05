export const BaseDataConst = {
    routerConst: {
        basic: {
            index: '/index',
            index2: '/',
            login: '/member/login',
            register: '/member/register',
            forgetPassword: '/member/password/forget',
            serverDown: '/errorPage/server_down'
        },
        article: {
            display: '/index/article/display',
            create: '/index/article/create'
        },
        announcement: {
            display: '/index/announcement/display',
            create: '/index/announcement/create'
        }
    }
};

export default BaseDataConst;
export const routerConst = BaseDataConst.routerConst;
