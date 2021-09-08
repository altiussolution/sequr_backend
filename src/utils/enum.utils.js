const enumVariables = {
    Entities : {
        Users : 'users'
    },
    appRouteModels : {
        BASEURL : "http://15.206.191.104:4200/",
    },
    Messages : {
        Success : "Created sucess"
    },
    Permissions : {
        Employee : [ 
            'employee_update',
            'employee_add',
            'employee_delete',
            'employee_get',
            'employee_permission',
        ],
        Item : [
            'item_update',
            'item_add',
            'item_delete',
            'item_get',
            'item_permission',
        ],
        Machine_Access : [
            'machine_access_get',
            'machine_access_add',
            'machine_access_update',
            'machine_access_delete',
            'machine_access_permission'
        ],
        Kitting_Access : [
            'kitting_access_get',
            'kitting_access_update',
            'kitting_access_add',
            'kitting_access_delete',
            'kitting_access_permission'
        ],
        Return : [
            'return_get',
            'return_update',
            'return_add',
            'return_delete',
            'return_permission'
        ],
        Report : [
            'report_get',
            'report_update',
            'report_add',
            'report_delete',
            'report_permission'
        ],
        Log : [
            'log_get',
            'log_update',
            'log_add',
            'log_delete',
            'log_permission',
        ]
        
    },
    error_code : {
        isDuplication : 11000
    }
}

module.exports = enumVariables;
