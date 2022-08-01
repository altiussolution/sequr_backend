const { CartModel, itemModel, stockAllocationModel, storeModel } = require('../models')
const AddCart = require('../services/cart.services')
const { Cart } = require('../utils/enum.utils')
var ObjectId = require('mongodb').ObjectID
const { createLog } = require('../middleware/crud.middleware')
const cartModel = require('../models/cart.model')

exports.addToCart = (req, res) => {
  var body = req.body
  var userId = req.user.user_id
  var options = { upsert: true, new: true, setDefaultsOnInsert: true }
  var query = { user: userId }
  stockAllocationModel
    .findOne({ item: body.item }, ['_id', 'quantity'])
    .then(async isQuantity => {
      //, quantity : {$gte: body.qty}
      if (!isQuantity) {
        res
          .status(200)
          .send({ status: true, message: `Stock Not Yet Allocated` })
      } else if (body.qty > isQuantity.quantity) {
        res.status(200).send({
          status: true,
          message: `Available quantity for this item is ${isQuantity.quantity}`
        })
      } else {
        var productId = body.item
        // var product = await itemModel.findById(productId).exec()
        CartModel.findOne(query)
          .then(CartData => {
            var cart = AddCart({
              cartData: CartData ? CartData : body,
              item: productId,
              allocation: isQuantity._id,
              userQty: body.total_quantity
            })

            CartModel.findOneAndUpdate(query, cart, options)
              .then(is_create => {
                res.status(200).send({
                  success: true,
                  message: 'Successfully added into cart!'
                })
              })
              .catch(err => {
                res.status(201).send({ status: false, message: err.name })
              })
          })
          .catch(err => {
            console.log(err, 'err occured')
          })
      }
    })
    .catch(err => {
      res.status(201).send({ status: false, message: err.name })
    })
}

exports.updateCart = async (req, res) => {
  try {
    var cartId = req.body.cart_id
    var qty = req.body.qty
    var itemId = req.body.item ? req.body.item : req.body.update_item
    var kitId = req.body.kit ? req.body.kit : req.body.update_kit_id
    var userId = req.user.user_id
    var allocation = req.body.allocation
    var cart_status = req.body.cart_status
    var kit_status = req.body.kit_status
    var cartUpdate
    var isErrResponse = false

    var data = await CartModel.findOne({
      _id: cartId,
      user: userId,
      status: 1
    }).exec() //, cart_status : Cart.In_Cart
    if (!data) {
      isErrResponse = true
      res.status(200).send({ message: 'Cart not found or Deleted' })
    } else if (qty) {
      cartUpdate = AddCart({
        cartData: data,
        item: itemId,
        allocation: allocation,
        userQty: qty,
        updateQty: true
      })
    } else if (cart_status) {
      var index = data.cart.findIndex(p => p._id == itemId)
      data.cart[index].cart_status = cart_status
      cartUpdate = {
        cart: data.cart,
        total_quantity: data.total_quantity - data.cart[index].qty
      }
    } else if (kit_status) {
      var index = data.kitting.findIndex(p => p._id == kitId)
      data.kitting[index].kit_status = kit_status
      cartUpdate = {
        kitting: data.kitting,
        total_kitting_quantity:
          data.total_kitting_quantity - data.kitting[index].qty,
        updated_at: Date.now
      }
    }

    if (!isErrResponse) {
      try {
        CartModel.findByIdAndUpdate(cartId, cartUpdate)
          .then(cartUpdate => {
            res
              .status(200)
              .send({ success: true, message: 'Cart Updated Successfully!' })
          })
          .catch(error => {
            res.status(200).send({
              success: false,
              error: error,
              message: 'An Error Occured'
            })
          })
      } catch (err) {
        res
          .status(200)
          .send({ success: false, error: err, message: 'An Error Catched' })
      }
    }
  } catch (err) {
    console.log(err)
    res.status(201).send({ status: false, message: err.name })
  }
}

// exports.myCart = (req, res) => {
//   try {
//     var userId = ObjectId("615d38fcb3b43020c778f381")

//     CartModel.find({ user: userId, cart_status: Cart.In_Cart }, [
//       'cart',
//       'total_quantity',
//       'cart_status'
//     ])
//       // .populate('cart.item', ['item_name', 'image_path'])
//       .then(mycart => {
//         res.status(200).send(mycart)
//       })
//       .catch(err => {
//         console.log(err, 'catch error')
//       })
//   } catch (err) {
//     res.status(200).send({ status: false, message: err.name })
//   }
// }

