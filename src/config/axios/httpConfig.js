import axios from 'axios'
import store from '@/store' ;
import baseURL from './baseUrl'
import {message, Spin,notification} from 'ant-design-vue'
import {i18nUtil} from "~Config/i18n/i18nUtil";
import {TokenUtil} from '~Router/routeSecurityUtil';


const http = {};

//基础访问url
var instance = axios.create({
    timeout: 50000,
    baseURL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    validateStatus(status) {
        switch (status) {
            case 400:
                notification.error({
                    message:i18nUtil.getKey('langMap.http.notify.message.error'),
                    description:i18nUtil.getKey('langMap.http.notify.description.requestError')
                })
                break
            case 401:
                notification.warning({
                    message:i18nUtil.getKey('langMap.http.notify.message.warning'),
                    description:i18nUtil.getKey('langMap.http.notify.description.grantFailed')
                })
                return;
            case 403:
                notification.warning({
                    message:i18nUtil.getKey('langMap.http.notify.message.warning'),
                    description:i18nUtil.getKey('langMap.http.notify.description.accessDenied')
                })
                break
            case 404:
                notification.warning({
                    message:i18nUtil.getKey('langMap.http.notify.message.warning'),
                    description:i18nUtil.getKey('langMap.http.notify.description.resourceNotFound')
                })
                break
            case 500:
                notification.error({
                    message:i18nUtil.getKey('langMap.http.notify.message.error'),
                    description:i18nUtil.getKey('langMap.http.notify.description.serverDistracted')
                })
                break
        }
        return status >= 200 && status < 300
    },
    transformResponse: [function (data) {
        // 在传递给 then/catch 前，允许修改响应数据
        if(data){
            if(typeof data == "string"){
                return JSON.parse(data);
            }
        }
        return data;
    }],
})

// 添加请求拦截器
instance.interceptors.request.use(
    config => {
        var cfgUserToken = window.sessionStorage.getItem("userToken");
        var cfgAuthorization = window.sessionStorage.getItem("authorization");
        cfgAuthorization = typeof cfgAuthorization == "undefined" ? "" : cfgAuthorization ;
        //var tokenStr = qs.stringify(JSON.parse(cfgUserToken)) ;
        // 请求头添加token
        if (cfgUserToken) {
            var cfgUserTokenObj = JSON.parse(cfgUserToken);
            var userTokenObj = {
                account:cfgUserTokenObj['account'],
                token:cfgUserTokenObj['token'],
                userAccountId:cfgUserTokenObj['userAccountId']
            }
            //config.headers['token'] = JSON.parse(cfgUserToken).token;
            config.headers['token'] = JSON.stringify(userTokenObj);
        } else {
            console.log("employee is loginout");
        }
        config.headers['authorization'] = cfgAuthorization;
        store.dispatch('doSetAjaxLoading',true) ;
        return config ;
    },
    error => {
        return Promise.reject(error)
    }
)


// 响应拦截器
instance.interceptors.response.use(
    response => {
        //return response.data;
        return response;
    },
    // 服务器状态码不是200的情况
    error => {
        var _this = this ;
        if (error.response) {
            if (error.response.status) {
                switch (error.response.status) {
                    // 401: 未登录
                    // 未登录则跳转登录页面，并携带当前页面的路径
                    // 在登录成功后返回当前页面，这一步需要在登录页操作。
                    case 401:
                        break;
                    // 登录过期对用户进行提示
                    // 清除本地token和清空vuex中token对象
                    // 跳转登录页面
                    case 403:
                        if(1==2) {       //已在create axios 时定义了处理
                            notification.error({
                                message:i18nUtil.getKey('langMap.http.notify.message.error'),
                                description:i18nUtil.getKey('langMap.http.notify.description.grantFailed')
                            });
                        }
                        // 清除token
                        sessionStorage.removeItem('userToken');
                        break;
                    // 404请求不存在
                    case 404:
                        if(1==2){       //已在create axios 时定义了处理
                            notification.warning({
                                message:i18nUtil.getKey('langMap.http.notify.message.warning'),
                                description:i18nUtil.getKey('langMap.http.notify.description.resourceNotFound')
                            });
                        }
                        break;
                    // 其他错误，直接抛出错误提示
                    default:
                        if(1==2) {       //已在create axios 时定义了处理
                            notification.error({
                                message:i18nUtil.getKey('langMap.http.notify.message.error'),
                                description:i18nUtil.getKey('langMap.http.notify.description.requestError')
                            });
                        }
                }
                store.dispatch('doSetAjaxLoading',false) ;
                return Promise.reject(error.response);
            }
        }   else {
            store.dispatch('doSetAjaxLoading',false) ;
            notification.error({
                message:i18nUtil.getKey('langMap.http.notify.message.error'),
                description:i18nUtil.getKey('langMap.http.notify.description.serverDistracted')
            });
        }
    }
);


http.get = function (url, options) {
    return new Promise((resolve, reject) => {
        instance
            .get(url, options)
            .then(response => {
                if (response.code === 1) {
                    resolve(response.data)
                } else {
                    notification.error({
                        message:i18nUtil.getKey('langMap.http.notify.message.error'),
                        description:response.msg
                    });
                    reject(response.msg)
                }
            })
            .catch(e => {
                console.log(e)
            }, err => {
                notification.error({
                    message:i18nUtil.getKey('langMap.http.notify.message.error'),
                    description:i18nUtil.getKey('langMap.http.notify.description.serverDistracted')
                });
                reject(err);
            })
    })
}

http.post = function (url, data, options) {
    return new Promise((resolve, reject) => {
        instance
            .post(url, data, options)
            .then((response) => {
                store.dispatch('doSetAjaxLoading',false) ;
                if(typeof response == "undefined"){
                    reject(response) ;
                    return false ;
                }
                const respData = response.data ;
                //对返回结果的预先处理
                if (respData) {
                    if(respData instanceof Blob){   //判断是否是Blob文件流
                        let fileReader = new FileReader();
                        fileReader.onload = function() {
                            try {
                                let jsonData = JSON.parse(this.result);  // 说明是普通对象数据，后台转换失败
                                if (jsonData.success) {
                                    resolve(response);
                                }   else {
                                    message.error(jsonData.msg);
                                    reject(response);
                                }
                            } catch (err) {   // 解析成对象失败，说明是正常的文件流
                                resolve(response);
                            }
                        };
                        fileReader.readAsText(respData);    //触发onload
                    }   else {
                        let isSuccess = respData.success;
                        //Error:不放行
                        if (typeof(isSuccess) != "undefined" && isSuccess != null && isSuccess === true) {
                            let respHasWarning = respData.hasWarning;
                            if (typeof(respHasWarning) == "undefined" || respHasWarning == null) {
                                respHasWarning = false;
                            }
                            resolve(response);
                        } else {
                            let tempRespInfo = respData.msg ? respData.msg : "操作出现异常！";
                            if (typeof(tempRespInfo) != "undefined" && tempRespInfo != null && tempRespInfo.replace(/(^s*)|(s*$)/g, "").length != 0) {
                                message.error(tempRespInfo);
                            }
                            let tempErrorActionType = respData.errorActionType;
                            if(tempErrorActionType){     //如果发生异常时，后端明确指明有操作要求
                                if("AuthenticationExpired" == tempErrorActionType){  //请求明确要求需要重新登录
                                    TokenUtil.loginOut();
                                }
                            }
                            resolve(response);
                        }
                    }
                }
            })
            .catch(e => {
                store.dispatch('doSetAjaxLoading',false) ;
                console.log(e);
                reject(e);
            })

    })
}


export default http
