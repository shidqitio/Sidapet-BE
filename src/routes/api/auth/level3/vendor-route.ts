import express from "express";
import vendorRegisterController from "@controllers/api/vendorRegister-controller";

import {
    payloadRegisterSchema,
    paramsRegisterVendorSchema,
    updateStatusRegisterSchema,
    querySchema,
    parameterSchema,
    getVendorRegisterByStatusRegister,
    paramaterStatusVendorSchema
} from "@schema/api/vendorRegister-schema"

import validate from "@schema/validate";

import authorization from "@middleware/authorization";

const router = express.Router();

router.post("/register", vendorRegisterController.registerVendor)

router.put("/update-status/:id", validate(updateStatusRegisterSchema), vendorRegisterController.updateStatusVendor)

router.get("/get-vendor/:id", vendorRegisterController.getRegisterVendorDetail)


router.get("/vendor-status/:id",validate(paramaterStatusVendorSchema), vendorRegisterController.getVendorbyStatusVerifikasi)

export default router

