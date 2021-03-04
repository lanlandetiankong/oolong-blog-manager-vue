const constantParams = dealGetConstantParamsByEnv();

function dealGetConstantParamsByEnv() {
    if(process.env.NODE_ENV === 'development'){
        //开发环境
        return dealGetDevConstantParams();
    }   else if(process.env.NODE_ENV === "production"){
        //生产环境
        return dealGetProdConstantParams();
    }   else if(process.env.NODE_ENV === "testing"){
        //测试环境
        return dealGetTestConstantParams();
    }
}

/**
 * 取得 开发环境 参数
 */
function dealGetDevConstantParams() {
    return {
        defaultObj:{    //一些常用的默认值
            projectTitle:'Oolong Blog Manager',
            avatarUrl:"/static/img/user/panda_egg.jpg"
        }
    }
}
/**
 * 取得 生产环境 参数
 */
function dealGetProdConstantParams() {
    return {
        defaultObj:{    //一些常用的默认值
            projectTitle:'OolongBlogManager',
            avatarUrl:"/static/img/user/panda_egg.jpg"
        }
    }
}
/**
 * 取得 测试环境 参数
 */
function dealGetTestConstantParams() {
    return {

    }
}

export  default constantParams ;
