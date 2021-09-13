const route = require('express').Router()
const { RegionController } = require('../controllers')

route.get('/country', RegionController.country)
route.get('/state/:country_code', RegionController.state)
route.get('/city/:country_code/:state_code', RegionController.city)
route.get('/language', RegionController.language)
route.post('/city/add', RegionController.createCity)
route.post('/state/add', RegionController.createState)
module.exports = route
