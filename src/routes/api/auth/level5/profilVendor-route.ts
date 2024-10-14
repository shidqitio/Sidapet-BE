import express from "express"
import profilVendorController from "@controllers/api/profilVendor-controller"
import {
    parameterSchema
} from "@schema/api/profilVendor-schema"
import validate from "@schema/validate"

const router = express.Router()

router.get("/menu/:id", validate(parameterSchema), profilVendorController.getMenuAll)
router.get("/sub-menu/:id",validate(parameterSchema), profilVendorController.getSubMenu )
router.get("/kategori/:id", validate(parameterSchema), profilVendorController.katItemTanya)

export default router