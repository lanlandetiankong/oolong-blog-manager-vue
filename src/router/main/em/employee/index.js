const _import = require('~Router/_import_' + process.env.NODE_ENV)
//所挂载的 page 组件名
const parentRouterCompName = "EmployeePage" ;
let basePath = 'employee/' ;

const EmployeeRouter = [
    {
        path:basePath+'info',
        component:_import('index/em/employee/info/EmpInfoView'),
        name:'employeeInfo',
        meta:{
            title:'用户信息',icon:"user",keepAliveFlag:true,
            parentRouterCompName,
            selfCompName:'EmpInfoView'
        }
    },
    {
        path:basePath+'job/manager',
        component:_import('index/em/employee/job/EmpJobManagerView'),
        name:'employeeJob',
        meta:{
            title:'职务管理',icon:"user",keepAliveFlag:true,
            parentRouterCompName,
            selfCompName:'EmpJobManagerView'
        }
    },
    {
        path:basePath+'department/manager',
        component:_import('index/em/employee/department/DepartmentManagerView'),
        name:'departmentManager',
        meta:{
            title:'部门管理',icon:"gold",keepAliveFlag:true,
            parentRouterCompName,
            selfCompName:'DepartmentManagerView'
        }
    }
];
export default EmployeeRouter ;