// exports.itemHistory = async (req, res) => {
//   try {
//     var userId = req.user.user_id
//     var CartHistory = await CartModel.find({ user: userId }, [
//       'cart',
//       'updated_at'
//     ])
//       .populate('cart.item', ['item_name', 'image_path'])
//       .exec()
//     var KitHistory = await CartModel.find({ user: userId }, [
//       'kitting',
//       'updated_at'
//     ])
//       .populate({
//         path: 'kitting.kit_id',
//         populate: {
//           path: 'kit_data.item_id'
//         }
//       })
//       .exec()
//     var kitData = []
//     for await (let [i, item] of KitHistory.entries()) {
//       for (let [j, val] of item.kitting.entries()) {
//         for (let [k, data] of val.kit_id.kit_data.entries()) {
//           stockData = await stockAllocationModel
//             .find({ item: data.item_id._id })
//             .populate('item', ['item_name', 'image_path'])
//             .populate('cube', ['cube_name', 'cube_id'])
//             .populate('bin', ['bin_name', 'bin_id'])
//             .populate('compartment', ['compartment_name', 'compartment_id'])
//             .exec()
//           kitData.push({
//             cart_id: item._id,
//             update_kit_id: val._id,
//             kit_name: val.kit_id.kit_name,
//             kit_item_details: stockData,
//             created_at: val.created_at,
//             updated_at: val.updated_at
//           })
//         }
//       }
//     }

//     res.status(200).send({ status: true, Cart: CartHistory, Kits: kitData })
//   } catch (err) {
//     res.status(201).send({ status: false, message: err.name })
//   }
// }

exports.return = async (req, res) => {
  var body = req.body
  options = { upsert: true, new: false, setDefaultsOnInsert: true }
  var return_items = body.return_items
  var cart_status = body.cart_status
  var kit_status = body.kit_status
  try {
    if (cart_status) {
      CartModel.findById(body.cart_id, ['cart', 'total_quantity']).then(
        values => {
          for (var id of return_items) {
            var index = values.cart.findIndex(p => p._id == id)
            values.cart[index]['cart_status'] = cart_status
            values.total_quantity =
              values.total_quantity - values.cart[index]['qty']
          }
          CartModel.findByIdAndUpdate(body.cart_id, values, (err, data) => {
            if (data) {
              res
                .status(201)
                .send({ status: false, message: 'Returned Sucessfully' })
            } else {
              res
                .status(201)
                .send({ status: false, message: 'Nothing to modify' })
            }
          })
        }
      )
    } else if (kit_status) {
      CartModel.findById(body.cart_id, [
        'kitting',
        'total_kitting_quantity'
      ]).then(values => {
        for (var id of return_items) {
          var index = values.kitting.findIndex(p => p._id == id)
          values.kitting[index]['kit_status'] = kit_status
          values.total_kitting_quantity =
            values.total_kitting_quantity - values.kitting[index]['qty']
        }
        console.log(values)
        CartModel.findByIdAndUpdate(body.cart_id, values, (err, data) => {
          if (data) {
            res
              .status(201)
              .send({ status: false, message: 'Returned Sucessfully' })
          } else {
            res
              .status(201)
              .send({ status: false, message: 'Nothing to modify' })
          }
        })
      })
    }
  } catch (err) {
    console.log(err)
    res.status(201).send({ status: false, message: err.name })
  }
}

exports.deleteItemFromCart = (req, res) => {
  var cart_id = req.body.cart_id
  var item_id = req.body.item_id
  var userId = req.user.user_id
  var options = { upsert: true, new: true, setDefaultsOnInsert: true }
  var query = { _id: cart_id, user: userId }
  try {
    CartModel.findOne(query)
      .then(data => {
        if (data) {
          for (let id of item_id) {
            var checkIsKitItemExist = data.cart.findIndex(
              obj => obj.item == id && obj.cart_status == 1
            )
            if (checkIsKitItemExist !== -1) {
              data.cart.splice(checkIsKitItemExist, 1)
            }
          }

          data.total_quantity = data.cart.reduce(function (sum, current) {
            return current.cart_status == 1 ? sum + current.qty : sum
          }, 0)
          CartModel.findOneAndUpdate(query, data, options)
            .then(is_create => {
              res.status(200).send({
                success: true,
                message: 'Successfully item deleted from cart!'
              })
            })
            .catch(err => {
              console.log(err)
              res.status(201).send({ status: false, message: err.name })
            })
        }
      })
      .catch(err => {
        console.log(err)
        res.status(201).send({ status: false, message: err.name })
      })
  } catch (err) {
    console.log('hit 3')
    res.status(201).send({ status: false, message: err.name })
  }
}

