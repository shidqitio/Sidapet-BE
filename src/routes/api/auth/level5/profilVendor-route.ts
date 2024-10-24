import express from "express"
import profilVendorController from "@controllers/api/profilVendor-controller"
import {
    storeProfilVendorSchema,
    parameterSchema,
    storeUploadVendorSchema,
    getJawabProfilVendorSchema,
    storeUploadSertifikatSchema,
    storeUploadPengalamanSchema
} from "@schema/api/profilVendor-schema"
import validate from "@schema/validate"
import { uploadPdf } from "@middleware/upload"

const router = express.Router()

router.get("/menu/:id", validate(parameterSchema), profilVendorController.getMenuAll)
router.get("/menu-vendor", profilVendorController.getMenuStatus)
router.get("/sub-menu/:id",validate(parameterSchema), profilVendorController.getSubMenu )
router.get("/kategori/:id", validate(parameterSchema), profilVendorController.katItemTanya)
router.get("/tanya-perorangan/:id", validate(parameterSchema), profilVendorController.listPertanyaanPerorangan)
router.get("/tes-domisili/:id", validate(parameterSchema), profilVendorController.tesDomisili)
router.get("/domisili", profilVendorController.domisili)

router.post("/store-profil", validate(storeProfilVendorSchema), profilVendorController.storeProfilVendor)
router.post("/upload", uploadPdf.single("isian"), profilVendorController.storeUpload)
router.post("/get-profil", validate(getJawabProfilVendorSchema), profilVendorController.getProfilVendor)
router.post("/upload/sertifikat", uploadPdf.single("file"),validate(storeUploadSertifikatSchema), profilVendorController.storeUploadSertifikat)
router.post("/upload/pengalaman", uploadPdf.single("file"), validate(storeUploadPengalamanSchema), profilVendorController.storeUploadPengalamanOrang)

router.delete("/hapus/sertifikat/:id", validate(parameterSchema), profilVendorController.hapusSertifikat)
router.delete("/hapus/pengalaman/:id", validate(parameterSchema), profilVendorController.hapusPengalaman)

export default router