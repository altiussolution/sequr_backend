let route = require('express').Router()
var controllers = require('../controllers/index')

route.get('/get_country', controllers.RegionController.get_country)
route.get('/get_state', controllers.RegionController.get_state)
route.get('/get_city', controllers.RegionController.get_city)
route.get('/get_language', controllers.RegionController.get_language)




module.exports = route