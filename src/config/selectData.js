import {i18nUtil} from "~Config/i18n/i18nUtil";
/**
 * 职务类型
 * @type {{SimpleJob: {label: string, value: number}}}
 */
export const JobTypeEnum = {
    SimpleJob: {
        value: 1,
        label: i18nUtil.getKey('langMap.commons.enums.jobType.simpleJob')
    }
};
/**
 * 枚举-菜单跳转类型
 * @type {{OutUrlBlank: {label: string, value: number}, OutUrl: {label: string, value: number}, RouterUrl: {label: string, value: number}}}
 */
export const MenuUrlJumpTypeEnum = {
    RouterUrl: {
        value: 1,
        label: i18nUtil.getKey('langMap.commons.enums.menuUrlJumpType.routerUrl')
    },
    OutUrl: {
        value: 2,
        label: i18nUtil.getKey('langMap.commons.enums.menuUrlJumpType.outUrl')
    },
    OutUrlBlank: {
        value: 3,
        label: i18nUtil.getKey('langMap.commons.enums.menuUrlJumpType.outUrlBlank')
    }
};
/**
 * 枚举-模块类型
 * @type {{AuthorizedDistribution: {label: string, value: number}, DefaultHas: {label: string, value: number}}}
 */
export const ModuleTypeEnum = {
    DefaultHas:{
        value: 1,
        label: i18nUtil.getKey('langMap.commons.enums.moduleType.defaultHas')
    },
    AuthorizedDistribution:{
        value: 100,
        label: i18nUtil.getKey('langMap.commons.enums.moduleType.authorizedDistribution')
    }
};
/**
 * 枚举-角色类型
 * @type {{ManagerRole: {label: string, value: number}, SimpleRole: {label: string, value: number}}}
 */
export const RoleTypeEnum = {
    SimpleRole:{
        value: 1,
        label: i18nUtil.getKey('langMap.commons.enums.roleType.simpleRole')
    },
    ManagerRole:{
        value: 100,
        label: i18nUtil.getKey('langMap.commons.enums.roleType.managerRole')
    }
};
/**
 * 枚举-权限类型
 * @type {{PageButton: {label: string, value: number}, TableActionBtn: {label: string, value: number}}}
 */
export const PermissionTypeEnum = {
    PageButton:{
        value: 0,
        label: i18nUtil.getKey('langMap.commons.enums.permissionType.pageButton')
    },
    TableActionBtn:{
        value: 1,
        label: i18nUtil.getKey('langMap.commons.enums.permissionType.tableActionBtn')
    }
};
/**
 * 枚举-用户性别
 * @type {{Man: {label: string, value: number}, Woman: {label: string, value: number}}}
 */
export const UserSexEnum = {
    Man:{
        value: 1,
        label: i18nUtil.getKey('langMap.commons.enums.userSex.man')
    },
    Woman:{
        value: 0,
        label: i18nUtil.getKey('langMap.commons.enums.userSex.woman')
    }
};
/**
 * 枚举-用户类型
 * @type {{SimpleUser: {label: string, value: number}, Root: {label: string, value: number}, GeneratedUser: {label: string, value: number}, SuperRoot: {label: string, value: number}, Vip: {label: string, value: number}, SuperVip: {label: string, value: number}}}
 */
export const UserTypeEnum = {
    SimpleUser:{
        value: 0,
        label: i18nUtil.getKey('langMap.commons.enums.userType.simpleUser')
    },
    Root: {
        value: 10,
        label: i18nUtil.getKey('langMap.commons.enums.userType.root')
    },
    SuperRoot:{
        value: 100,
        label: i18nUtil.getKey('langMap.commons.enums.userType.superRoot')
    },
    Vip:{
        value: 110,
        label: i18nUtil.getKey('langMap.commons.enums.userType.vip')
    },
    SuperVip:{
        value: 190,
        label: i18nUtil.getKey('langMap.commons.enums.userType.superVip')
    },
    GeneratedUser:{
        value: -20,
        label: i18nUtil.getKey('langMap.commons.enums.userType.generatedUser')
    }
};
/**
 * 枚举-锁状态
 * @type {{Locked: {label: string, value: number}, Unlocked: {label: string, value: number}}}
 */
export const LockStateEnum = {
    Unlocked:{
        value: 0,
        label: i18nUtil.getKey('langMap.commons.enums.lockStatus.unlock')
    },
    Locked:{
        value: 1,
        label: i18nUtil.getKey('langMap.commons.enums.lockStatus.locked')
    }
};
/**
 * 枚举-开关状态
 * @type {{Close: {label: string, value: number}, Open: {label: string, value: number}}}
 */
export const SwitchEnum = {
    Open:{
        value: 1,
        label: i18nUtil.getKey('langMap.commons.enums.switch.open')
    },
    Close:{
        value: 0,
        label: i18nUtil.getKey('langMap.commons.enums.switch.close')
    }
};

/**
 * 枚举-开关状态
 * @type {{Close: {label: string, value: number}, Open: {label: string, value: number}}}
 */
export const FlagSwitchEnum = {
    Open:{
        value: 1,
        label: i18nUtil.getKey('langMap.commons.enums.switchFlag.open')
    },
    Close:{
        value: 0,
        label: i18nUtil.getKey('langMap.commons.enums.switchFlag.close')
    }
};
/**
 * 枚举-是否发布
 * @type {{Unpublished: {label: string, value: number}, Published: {label: string, value: number}}}
 */
export const PublishStatusEnum = {
    Published:{
        value: 1,
        label: i18nUtil.getKey('langMap.commons.enums.publishStatus.published')
    },
    Unpublished:{
        value: 0,
        label: i18nUtil.getKey('langMap.commons.enums.publishStatus.unpublished')
    }
};

