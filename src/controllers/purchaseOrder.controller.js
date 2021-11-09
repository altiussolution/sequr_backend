const { purchaseOrderModel, itemModel } = require('../models')
const { error_code, appRouteModels } = require('../utils/enum.utils')
const sendEmail = require('../middleware/sendmail.middleware')
const Email = require('email-templates')
var crontab = require('node-crontab')
var generator = require('generate-password')
const { createLog } = require('../middleware/crud.middleware')


exports.addPurchaseOrder = async (req, res) => {
  try {
    var purchase_order = new purchaseOrderModel(req.body)
    var isPurchaseOrderExist = await purchaseOrderModel
      .findOne({ $or: [{ po_number: req.body.po_number }] })
      .exec()
    if (!isPurchaseOrderExist) {
      purchase_order.save(err => {
        if (!err) {
          res.status(200).send({
            success: true,
            message: 'PurchaseOrder Created Successfully!'
          })
          createLog(req.headers['authorization'], 'PurchaseOrder', 2)
        } else {
          var errorMessage =
            err.code == error_code.isDuplication
              ? 'Duplication occured in PurchaseOrder po_number'
              : err
          res.status(200).send({
            success: false,
            message: errorMessage
          })
        }
      })
    } else {
      res.status(200).send({
        success: false,
        message: 'Given PurchaseOrder Already Exist'
      })
    }
  } catch (err) {
    res.status(201).send({ success: false, error: err.name })
  }
}

exports.getPurchaseOrder = (req, res) => {
  var searchString = req.query.searchString
  var query = searchString
    ? { active_status: 1, $text: { $search: searchString } }
    : { active_status: 1 }
  try {
    purchaseOrderModel
      .find(query)
      .populate('item_id')
      .populate('sub_category_id')
      .then(purchaseOrder => {
        res.status(200).send({ success: true, data: purchaseOrder })
      })
      .catch(error => {
        res.status(400).send({ success: false, error: error })
      })
  } catch (error) {
    res.status(201).send({ success: false, error: error })
  }
}

exports.updatePurchaseOrder = async (req, res) => {
  console.log(req.params.id)
  try {
    purchaseOrderModel
      .findByIdAndUpdate(req.params.id, req.body)
      .then(purchaseOrderUpdate => {
        res.status(200).send({
          success: true,
          message: 'PurchaseOrder Updated Successfully!'
          
        })
        createLog(req.headers['authorization'], 'PurchaseOrder', 1)
      })
      .catch(error => {
        res
          .status(200)
          .send({ success: false, error: error, message: 'An Error Occured' })
      })
  } catch (err) {
    res
      .status(200)
      .send({ success: false, error: err, message: 'An Error Catched' })
  }
}
exports.deletePurchaseOrder = (req, res) => {
  try {
    purchaseOrderModel
      .findByIdAndUpdate(req.params.id, { active_status: 0 })
      .then(purchaseOrder => {
        res.status(200).send({
          success: true,
          message: 'PurchaseOrder Deleted Successfully!'
        })
        createLog(req.headers['authorization'], 'PurchaseOrder', 0)
      })
      .catch(err => {
        res
          .status(200)
          .send({ success: false, message: 'PurchaseOrder Not Found' })
      })
  } catch (err) {
    res
      .status(200)
      .send({ success: false, error: err, message: 'An Error Catched' })
  }
}
exports.upload = async (req, res) => {
  try {
    if (req.file) {
      var filename = req.file.originalname
      res.status(200).send({
        message: 'PurchaseOrder Invoice Sucessfully',
        Path: `${req.file.destination.replace(
          './src/public/',
          appRouteModels.BASEURL
        )}/${filename}`
      })
    }
  } catch (err) {
    console.log(err)
    res.status(400).send(err)
  }
}
async function autoPurchaseOrder () {
  //   try {
  await itemModel
    .find({
      active_status: 1,
      returnable: false,
      $where: 'this.generate_po_on >= this.in_stock',
      auto_purchase_order: true
    })
    .populate('supplier.suppliedBy')
    .then(async items => {
      if (items.length > 0) {
        for await (let item of items) {
          console.log(item.supplier[0])
          const locals = {
            forgotPageLink: item.generate_po_for,
            adminName: `SEQUR RX`,
            logo: `${appRouteModels.BASEURL}/mailAssets/logobg.png`,
            background: `${appRouteModels.BASEURL}/mailAssets/bgbg.jpg`
          }
          const email = new Email()
          Promise.all([
            email.render('../src/templates/adminForgotPassword', locals)
          ]).then(async poOrder => {
            await sendEmail(
              item.supplier[0].suppliedBy.po_email,
              'PO GENEEATE',
              poOrder[0]
            )
            console.log('PO Mail Sent Succesfully')
          })

          //Add Purchase Order
          var poNumber = await generator.generate({
            length: 6,
            numbers: true
          })
          data = {
            category_id: item.category_id,
            sub_category_id: item.sub_category_id,
            item_id: item._id,
            supplier_id: item.supplier[0].suppliedBy._id,
            po_number: poNumber,
            quantity: item.generate_po_for,
            po_date: new Date(),
            description: 'Auto PO Generate'
          }
          var purchase_order = new purchaseOrderModel(data)
          await purchase_order.save()
        }
      }
    })
  //   } catch (error) {
  //   }
}
// autoPurchaseOrder()
// var jobId = crontab.scheduleJob('00 31 11 * * * ', async function () {
//     if (process.env.NODE_APP_INSTANCE == 0) {
//       console.log('*********** Cron Schedule Started ***********')
//       await autoPurchaseOrder()
//       console.log('*********** Mail has been sent ***********')
//     }
//   })
