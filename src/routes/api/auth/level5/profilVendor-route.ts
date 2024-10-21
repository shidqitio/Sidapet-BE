import express from "express"
import profilVendorController from "@controllers/api/profilVendor-controller"
import {
    storeProfilVendorSchema,
    parameterSchema,
    storeUploadVendorSchema
} from "@schema/api/profilVendor-schema"
import validate from "@schema/validate"
import { uploadPdf } from "@middleware/upload"

const router = express.Router()

router.get("/menu/:id", validate(parameterSchema), profilVendorController.getMenuAll)
router.get("/sub-menu/:id",validate(parameterSchema), profilVendorController.getSubMenu )
router.get("/kategori/:id", validate(parameterSchema), profilVendorController.katItemTanya)
router.get("/tanya-perorangan/:id", validate(parameterSchema), profilVendorController.listPertanyaanPerorangan)
router.get("/tes-domisili/:id", validate(parameterSchema), profilVendorController.tesDomisili)

router.post("/store-profil", validate(storeProfilVendorSchema), profilVendorController.storeProfilVendor)
router.post("/upload", uploadPdf.single("isian"), profilVendorController.storeUpload)

export default router