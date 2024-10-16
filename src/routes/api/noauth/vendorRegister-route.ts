import express from "express";
import vendorRegisterController from "@controllers/api/vendorRegister-controller";

import {
    payloadRegisterSchema,
    paramsRegisterVendorSchema,
    updateStatusRegisterSchema,
    querySchema,
    parameterSchema,
} from "@schema/api/vendorRegister-schema"

import { uploadImage } from "@middleware/upload";

import validate from "@schema/validate";
import authCaptcha from "@middleware/authcaptcha";

const router = express.Router();

router.post("/register", uploadImage.single("file"), validate(payloadRegisterSchema), vendorRegisterController.registerVendor)
router.get("/register-usman/:id", validate(parameterSchema), vendorRegisterController.insertExternaltoUsman)

router.post("/migrasi-usman", vendorRegisterController.migrasiUserUsman)



export default router

