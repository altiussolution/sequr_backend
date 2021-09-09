let route = require('express').Router()
var controllers = require('../controllers/index')

route.get('/country', controllers.RegionController.country)
route.get('/state/:country_code', controllers.RegionController.state)
route.get('/city/:country_code/:state_code', controllers.RegionController.city)
route.get('/language', controllers.RegionController.language)
route.post('/city/add', controllers.RegionController.createCity)
route.post('/state/add', controllers.RegionController.createState)

//country
//state
//language
//city


module.exports = route