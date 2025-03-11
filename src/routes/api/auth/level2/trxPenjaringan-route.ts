import express from "express"
import trxPenjaringanController from "@controllers/api/trxPenjaringan-controller"

import {
    payloadTrxPenjaringanSchema, 
    querySchema,
    parameterSchema
} from "@schema/api/trxPenjaringan-schema"

import validate from "@schema/validate"

const router = express.Router()

//Get
router.get("/:id", validate(querySchema), trxPenjaringanController.getPenjaringan)
router.get("/detail/:id", validate(parameterSchema), trxPenjaringanController.getDetailPenjaringan)

//Store
router.post("/", validate(payloadTrxPenjaringanSchema), trxPenjaringanController.storeTahap)

//Update
router.put("/ajukan-penjaringan/:id", validate(parameterSchema), trxPenjaringanController.ajukanPenjaringan)

//Delete
router.delete("/:id", validate(parameterSchema), trxPenjaringanController.deleteTrxPenjaringan)

export default router