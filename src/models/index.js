const branchModel = require("./branch.model")
const binModel = require("./bin.model")
const compartmentModel = require("./compartment.model")
const cubeModel = require("./cube.model")
const departmentModel = require("./department.model")
const rolesModel = require("./roles.model")
const shift_timeModel = require("./shift_time.model")
const userModel = (require("./user.model")).User
const itemModel = require("./item.model")
const kitModel = require("./kit.model")
const purchase_orderModel = require("./purchase_order.model")
const stock_allocationModel = require("./stock_allocation.model")
const supplierModel = require("./supplier.model")
const categoryModel = require("./category.model")
const countryModel = require("./country.model")
const stateModel = require("./state.model")
const cityModel = require("./city.model")
const languageModel = require("./language.model")
const resetPasswordTokenModel = require("./resetPasswordToken.model")
const subCategoryModel = require("./sub_category.model")



module.exports = {
    branchModel,
    binModel,
    categoryModel,
    compartmentModel,
    cubeModel,
    departmentModel,
    itemModel,
    kitModel,
    purchase_orderModel,
    rolesModel,
    stock_allocationModel,
    supplierModel,
    shift_timeModel,
    userModel,
    countryModel,
    stateModel,
    cityModel,
    languageModel,
    resetPasswordTokenModel,
    subCategoryModel



}
