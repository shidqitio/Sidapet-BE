import express from "express"
import profilVendorController from "@controllers/api/profilVendor-controller"
import {
    storeProfilVendorSchema,
    parameterSchema,
    storeUploadVendorSchema,
    getJawabProfilVendorSchema,
    storeUploadSertifikatSchema,
    storeUploadPengalamanSchema,
    storeUploadKomisarisSchema,
    updateKomisarisSchema,
    payloadDireksiSchema,
    payloadUploadDireksiSchema,
    payloadIjinUsahaSchema,
    payloadIjinUsahaUpdateSchema,
    payloadSahamPerusahaanSchema,
    payloadSahamPerusahaanUpdateSchema,
    payloadPersonaliaSchema,
    payloadPersonaliaUpdateSchema,
    payloadFasilitasSchema,
    payloadFasilitasUpdateSchema,
    payloadPengalamanSchema,
    payloadPengalamanUpdateSchema,
    payloadPengalamanSekarangSchema,
    payloadPengalamanSekarangUpdateSchema
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

router.get("/get-pengalaman", profilVendorController.getPengalamanVendor)
router.get("/get-sertifikat", profilVendorController.getSertifikat)
router.get("/show/profil-upload/:id", profilVendorController.getPdfUpload);
router.get("/perorang/profil-sertif/:id", profilVendorController.getPdfUploadSertifikat);
router.get("/perorang/profil-pengalaman/:id",profilVendorController.getPdfUploadPengalamanPerorangan)

router.post("/store-profil", validate(storeProfilVendorSchema), profilVendorController.storeProfilVendor)
router.post("/upload", uploadPdf.single("isian"), profilVendorController.storeUpload)
router.post("/get-profil", validate(getJawabProfilVendorSchema), profilVendorController.getProfilVendor)
router.post("/upload/sertifikat", uploadPdf.single("file"),validate(storeUploadSertifikatSchema), profilVendorController.storeUploadSertifikat)
router.post("/upload/pengalaman", uploadPdf.single("file"), validate(storeUploadPengalamanSchema), profilVendorController.storeUploadPengalamanOrang)

router.delete("/hapus/sertifikat/:id", validate(parameterSchema), profilVendorController.hapusSertifikat)
router.delete("/hapus/pengalaman/:id", validate(parameterSchema), profilVendorController.hapusPengalaman)
router.delete("/hapus/profil/:id", validate(parameterSchema), profilVendorController.hapusProfilUpload)
router.delete("/hapus/profil-vendor/:id", validate(parameterSchema), profilVendorController.hapusProfil)


//Badan Usaha
router.get("/badan-usaha/tanya/:id", validate(parameterSchema), profilVendorController.listPertanyaanBadanUsaha)

//Komisaris
router.get("/badan-usaha/komisaris", profilVendorController.getKomisarisVendor)
router.get("/badan-usaha/komisaris/get-upload/:id", validate(parameterSchema), profilVendorController.getPdfUploadKomisaris)
router.post("/badan-usaha/komisaris", uploadPdf.single("file"), validate(storeUploadKomisarisSchema), profilVendorController.storeUploadKomisaris)
router.delete("/badan-usaha/komisaris/delete/:id", validate(parameterSchema), profilVendorController.hapusKomisaris)
router.put("/badan-usaha/komisaris/update/:id", uploadPdf.single("file"), validate(updateKomisarisSchema), profilVendorController.updateKomisaris)

//Direksi 
router.get("/badan-usaha/direksi", profilVendorController.getDireksiVendor)
router.get("/badan-usaha/direksi/get-upload/:id", validate(parameterSchema), profilVendorController.getPdfUploadDireksi)
router.post("/badan-usaha/direksi", uploadPdf.single("file"), validate(payloadDireksiSchema), profilVendorController.storeUploadDireksi)
router.delete("/badan-usaha/direksi/delete/:id", validate(parameterSchema), profilVendorController.hapusDireksi)
router.put("/badan-usaha/direksi/update/:id", uploadPdf.single("file"), validate(payloadUploadDireksiSchema), profilVendorController.updateDireksi)

//Ijin Usaha 
router.get("/badan-usaha/ijin-usaha", profilVendorController.getIjinUsaha)
router.get("/badan-usaha/ijin-usaha/get-upload/:id", validate(parameterSchema), profilVendorController.getPdfUploadIjinUsaha)
router.post("/badan-usaha/ijin-usaha", uploadPdf.single("file"), validate(payloadIjinUsahaSchema), profilVendorController.storeIjinUsaha)
router.delete("/badan-usaha/ijin-usaha/delete/:id", validate(parameterSchema), profilVendorController.hapusIjinUsaha)
router.put("/badan-usaha/ijin-usaha/update/:id", uploadPdf.single("file"), validate(payloadIjinUsahaUpdateSchema), profilVendorController.updateIjinUsaha)

//Saham Perusahaan 
router.get("/badan-usaha/saham", profilVendorController.getSahamPerusahaan)
router.get("/badan-usaha/saham/get-upload/:id", validate(parameterSchema), profilVendorController.getPdfUploadSahamPerusahaan)
router.post("/badan-usaha/saham", uploadPdf.single("file"), validate(payloadSahamPerusahaanSchema), profilVendorController.storeSahamPerusahaan)
router.delete("/badan-usaha/saham/delete/:id", validate(parameterSchema), profilVendorController.hapusSahamPerusahaan)
router.put("/badan-usaha/saham/update/:id", uploadPdf.single("file"), validate(payloadSahamPerusahaanUpdateSchema), profilVendorController.updateSahamPerusahaan)

//Personalia 
router.get("/badan-usaha/personalia", profilVendorController.getPersonalia)
router.get("/badan-usaha/personalia/get-upload/:id", validate(parameterSchema), profilVendorController.getPdfUploadPersonalia)
router.post("/badan-usaha/personalia", uploadPdf.single("file"), validate(payloadPersonaliaSchema), profilVendorController.storePersonalia)
router.delete("/badan-usaha/personalia/delete/:id", validate(parameterSchema), profilVendorController.hapusPersonalia)
router.put("/badan-usaha/personalia/update/:id", uploadPdf.single("file"), validate(payloadPersonaliaUpdateSchema), profilVendorController.updatePersonalia)


//Fasilitas
router.get("/badan-usaha/fasilitas", profilVendorController.getFasilitas)
router.get("/badan-usaha/fasilitas/get-upload/:id", validate(parameterSchema), profilVendorController.getPdfUploadFasilitas)
router.post("/badan-usaha/fasilitas", uploadPdf.single("file"), validate(payloadFasilitasSchema), profilVendorController.storeFasilitas)
router.delete("/badan-usaha/fasilitas/delete/:id", validate(parameterSchema), profilVendorController.hapusFasilitas)
router.put("/badan-usaha/fasilitas/update/:id", uploadPdf.single("file"), validate(payloadFasilitasUpdateSchema), profilVendorController.updateFasilitas)

//Pengalaman
router.get("/badan-usaha/pengalaman", profilVendorController.getPengalaman)
router.get("/badan-usaha/pengalaman/get-upload/:id", validate(parameterSchema), profilVendorController.getPdfUploadPengalaman)
router.post("/badan-usaha/pengalaman", uploadPdf.single("file"), validate(payloadPengalamanSchema), profilVendorController.storePengalaman)
router.delete("/badan-usaha/pengalaman/delete/:id", validate(parameterSchema), profilVendorController.hapusPengalamanBadanUsaha)
router.put("/badan-usaha/pengalaman/update/:id", uploadPdf.single("file"), validate(payloadPengalamanUpdateSchema), profilVendorController.updatePengalaman)

//PengalamanSekarang
router.get("/badan-usaha/pengalaman-sekarang", profilVendorController.getPengalamanSekarang)
router.get("/badan-usaha/pengalaman-sekarang/get-upload/:id", validate(parameterSchema), profilVendorController.getPdfUploadPengalamanSekarang)
router.post("/badan-usaha/pengalaman-sekarang", uploadPdf.single("file"), validate(payloadPengalamanSekarangSchema), profilVendorController.storePengalamanSekarang)
router.delete("/badan-usaha/pengalaman-sekarang/delete/:id", validate(parameterSchema), profilVendorController.hapusPengalamanSekarangBadanUsaha)
router.put("/badan-usaha/pengalaman-sekarang/update/:id", uploadPdf.single("file"), validate(payloadPengalamanSekarangUpdateSchema), profilVendorController.updatePengalamanSekarang)

export default router