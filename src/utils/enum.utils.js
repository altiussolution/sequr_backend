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
        Users : [
            'Users_Edit',
            'Users_Create',
            'Users_Delete',
            'Users_View',
            'Users_Permission',
        ],
        Item : [
            'Item_Edit',
            'Item_Create',
            'Item_Delete',
            'Item_View',
            'Item_Permission',
        ],
        Machine_Access : [
            'Machine_Access_View',
            'Machine_Access_Create',
            'Machine_Access_Edit',
            'Machine_Access_Delete',
            'Machine_Access_Permission'
        ],
        Kitting_Access : [
            'Kitting_Access_View',
            'Kitting_Access_Edit',
            'Kitting_Access_Create',
            'Kitting_Access_Delete',
            'Kitting_Access_Permission'
        ],
        Return : [
            'Return_View',
            'Return_Edit',
            'Return_Create',
            'Return_Delete',
            'Return_Permission'
        ],
        Report : [
            'Report_View',
            'Report_Edit',
            'Report_Create',
            'Report_Delete',
            'Report_Permission'
        ],
        Log : [
            'Log_View',
            'Log_Edit',
            'Log_Create',
            'Log_Delete',
            'Log_Permission',
        ]
        
    }
}

module.exports = enumVariables;
