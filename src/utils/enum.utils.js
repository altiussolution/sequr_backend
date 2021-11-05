const enumVariables = {
    Entities : {
        Users : 'users'
    },
    appRouteModels : {
        BASEURL : "http://13.232.128.227:4500/",
    },
    Messages : {
        Success : "Created sucess"
    },
    Cart : {
        In_Cart : 1,
        Has_Taken : 2,
        Kept : 3
    },
    Permissions : {
        Employee : [ 
            'employee_get',
            'employee_update',
            'employee_add',
            'employee_delete',
            'employee_permission',
        ],
        Item : [
            'item_get',
            'item_update',
            'item_add',
            'item_delete',
            'item_permission'
        ],
        Machine : [
            'machine_get',
            'machine_update',
            'machine_add',
            'machine_delete',
            'machine_permission'
        ],
        Kitting : [
            'kitting_get',
            'kitting_update',
            'kitting_add',
            'kitting_delete',
            'kitting_permission'
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
    },
    action : {
        created : 2,
        updated : 1,
        deleted : 0
    }
}

module.exports = enumVariables;