/**
 * 枚举-文章审核状态
 * @type {{NotApproved: {label: string, value: number}, Approved: {label: string, value: number}, Approval: {label: string, value: number}}}
 */
export const ArticleAuditStateEnum = {
    NotApproved:{
        value: 0,
        label: i18nUtil.getKey('langMap.commons.enums.auditStatus.notApproved'),
    },
    Approval:{
        value: 1,
        label: i18nUtil.getKey('langMap.commons.enums.auditStatus.approval')
    },
    ReturnToModify:{
        value: 2,
        label: i18nUtil.getKey('langMap.commons.enums.auditStatus.returnToModify')
    },
    ApprovalFailed:{
        value: 8,
        label: i18nUtil.getKey('langMap.commons.enums.auditStatus.approvalFailed')
    },
    Approved:{
        value: 9,
        label: i18nUtil.getKey('langMap.commons.enums.auditStatus.approved')
    },
};
export const ArticleAuditTypeEnum = {
    Audit:{
        value: 1,
        label: i18nUtil.getKey('langMap.commons.enums.articleAuditType.audit')
    },
    AntiAudit:{
        value: 2,
        label: i18nUtil.getKey('langMap.commons.enums.articleAuditType.antiAudit')
    }
};

/**
 * 枚举-文章编辑器类型
 * @type {{Markdown: {label: string, value: number}}}
 */
export const ArticleEditorTypeEnum = {
    Markdown:{
        value: 1,
        label: i18nUtil.getKey('langMap.commons.enums.articleEditorType.markdown')
    }
};

export const ArticleSourceTypeEnum = {
    Original:{
        value: 1,
        label: i18nUtil.getKey('langMap.commons.enums.articleSourceType.original')
    },
    Reprint:{
        value: 2,
        label: i18nUtil.getKey('langMap.commons.enums.articleSourceType.reprint')
    }
};

/**
 * 枚举-文章编辑器类型
 * @type {{Markdown: {label: string, value: number}}}
 */
export const FeedBackEditorTypeEnum = {
    Markdown:{
        value: 1,
        label: i18nUtil.getKey('langMap.commons.enums.feedbackEditorType.markdown')
    }
};


/**
 * 枚举-反馈操作步骤
 * @type {{OperateProgressOfPublished: {label: string, value: number}, OperateProgressOfTobeFinish: {label: string, value: number}, OperateProgressOfProcessing: {label: string, value: number}, OperateProgressOfTobeVerified: {label: string, value: number}}}
 */
export const FeedBackOperateProgressEnum = {
    OperateProgressOfPublished:{
        value: 1,
        label: i18nUtil.getKey('langMap.commons.enums.feedBackOperateProgress.operateProgressOfPublished')
    },
    OperateProgressOfProcessing:{
        value: 2,
        label: i18nUtil.getKey('langMap.commons.enums.feedBackOperateProgress.operateProgressOfProcessing')
    },
    OperateProgressOfTobeVerified:{
        value: 3,
        label: i18nUtil.getKey('langMap.commons.enums.feedBackOperateProgress.operateProgressOfTobeVerified')
    },
    OperateProgressOfFinish:{
        value: 4,
        label: i18nUtil.getKey('langMap.commons.enums.feedBackOperateProgress.operateProgressOfFinish')
    },
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
    if (!keys || keys.length === 0) {
        return arr;
    }
    for (let idx in keys) {
        let key = keys[idx] ;
        let item = obj[key];
        if (!item) {
            console.info("key:【%s】为空", key);
            continue;
        }
        if (typeof item.value == "undefined" || typeof item.label == "undefined") {
            console.info("key:【%s】的value或label为空", key);
            continue;
        }
        arr.push({
            value: item.value,
            label: item.label
        });
    }
    return arr;
}


function listToSelectData(arr) {
    let newArr = [] ;
    for (let idx in arr) {
        let item = arr[idx];
        if (!item) {
            continue;
        }
        if (typeof item.value == "undefined" || typeof item.label == "undefined") {
            continue;
        }
        newArr.push({
            value: item.value,
            label: item.label
        });
    }
    return newArr;
}


/**
 * 枚举对象转map
 * @param obj
 * @returns {{}}
 */
function toValMap(obj) {
    const valMap = {};
    if (typeof obj != "object") {
        return valMap;
    }
    let keys = Object.keys(obj);
    if (!keys || keys.length === 0) {
        return valMap;
    }
    for (let idx in keys) {
        let key = keys[idx] ;
        let item = obj[key];
        if (typeof item == "undefined" || item == null) {
            console.info("key:【%s】为空", key);
            continue;
        }
        if ((typeof item.value == "undefined" || item.value == null)) {
            console.info("key:【%s】的value为空", key);
            continue;
        }
        if ((typeof item.label == "undefined" || item.label == null)) {
            console.info("key:【%s】的label为空", key);
            continue;
        }
        valMap[item.value] = item.label;
    }
    return valMap;
}

export const AllEnum = {
    JobTypeEnum,
    MenuUrlJumpTypeEnum,
    ModuleTypeEnum,
    RoleTypeEnum,
    PermissionTypeEnum,
    UserSexEnum,
    UserTypeEnum,
    LockStateEnum,
    SwitchEnum,
    FlagSwitchEnum,
    PublishStatusEnum,
    ArticleAuditStateEnum,
    ArticleAuditTypeEnum,
    ArticleEditorTypeEnum,
    ArticleSourceTypeEnum,
    FeedBackEditorTypeEnum,
    FeedBackOperateProgressEnum
};

export const EnumUtils = {
    toSelectData,
    listToSelectData,
    toValMap
};
