let AuthUser = require('../middleware/auth.middleware')
let Utils = require('../utils/enum.utils')
exports.getUserById = ((req, res) => {
    res.json(Utils.Permissions)
    console.log(Utils.Permissions)
})