/// ************************** Arunkumar ********************** ////////////

exports.updateCartAfterReturnTake = async (req, res) => {
  var body = req.body
  options = { upsert: true, new: false, setDefaultsOnInsert: true }
  var take_item = body.take_items
  var untaken_or_returned_items = body.untaken_or_returned_items
  var cart_status = body.cart_status
  var kit_status = body.kit_status
  var kit_cart_id = body.kit_cart_id
  if (cart_status == 2 || kit_status == 2) {
    var current_status = 'Taken'
  } else if (cart_status == 3 || kit_status == 3) {
    var current_status = 'Return'
  }
  if (cart_status) {
    // update cart document
    CartModel.findById(body.cart_id, ['cart', 'total_quantity']).then(
      async values => {
        for await (var id of take_item) {
          var index = values.cart.findIndex(p => p._id == id.cart_id)
          values.cart[index]['cart_status'] = cart_status
          if (cart_status == 3 && id.qty < values.cart[index]['qty']) {
            values.cart[index]['cart_status'] = 2
            values.cart[index]['qty'] =
              parseInt(values.cart[index]['qty']) - parseInt(id.qty)
          }
          values.total_quantity =
            parseInt(values.total_quantity) -
            parseInt(values.cart[index]['qty'])
        }
        values.cart = await dedup_and_sum(values.cart, 'item', 'cart_status')
        CartModel.findByIdAndUpdate(body.cart_id, values, (err, data) => {
          if (err) {
            console.log(err.name)
          }
        })
      }
    )
    //update stockAllocation Model

    for await (let item of take_item) {
      let stockAllocationItems = await stockAllocationModel
        .findById(ObjectId(item.stock_allocation_id))
        .exec()
      const current_quantity = stockAllocationItems.quantity
      if (cart_status == 2) {
        if (stockAllocationItems.quantity >= item.qty) {
          stockAllocationItems.quantity =
            parseInt(stockAllocationItems.quantity) - parseInt(item.qty)
        } else if (stockAllocationItems.quantity < item.qty) {
          stockAllocationItems.quantity = 0
        }
        userPoHistory = []

        // Creat Purchase Order History in Logs
        if (stockAllocationItems.po_history.length > 0) {
          isTakenQuntityInPO = false // Variable to break while loop
          totalPurchaseOrder = []
          var remainingQuantity = current_quantity // Toatal Stock available on cub now eg: 6 ,4
          poHistory = 0 // Loop Through Each PO History

          while (
            !isTakenQuntityInPO &&
            stockAllocationItems.po_history.length > poHistory
          ) {
            console.log('while loop  ' + poHistory)
            console.log(
              stockAllocationItems.po_history[poHistory].allocated_qty +
                ' >= ' +
                remainingQuantity
            )
            if (
              stockAllocationItems.po_history[poHistory].allocated_qty >= // 2 > 6
              remainingQuantity
            ) {
              // 2 > 6
              poLast = await JSON.parse(JSON.stringify(stockAllocationItems.po_history[poHistory]))
              poLast['allocated_qty'] = remainingQuantity
              await totalPurchaseOrder.push(
                poLast
              )
              isTakenQuntityInPO = true
            } else {
              remainingQuantity =
                remainingQuantity -
                stockAllocationItems.po_history[poHistory].allocated_qty
              // 6 - 2 = 4
              await totalPurchaseOrder.push(
                stockAllocationItems.po_history[poHistory]
              )
            }
            poHistory++
          }
          totalPurchaseOrder = await totalPurchaseOrder.reverse()
          console.log(totalPurchaseOrder)
          // totalPurchaseOrder = totalPurchaseOrder.reverse();
          console.log(totalPurchaseOrder)

          userTakenQuantity = parseInt(item.qty) // User Taken Quantity
          isPoItemSubstracted = false
          poIterate = 0
          while (
            !isPoItemSubstracted &&
            totalPurchaseOrder.length > poIterate
          ) {
            console.log('while loop  ' + poIterate)
            if (
              totalPurchaseOrder[poIterate].allocated_qty >= userTakenQuantity
            ) {
              // 2 > 1
              await userPoHistory.push({
                po_id: totalPurchaseOrder[poIterate].po_id,
                used_item_qty: userTakenQuantity
              })
              isPoItemSubstracted = true
            } else {
              let userTakenQuantityInPO =
                totalPurchaseOrder[poIterate].allocated_qty // 2
              await userPoHistory.push({
                po_id: totalPurchaseOrder[poIterate].po_id,
                used_item_qty: userTakenQuantityInPO
              }) // {po_id : PO1, qty : 2}
              userTakenQuantity = userTakenQuantity - userTakenQuantityInPO // 3 - 2
            }
            poIterate++
          }
        }
        console.log(userPoHistory)
        // Creat Purchase Order History in Logs

        createLog(
          req.headers['authorization'],
          'Machine Items',
          'Taken',
          stockAllocationItems._id,
          item.qty,
          userPoHistory,
          stockAllocationItems.item
        )
      } else if (cart_status == 3) {
        stockAllocationItems.quantity =
          parseInt(stockAllocationItems.quantity) + parseInt(item.qty)
        createLog(
          req.headers['authorization'],
          'Machine Items',
          'Return',
          stockAllocationItems._id,
          item.qty,
          stockAllocationItems.item
        )
      }
      stockAllocationItems.updated_at = new Date()
      await stockAllocationModel
        .findByIdAndUpdate(item.stock_allocation_id, stockAllocationItems)
        .exec()
      decrementStockDraw(item.stock_allocation_id)
    }

    res
      .status(201)
      .send({ status: true, message: `${current_status} Sucessfully` })
  }
  if (kit_status) {
    var untaken_or_unreturned_items_list = []
    if (untaken_or_returned_items.length > 0) {
      untaken_or_returned_items.map(async function (k) {
        await untaken_or_unreturned_items_list.push(k.item_id)
      })
    }

    var returned_item_list = []
    take_item.map(async function (k) {
      await returned_item_list.push(k.item_id)
    })
    console.log(untaken_or_unreturned_items_list)
    console.log(returned_item_list)

    // update cart document
    CartModel.findById(body.cart_id, ['kitting', 'total_quantity']).then(
      async values => {
        var index = values.kitting.findIndex(
          p => p._id == take_item[0].kit_cart_id
        )
        console.log('index       ' + index)

        values.kitting[index]['kit_status'] = kit_status
        if (kit_status == 3 && untaken_or_unreturned_items_list.length > 0) {
          values.kitting[index]['kit_status'] = 2
          values.kitting[index]['untaken_and_returned_items'] = values.kitting[
            index
          ]['untaken_and_returned_items'].concat(returned_item_list)
          // values.kitting[index]['qty'] =
          //   parseInt(values.kitting[index]['qty']) -
          //   parseInt(take_item[0].kit_qty)
        }

        // Add Un Taken Items In the Kit
        if (kit_status == 2) {
          values.kitting[index]['untaken_and_returned_items'] = values.kitting[
            index
          ]['untaken_and_returned_items'].concat(
            untaken_or_unreturned_items_list
          )
        }
        values.total_quantity =
          parseInt(values.total_quantity) -
          parseInt(values.kitting[index]['qty'])
        // values.kitting = await dedup_and_sum(
        //   values.kitting,
        //   'kit_id',
        //   'kit_status'
        // )
        CartModel.findByIdAndUpdate(body.cart_id, values, (err, data) => {
          if (err) {
            console.log(err.name)
          }
        })
      }
    )
    //update stockAllocation Model

    for await (let item of take_item) {
      let stockAllocationItems = await stockAllocationModel
        .findById(ObjectId(item.stock_allocation_id))
        .exec()
      console.log(stockAllocationItems)
      if (kit_status == 2) {
        if (stockAllocationItems.quantity >= item.qty) {
          stockAllocationItems.quantity =
            parseInt(stockAllocationItems.quantity) -
            parseInt(item.qty) * parseInt(take_item[0].kit_qty)
        } else if (stockAllocationItems.quantity < item.qty) {
          stockAllocationItems.quantity = 0
        }

        userPoHistory = []

        // Creat Purchase Order History in Logs
        if (stockAllocationItems.po_history.length > 0) {
          isTakenQuntityInPO = false // Variable to break while loop
          totalPurchaseOrder = []
          var remainingQuantity = current_quantity // Toatal Stock available on cub now eg: 6 ,4
          poHistory = 0 // Loop Through Each PO History

          while (!isTakenQuntityInPO) {
            console.log('while loop  ' + poHistory)
            console.log(
              stockAllocationItems.po_history[poHistory].allocated_qty +
                ' >= ' +
                remainingQuantity
            )
            if (
              stockAllocationItems.po_history[poHistory].allocated_qty >= // 2 > 6
              remainingQuantity
            ) {
              // 2 > 6
              poLast = await JSON.parse(JSON.stringify(stockAllocationItems.po_history[poHistory]))
              poLast['allocated_qty'] = remainingQuantity
              await totalPurchaseOrder.push(
                poLast
              )
              isTakenQuntityInPO = true
            } else {
              remainingQuantity =
                remainingQuantity -
                stockAllocationItems.po_history[poHistory].allocated_qty
              // 6 - 2 = 4
              await totalPurchaseOrder.push(
                stockAllocationItems.po_history[poHistory]
              )
            }
            poHistory++
          }

          totalPurchaseOrder = await totalPurchaseOrder.reverse()
          userTakenQuantity = parseInt(item.qty) // User Taken Quantity
          isPoItemSubstracted = false
          poIterate = 0
          while (!isPoItemSubstracted) {
            console.log('while loop  ' + poIterate)
            if (
              totalPurchaseOrder[poIterate].allocated_qty >= userTakenQuantity
            ) {
              // 2 > 1
              await userPoHistory.push({
                po_id: totalPurchaseOrder[poIterate].po_id,
                used_item_qty: userTakenQuantity
              })
              isPoItemSubstracted = true
            } else {
              let userTakenQuantityInPO =
                totalPurchaseOrder[poIterate].allocated_qty // 2
              await userPoHistory.push({
                po_id: totalPurchaseOrder[poIterate].po_id,
                used_item_qty: userTakenQuantityInPO
              }) // {po_id : PO1, qty : 2}
              userTakenQuantity = userTakenQuantity - userTakenQuantityInPO // 3 - 2
            }
            poIterate++
          }
        }
        // Creat Purchase Order History in Logs
        createLog(
          req.headers['authorization'],
          'Machine Item',
          'Taken',
          stockAllocationItems._id,
          item.qty,
          userPoHistory,
          stockAllocationItems.item
        )
      } else if (kit_status == 3) {
        stockAllocationItems.quantity =
          parseInt(stockAllocationItems.quantity) +
          parseInt(item.qty) * parseInt(take_item[0].kit_qty)
        createLog(
          req.headers['authorization'],
          'Machine Item',
          'Return',
          stockAllocationItems._id,
          item.qty
        )
      }
      stockAllocationItems.updated_at = new Date()
      await stockAllocationModel
        .findByIdAndUpdate(item.stock_allocation_id, stockAllocationItems)
        .exec()
      decrementStockDraw(item.stock_allocation_id)
    }

    res
      .status(201)
      .send({ status: true, message: `${current_status} Sucessfully` })
  }
}

