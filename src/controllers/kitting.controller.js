const { kitModel, stockAllocationModel, CartModel } = require('../models')
const cartModel = require('../models/cart.model')
var { appRouteModels, Cart } = require('../utils/enum.utils')

exports.createKit = async (req, res) => {
  var body = req.body
  try {
    var kit = new kitModel(body)
    var isKitExist = await kitModel.find({ kit_name: body.kit_name }).exec()
    if (isKitExist.length == 0) {
      kit.save(err => {
        if (!err) {
          res
            .status(200)
            .send({ success: true, message: 'Kit Created Successfully!' })
        } else {
          res.status(200).send({
            success: false,
            message: err
          })
        }
      })
    } else {
      res.status(200).send({
        success: false,
        message: 'Kit Name already exist'
      })
    }
  } catch (err) {
    console.log(err, 'error logged')
    res.status(201).send({ message: err.name })
  }
}

exports.getKit = (req, res) => {
  var offset =
    req.query.offset != undefined ? parseInt(req.query.offset) : false
  var limit = req.query.limit != undefined ? parseInt(req.query.limit) : false
  var searchString = req.query.searchString
  var query = searchString
    ? { active_status: 1, $text: { $search: searchString } }
    : { active_status: 1 }
  var _ = require('lodash')
  var binDatas = []
  var allocationDetais
  try {
    kitModel
      .find(query)
      .skip(offset)
      .limit(limit)
      .then(async kits => {
        for (let kit of kits) {
          var quantity = await kit.kit_data.reduce(
            (acc, curr) => acc + curr.qty,
            0
          ) // 6
          var index = 0
          var kitData = []
          for (let kitdata of kit.kit_data) {
              console.log(kitdata)
            itemDetails = {}
            allocationDetais = await stockAllocationModel
              .findOne({ category: kitdata.category_id, item: kitdata.item_id })
              .populate('item', ['item_name', 'image_path'])
              .populate('cube', ['cube_name', 'cube_id'])
              .populate('bin', ['bin_name', 'bin_id'])
              .populate('compartment', ['compartment_name', 'compartment_id'])
              .exec()
              kitItemAllocation = JSON.parse(JSON.stringify(allocationDetais))
              kitItemAllocation['kit_item_description'] = kitdata['description']
              kitItemAllocation['kit_item_qty'] = kitdata['qty']
              kitItemAllocation['kit_item_pack_id'] = kitdata['_id']
              kitItemAllocation['kit_item_id'] = kitdata['item_id']
            //   itemDetails['itemDetails'] = allocationDetais
            await kitData.push(kitItemAllocation)
            index++
          }
          await binDatas.push({
            _id: kit._id,
            kit_name: kit.kit_name,
            available_item: kit.kit_data.length,
            total_qty: quantity,
            // allocation : allocationDetais,
            // kit_data : [kit.kit_data[index]],
            kit_data: kitData,
            image_path: kit.image_path
          })
        }
        var grouped = await _.groupBy(binDatas, 'kit_name')

        kitNames = await Object.keys(grouped)
        console.log(kitNames)

        result = []
        for await (let kit of kitNames) {
          result.push(grouped[kit][0])
        }
        //console.log(binDatas)
        // if(kits.length == binDatas.length){
        res.status(200).send({ success: true, data: await result })
        // }
      })
      .catch(error => {
        console.log(error)
        res.status(400).send({ success: false, error: error })
      })
  } catch (error) {
    res.status(201).send({ success: false, error: error })
  }
}

exports.updateKit = async (req, res) => {
  let body = req.body
  try {
    var isKitExist = await kitModel.findOne({ kit_name: body.kit_name }).exec()
    if (!isKitExist || isKitExist._id == req.params.id) {
      kitModel
        .findByIdAndUpdate(req.params.id, body)
        .then(kitUpdate => {
          res
            .status(200)
            .send({ success: true, message: 'Kit Updated Successfully!' })
        })
        .catch(error => {
          res
            .status(200)
            .send({ success: false, error: error, message: 'An Error Occured' })
        })
    } else {
      res
        .status(200)
        .send({ success: false, message: 'Kit Name Alreadey exist' })
    }
  } catch (err) {
    res
      .status(200)
      .send({ success: false, error: err.name, message: 'An Error Catched' })
  }
}

exports.deleteKit = (req, res) => {
  try {
    kitModel
      .findByIdAndUpdate(req.params.id, { active_status: 0 })
      .then(kitDeactivate => {
        res
          .status(200)
          .send({ success: true, message: 'Kit Deactivated Successfully!' })
      })
      .catch(err => {
        res.status(200).send({ success: false, message: 'Kit Not Found' })
      })
  } catch (err) {
    res
      .status(200)
      .send({ success: false, error: err.name, message: 'An Error Catched' })
  }
}

exports.upload = (req, res) => {
  try {
    if (req.file) {
      var filename = req.file.originalname
      res.status(200).send({
        message: 'Kin Image Added Sucessfully',
        Path: `${req.file.destination.replace(
          './src/public/',
          appRouteModels.BASEURL
        )}/${filename}`
      })
    }
  } catch (err) {
    res.status(400).send(err)
  }
}

