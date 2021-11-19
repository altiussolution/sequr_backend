let route = require('express').Router()
const { RolesController } = require('../controllers/index');
const auth = require("../middleware/auth.middleware");

route.post('/add', auth, RolesController.createRole)
route.get('/get', auth, RolesController.getRoles)
route.delete('/delete/:id', auth, RolesController.deleteRole)
route.put('/update/:id', auth, RolesController.updateRole)
route.put('/permission/add/:id', auth, RolesController.addPermission)
route.put('/permission/update/:id', auth, RolesController.updatePermission)
route.get('/permission/get', auth, RolesController.getPermission)
route.put('/permission/delete/:id', auth, RolesController.deletePermission)
route.get('/permission/list/get',auth, RolesController.listPermission)
route.get('/getRolesfilter', auth, RolesController.getRolesfilter)
route.post('/addSuperAdmin', RolesController.createRole)
route.get('/getSuperAdmin', RolesController.getRoles)



module.exports = route
