import express from "express"
import kategoriController from "@controllers/api/kategori-controller"

import {
    parameterSchema, 
    payloadKategoriSchema,
} from "@schema/api/kategori-schema"

import validate from "@schema/validate"

const router = express.Router()

//Get
router.get("/", kategoriController.getKategori)

router.get("/:id", validate(parameterSchema), kategoriController.getByIdKategori)

//Post
router.post("/", validate(payloadKategoriSchema), kategoriController.storeKategori)


//Delete
router.delete("/:id", validate(parameterSchema), kategoriController.deleteKategori)

export default router