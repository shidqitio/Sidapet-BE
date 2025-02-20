import express from "express"
import trxPenjaringanController from "@controllers/api/trxPenjaringan-controller"

import {
    payloadTrxPenjaringanSchema, 
    querySchema,
    parameterSchema
} from "@schema/api/trxPenjaringan-schema"

import validate from "@schema/validate"

const router = express.Router()

//Store
router.post("/", validate(payloadTrxPenjaringanSchema), trxPenjaringanController.storeTahap)

export default router