exports.addKitToCart = async (req, res) => {
  try {
    var userId = req.user.user_id
    var options = { upsert: true, new: true, setDefaultsOnInsert: true }
    var query = { user: userId }
    var kit_id = req.params.id
    var kitData = await kitModel.findById(kit_id, ['kit_data']).exec()
    var quantity = kitData.kit_data.reduce((acc, curr) => acc + curr.qty, 0) // 6
    cartModel
      .findOne(query, ['kitting', 'total_kitting_quantity', 'kit_status'])
      .then(isInCart => {
        var items = isInCart ? isInCart.kitting : []
        if (!isInCart) {
          items = {
            kitting: {
              kit_id: kit_id,
              qty: 1,
              item_quantity: quantity,
              kit_status: 1
            }
          }
          isInCart = items
        } else {
          var checkIsKitItemExist = items.filter(
            obj => obj.kit_id == kit_id && obj.kit_status == 1
          )
          if (checkIsKitItemExist.length > 0) {
            var index = items.findIndex(p => p.kit_id == kit_id)
            items[index].qty++
            items[index].item_quantity =
              items[index].item_quantity * items[index].qty
          } else {
            items.push({
              kit_id: kit_id,
              qty: 1,
              item_quantity: quantity,
              kit_status: 1
            })
          }
          isInCart.kitting = items
        }

        // console.log(isInCart,'141');

        isInCart.total_kitting_quantity = isInCart.kitting.reduce(
          (acc, curr) => acc + curr.item_quantity,
          0
        ) // 6;
        isInCart.kit_status = 1
        CartModel.findOneAndUpdate(query, isInCart, options)
          .then(is_create => {
            res
              .status(200)
              .send({ success: true, message: 'Successfully added into cart!' })
          })
          .catch(err => {
            console.log(err, '147')
            res.status(201).send({ status: false, message: err.name })
          })
      })
  } catch (err) {
    console.log(err)
  }
}

exports.deleteKitFromCart = async (req, res) => {
  var userId = req.user.user_id
  var options = { upsert: true, new: true, setDefaultsOnInsert: true }
  var cart_id = req.params.cart_id
  var kit_id = req.params.kit_id
  var query = { _id: cart_id, user: userId }
  try {
    CartModel.findOne(query)
      .then(data => {
        if (data) {
          var checkIsKitItemExist = data.kitting.findIndex(
            obj => obj.kit_id == kit_id && obj.kit_status == 1
          )
          if (checkIsKitItemExist !== -1) {
            data.kitting.splice(checkIsKitItemExist, 1)
          }

          data.total_kitting_quantity = data.kitting.reduce(function (
            sum,
            current
          ) {
            return current.kit_status == 1 ? sum + current.item_quantity : sum
          },
          0)

          CartModel.findOneAndUpdate(query, data, options)
            .then(is_create => {
              res.status(200).send({
                success: true,
                message: 'Successfully deleted from cart!'
              })
            })
            .catch(err => {
              res.status(201).send({ status: false, message: err.name })
            })
        } else {
          res.status(201).send({ status: false, message: 'No Kit Found' })
        }
      })
      .catch(err => {
        res.status(201).send({ status: false, message: err.name })
      })
  } catch (err) {
    res.status(201).send({ status: false, message: err.name })
  }
}

exports.getoldKit = (req, res) => {
  var offset =
    req.query.offset != undefined ? parseInt(req.query.offset) : false
  var limit = req.query.limit != undefined ? parseInt(req.query.limit) : false
  var searchString = req.query.searchString
  var query = searchString
    ? { active_status: 1, $text: { $search: searchString } }
    : { active_status: 1 }
  var _ = require('lodash')
  var binDatas = []
  var allocationDetais
  try {
    kitModel
      .find(query)
      .skip(offset)
      .limit(limit)
      .then(async kits => {
        for (let kit of kits) {
          var quantity = kit.kit_data.reduce((acc, curr) => acc + curr.qty, 0) // 6
          for (let kitdata of kit.kit_data) {
            allocationDetais = await stockAllocationModel
              .find({ category: kitdata.category_id, item: kitdata.item_id })
              .populate('item', ['item_name', 'image_path'])
              .populate('cube', ['cube_name', 'cube_id'])
              .populate('bin', ['bin_name', 'bin_id'])
              .populate('compartment', ['compartment_name', 'compartment_id'])
              .exec()
          }
          binDatas.push({
            _id: kit._id,
            kit_name: kit.kit_name,
            available_item: kit.kit_data.length,
            total_qty: quantity,
            kit_data: allocationDetais,
            image_path: kit.image_path
          })
        }
        if (kits.length == binDatas.length) {
          res.status(200).send({ success: true, data: binDatas })
        }
      })
      .catch(error => {
        res.status(400).send({ success: false, error: error })
      })
  } catch (error) {
    res.status(201).send({ success: false, error: error })
  }
}
