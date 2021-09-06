let route = require('express').Router()
var controllers = require('../controllers/index')

route.get('/country', controllers.RegionController.country)
route.get('/state', controllers.RegionController.state)
route.get('/city', controllers.RegionController.city)
route.get('/language', controllers.RegionController.language)

//country
//state
//language
//city


module.exports = route