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
const purchaseOrderModel = require("./purchaseOrder.model")
const stockAllocationModel = require("./stockAllocation.model")
const supplierModel = require("./supplier.model")
const categoryModel = require("./category.model")
const countryModel = require("./country.model")
const stateModel = require("./state.model")
const cityModel = require("./city.model")
const languageModel = require("./language.model")
const resetPasswordTokenModel = require("./resetPasswordToken.model")
const subCategoryModel = require("./subCategory.model")
const CartModel = require("./cart.model")
const machineUsageModel = require("./machineUsage.model")
const logModel = require("./log.model")
const companyModel = require("./company.model")
const storeModel  = require("./store.model")

module.exports = {
    branchModel,
    binModel,
    categoryModel,
    compartmentModel,
    cubeModel,
    departmentModel,
    itemModel,
    kitModel,
    purchaseOrderModel,
    rolesModel,
    stockAllocationModel,
    supplierModel,
    shift_timeModel,
    userModel,
    countryModel,
    stateModel,
    cityModel,
    languageModel,
    resetPasswordTokenModel,
    subCategoryModel,
    CartModel,
    machineUsageModel,
    logModel,
    companyModel,
    storeModel
}
