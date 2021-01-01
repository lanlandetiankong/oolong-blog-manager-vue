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
        return dealGetTestConstantParams();;
    }
}

/**
 * 取得 开发环境 参数
 */
function dealGetDevConstantParams() {
    return {
        props:{
            upload:{
                location:{
                    prefix:"M:\\static_dir\\",
                    img:"\\img"
                },
                url:{
                    prefix:"http:\\\\localhost:8090"
                },
                project:{
                    name:"oolong-blog-manager"
                }
            }
        },
        defalutObj:{    //一些常用的默认值
            projectTitle:'OolongBlogManager',
            avatarUrl:"/static/img/user/panda_egg.jpg"
        }
    }
}
/**
 * 取得 生产环境 参数
 */
function dealGetProdConstantParams() {
    return {
        props:{
            upload:{
                location:{
                    prefix:"C:\\swordsman\\projects\\oolong_blog\\static_dir",
                    img:"\\img"
                },
                url:{
                    prefix:"http:\\\\47.99.160.215:8090"
                },
                project:{
                    name:"oolong-blog-manager"
                }
            }
        },
        defalutObj:{    //一些常用的默认值
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