exports.myCart = async (req, res) => {
  try {
    // var userId = ObjectId('615d38fcb3b43020c778f381')
    var userId = req.query.user_id
    var company_id = req.query.company_id
    cartItems = await CartModel.find({ user: userId, status: Cart.In_Cart,cartinfo : 1 }, [
      'cart',
      'total_quantity',
      'cart_status'
    ])
      .populate('cart.item', ['item_name','image', 'image_path'])
      .exec()
    mycartData = []
    cartItems = JSON.parse(JSON.stringify(cartItems))
    var i = 0
    for await (let item of cartItems[0]['cart']) {
      let data = item
      stockData = await stockAllocationModel
        .findOne({ item: data.item._id })
        .populate('cube', ['cube_name', 'cube_id'])
        .populate('bin', ['bin_name', 'bin_id'])
        .populate('compartment', ['compartment_name', 'compartment_id'])
        .exec()
      // console.log(stockData)
      cartItems[0]['cart'][i]['item_details'] = stockData

      i++
    }
    res.status(200).send(cartItems)
  } catch (err) {
    console.log(err)
    res.status(200).send({ status: false, message: err })
  }
}

exports.itemHistory = async (req, res) => {
  try {
    console.log(req.query)
    var userId = req.query.user_id
    // var userId = ObjectId('615d38fcb3b43020c778f381')
    var CartHistory = await CartModel.find({ user: userId }, [
      'cart',
      'updated_at'
    ])
      .populate('cart.item', ['item_name', 'image_path'])
      .exec()

    CartHistory = JSON.parse(JSON.stringify(CartHistory))
    var i = 0
    for await (let item of CartHistory[0]['cart']) {
      let data = item
      stockData = await stockAllocationModel
        .findOne({ item: data.item._id })
        .populate('cube', ['cube_name', 'cube_id'])
        .populate('bin', ['bin_name', 'bin_id'])
        .populate('compartment', ['compartment_name', 'compartment_id'])
        .exec()
      CartHistory[0]['cart'][i]['item_details'] = stockData

      i++
    }
    var KitHistory = await CartModel.find({ user: userId }, ['kitting', '_id'])
      .populate({
        path: 'kitting.kit_id',
        populate: {
          path: 'kit_data.item_id'
        }
      })
      .exec()
    var kitData = []
    for await (let [i, item] of KitHistory.entries()) {
      for (let [j, val] of item.kitting.entries()) {
        stockDataArray = []
        for (let [k, data] of val.kit_id.kit_data.entries()) {
          stockData = await stockAllocationModel
            .findOne({ item: data.item_id._id })
            .populate('item', ['_id, item_name', 'image_path'])
            .populate('cube', ['cube_name', 'cube_id'])
            .populate('bin', ['bin_name', 'bin_id'])
            .populate('compartment', ['compartment_name', 'compartment_id'])
            .exec()
          stockDataJson = JSON.parse(JSON.stringify(stockData))
          stockDataJson['alloted_item_qty_in_kit'] = data.qty
          if (val.untaken_and_returned_items.includes(stockData.item._id)) {
            stockDataJson['alloted_item_qty_in_kit'] = 0
          }

          await stockDataArray.push(stockDataJson)
        }
        kitData.push({
          cart_id: item._id,
          update_kit_id: val._id,
          kit_id: val.kit_id,
          kit_cart_id: val._id,
          kit_status: val.kit_status,
          qty: val.qty,
          kit_name: val.kit_id.kit_name,
          kit_item_details: stockDataArray,
          created_at: val.created_at,
          updated_at: val.updated_at
        })
      }
    }

    res.status(200).send({ status: true, Cart: CartHistory, Kits: kitData })
  } catch (err) {
    res.status(204).send({ status: false, message: err })
    console.log(err)
  }
}

