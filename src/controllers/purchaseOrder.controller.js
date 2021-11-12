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
    purchase_order
      .save(err => {
        if (!err) {
          res.status(200).send({
            success: true,
            message: 'PurchaseOrder Created Successfully!'
          })
          createLog(req.headers['authorization'], 'PurchaseOrder', 2)
          purchaseOrderModel
            .findOne({
              active_status: 1,
              quantity: req.body.quantity,
              po_number: req.body.po_number
            })
            .populate('item_id')
            .populate('supplier_id')
            .then(purchaseOrder => {
              sendMailToSupplier(
                purchaseOrder.supplier_id.po_email,
                purchaseOrder.supplier_id.supplier_name,
                purchaseOrder.item_id.item_name,
                purchaseOrder.quantity,
                purchaseOrder.po_number
              )
            })
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
      .then(async purchaseOrderUpdate => {
        res.status(200).send({
          success: true,
          message: 'PurchaseOrder Updated Successfully!'
        })
        createLog(req.headers['authorization'], 'PurchaseOrder', 1)
        if (req.body.is_received == 2) {
          await itemModel
            .findByIdAndUpdate(req.body.item_id, {
              $inc: { in_stock: req.body.quantity }
            })
            .exec()
        }
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
  try {
    await itemModel
      .find({
        active_status: 1,
        returnable: false,
        $where: 'this.generate_po_on >= this.in_stock',
        auto_purchase_order: true
      })
      .populate('supplier.suppliedBy')
      .then(async items => {
        console.log(items)
        if (items.length > 0) {
          for await (let item of items) {
            console.log(item.supplier[0])
            var poNumber = await generator.generate({
              length: 6,
              numbers: true
            })

            if (item.supplier.length == 1) {
              //Send Mail To Supplier
              sendMailToSupplier(
                item.supplier[0].suppliedBy.po_email,
                item.supplier[0].suppliedBy.supplier_name,
                item.item_name,
                item.generate_po_for,
                poNumber
              )
              await createPo(1)
            } else if (item.supplier.length > 1) {
              await createPo(0)
            }
            //Send Mail To Supplier

            //Add Purchase Order
            async function createPo (auto_po_or_inprogress) {
              data = {
                category_id: item.category_id,
                sub_category_id: item.sub_category_id,
                item_id: item._id,
                supplier_id: item.supplier[0].suppliedBy._id,
                po_number: poNumber,
                quantity: item.generate_po_for,
                po_date: new Date(),
                is_auto_po: true,
                description: 'Auto PO Generate',
                is_received: auto_po_or_inprogress
              }
              var purchase_order = new purchaseOrderModel(data)
              await purchase_order.save()
            }
          }
        }
      })
  } catch (error) {}
}

//Send Mail To Supplier
async function sendMailToSupplier (mail, supplier, item, poQty, poNumber) {
  console.log(poNumber)
  const locals = {
    supplierName: supplier,
    itemName: item,
    poQty: poQty,
    poNumber: poNumber,
    logo: `${appRouteModels.BASEURL}/mailAssets/logobg.png`,
    background: `${appRouteModels.BASEURL}/mailAssets/bgbg.jpg`
  }
  const email = new Email()
  Promise.all([email.render('../src/templates/purchaseOrder', locals)]).then(
    async poOrder => {
      await sendEmail(mail, 'SEQUR RX Item Purchase Order', poOrder[0])
      console.log('PO Mail Sent Succesfully')
    }
  )
}

// autoPurchaseOrder()
var jobId = crontab.scheduleJob('00 26 10 * * * ', async function () {
  console.log('*********** Cron Schedule Started ***********')
  await autoPurchaseOrder()
  console.log('*********** Mail has been sent ***********')
})
