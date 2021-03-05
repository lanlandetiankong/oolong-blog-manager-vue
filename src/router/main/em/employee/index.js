const _import = require('~Router/_import_' + process.env.NODE_ENV)
let basePath = 'employee/' ;

const EmployeeRouter = [
    {
        path:basePath+'info',
        component:_import('index/em/employee/info/EmpInfoView'),
        name:'employeeInfo',
        meta:{
            title:'用户信息',icon:"user",keepAliveFlag:true,
            selfCompName:'EmpInfoView'
        }
    },
    {
        path:basePath+'job/manager',
        component:_import('index/em/employee/job/EmpJobManagerView'),
        name:'employeeJob',
        meta:{
            title:'职务管理',icon:"user",keepAliveFlag:true,
            selfCompName:'EmpJobManagerView'
        }
    },
    {
        path:basePath+'department/manager',
        component:_import('index/em/employee/department/DepartmentManagerView'),
        name:'departmentManager',
        meta:{
            title:'部门管理',icon:"gold",keepAliveFlag:true,
            selfCompName:'DepartmentManagerView'
        }
    }
];
export default EmployeeRouter ;