async function dedup_and_sum (arr, prop, prop1) {
  var seen = {},
    order = []
  await arr.forEach(async function (o) {
    o[item] = `${o[prop]} - ${o[prop1]}`
    var item = `${o[prop]} - ${o[prop1]}`
    if (item in seen) {
      // keep running sum of qty
      var qty = parseInt(seen[item].qty) + parseInt(o.qty)
      // keep this newest record's values
      seen[item] = o
      // upitem[118805291], qty=432, instock=truedate qty to our running total
      seen[item].qty = qty
      // keep track of ordering, having seen again, push to end
      await order.push(order.splice(order.indexOf(item), 1))
    } else {
      seen[item] = o
      await order.push(item)
    }
  })

  return order.map(function (k) {
    delete seen[k].undefined
    return seen[k]
  })
}

/// ************************** Arunkumar ********************** ////////////

function decrementStockDraw (_id) {
  try {
    stockAllocationModel
      .updateOne({ quantity: { $lt: 0 } }, { $set: { quantity: 0 } })
      .exec()
    console.log(' *** item decremented to zero *** ')
  } catch (err) {
    console.log(err)
  }
}

///////////*********Prakash ***************************///////

function kitdetails () {
  try {
 
 
    
   storeModel.findOne({cartinfo : 1
   }).sort({$natural:-1}).limit(1)
  .then (output => {
 
  
 
   for (var i = 0; i < output.data.kitting.length; i++ ){
     var kitqty1 = output.data.kitting[i].qty
     //var total_quantity1 = output.data.total_quantity
     var kitstatus1 = output.data.kitting[i].kit_status
     var kitid1 = `kitting.${i}.qty`
     var kitstatus = `kitting.${i}.kit_status`
     
   
     //project(cartid,cartqty1)
    // var cartcartqty1 = cart[i].qty
    var query = {[`${kitid1}`] : kitqty1,[`${kitstatus}`] : kitstatus1,total_quantity: total_quantity1};
   //var query = { "cart.0.qty" : cartqty1,"cart.0.cart_status" : cartstatus1}
   console.log(query)
   cartModel.findOneAndUpdate(
     {user: output.user,company_id: output.company_id},query
     
     ).then(update => {
       
      // console.log(query)
           console.log(update)
              })
 
     }
    
   
 
               
        
         })
       }catch (err) {
         console.log(err)
       }
 }
 
         kitdetails()