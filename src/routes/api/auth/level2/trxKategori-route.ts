import express from "express"
import trxKategoriController from "@controllers/api/trxKategori-controller"

import {
    payloadTrxKategoriSchema,
    querySchema,
    parameterSchema
} from "@schema/api/trxKategori-schema"

import validate from "@schema/validate"

const router = express.Router()

//get 
router.get("/", trxKategoriController.getListKategori)

//Post
router.post("/", validate(payloadTrxKategoriSchema) ,trxKategoriController.storeTrxKategori)

//Delete
router.delete("/:id",validate(parameterSchema) ,trxKategoriController.deleteTrxKategori)

export default router