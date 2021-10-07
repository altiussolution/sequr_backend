
const { UserModel,branchModel,itemModel} = require("../models");
const { User } = require("../models/user.model");
var {error_code} = require('../utils/enum.utils')


exports.getUsercount = (async (req, res) => {
    var query = ( { active_status: 1})
    try {
       await User.count(query).then(user => {
           // console.log(user)
            res.status(200).send({ success: true, data: user});
        }).catch(error => {
            res.status(400).send({ success: false, error: error })
        })
    } catch (error) {
        res.status(201).send({ success: false, error: error })
    }
})

exports.getBranchcount = (async (req, res) => {
    var query = ( { active_status: 1})
    try {
       await branchModel.count(query).then(branch => {
           // console.log(branch)
            res.status(200).send({ success: true, data: branch});
        }).catch(error => {
            res.status(400).send({ success: false, error: error })
        })
    } catch (error) {
        res.status(201).send({ success: false, error: error })
    }
})

exports.getItemcount = (async (req, res) => {
    var query = ( { active_status: 1})
    try {
       await itemModel.count(query).then(items => {
            console.log(items)
            res.status(200).send({ success: true, data: items});
        }).catch(error => {
            res.status(400).send({ success: false, error: error })
        })
    } catch (error) {
        res.status(201).send({ success: false, error: error })
    }
})