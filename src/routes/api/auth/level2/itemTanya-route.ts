import express from "express"
import itemTanyaController from "@controllers/api/itemTanya-controller"
import {
    payloadItemTanyaSchema,
    parameterSchema
} from "@schema/api/itemTanya-schema"
import validate from "@schema/validate"


const router = express.Router()

//Get
// router.get("/item/kat-dok-vendor/:id", validate(parameterSchema), itemTanyaController.getKatDokVendor)
// router.get("/item/kat-dok-tanya/:id", validate(parameterSchema), itemTanyaController.getKatItemTanya)
// router.get("/item/item-tanya-custom/:id", itemTanyaController.getItemTanyaCustom)
// router.get("/item/tipe-input", itemTanyaController.getTipeInput)

//post 
router.post("/item/post-item-tanya", validate(payloadItemTanyaSchema), itemTanyaController.storeItemTanya)

//delete 
router.delete("/item/delete-item-tanya/:id", validate(parameterSchema), itemTanyaController.deleteItemTanyaCustom)



export default router
