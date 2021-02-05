/**
 * 职务类型
 * @type {{SimpleJob: {label: string, value: number}}}
 */
export const JobTypeEnum = {
    SimpleJob: {
        value: 1,
        label: '普通职务'
    }
};
/**
 * 枚举-菜单跳转类型
 * @type {{OutUrlBlank: {label: string, value: number}, OutUrl: {label: string, value: number}, RouterUrl: {label: string, value: number}}}
 */
export const MenuUrlJumpTypeEnum = {
    RouterUrl: {
        value: 1,
        label: 'Router地址跳转'
    },
    OutUrl: {
        value: 2,
        label: '在当前页面打开外部链接'
    },
    OutUrlBlank: {
        value: 3,
        label: '在新页面打开外部链接'
    }
};
/**
 * 枚举-模块类型
 * @type {{AuthorizedDistribution: {label: string, value: number}, DefaultHas: {label: string, value: number}}}
 */
export const ModuleTypeEnum = {
    DefaultHas:{
        value: 1,
        label: '默认拥有'
    },
    AuthorizedDistribution:{
        value: 100,
        label: '授权分配'
    }
};
/**
 * 枚举-角色类型
 * @type {{ManagerRole: {label: string, value: number}, SimpleRole: {label: string, value: number}}}
 */
export const RoleTypeEnum = {
    SimpleRole:{
        value: 1,
        label: '普通角色'
    },
    ManagerRole:{
        value: 100,
        label: '管理角色'
    }
};
/**
 * 枚举-权限类型
 * @type {{PageButton: {label: string, value: number}, TableActionBtn: {label: string, value: number}}}
 */
export const PermissionTypeEnum = {
    PageButton:{
        value: 1,
        label: '页面操作按钮'
    },
    TableActionBtn:{
        value: 1,
        label: '表格内部按钮'
    }
};
/**
 * 枚举-用户性别
 * @type {{Man: {label: string, value: number}, Woman: {label: string, value: number}}}
 */
export const UserSexEnum = {
    Man:{
        value: 1,
        label: '男'
    },
    Woman:{
        value: 0,
        label: '女'
    }
};
/**
 * 枚举-用户类型
 * @type {{SimpleUser: {label: string, value: number}, Root: {label: string, value: number}, GeneratedUser: {label: string, value: number}, SuperRoot: {label: string, value: number}, Vip: {label: string, value: number}, SuperVip: {label: string, value: number}}}
 */
export const UserTypeEnum = {
    SimpleUser:{
        value: 0,
        label: '普通用户'
    },
    Root: {
        value: 10,
        label: '管理员'
    },
    SuperRoot:{
        value: 100,
        label: '超级管理员'
    },
    Vip:{
        value: 110,
        label: '会员'
    },
    SuperVip:{
        value: 190,
        label: '超级会员'
    },
    GeneratedUser:{
        value: -20,
        label: '随机生成用户'
    }
};
/**
 * 枚举-锁状态
 * @type {{Locked: {label: string, value: number}, Unlocked: {label: string, value: number}}}
 */
export const LockStateEnum = {
    Unlocked:{
        value: 0,
        label: '未锁定'
    },
    Locked:{
        value: 1,
        label: '已锁定'
    }
};
/**
 * 枚举-开关状态
 * @type {{Close: {label: string, value: number}, Open: {label: string, value: number}}}
 */
export const SwitchEnum = {
    Open:{
        value: 1,
        label: '启动'
    },
    Close:{
        value: 0,
        label: '关闭'
    }
};
/**
 * 对象转Select的data
 * @param obj
 * @returns {[]}
 */
function toSelectData(obj) {
    const arr = [];
    if (typeof obj != "object") {
        return arr;
    }
    let keys = Object.keys(obj);
    if (!keys || keys.length == 0) {
        return arr;
    }
    for (let idx in keys) {
        debugger;
        let key = keys[idx] ;
        let item = obj[key];
        if (!item) {
            console.info("key:【%s】为空", key);
            continue;
        }
        if (!item.value || !item.label) {
            console.info("key:【%s】的value或label为空", key);
            continue;
        }
        arr.push({
            value: item.value,
            label: item.label
        });
    }
    console.log("arr",arr);
    return arr;
}

export const All = {
    JobTypeEnum,
    MenuUrlJumpTypeEnum,
    ModuleTypeEnum,
    RoleTypeEnum,
    PermissionTypeEnum,
    UserSexEnum,
    UserTypeEnum,
    LockStateEnum,
    SwitchEnum
};

export const EnumUtils = {
    toSelectData
};
