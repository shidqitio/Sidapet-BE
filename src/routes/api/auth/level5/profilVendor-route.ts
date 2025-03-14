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
    payloadPengalamanSekarangUpdateSchema,
    payloadTenagaAhliSchema,
    payloadTenagaAhliUpdateSchema,
    payloadTenagaPendukungSchema,
    payloadTenagaPendukungUpdateSchema,
    payloadKantorSchema,
    payloadKantorUpdateSchema,
    payloadPengalamanTaSchema,
    payloadStoreUploadPengalamanPeroranganSchema
} from "@schema/api/profilVendor-schema"
import vendorController from "@controllers/api/vendor-controller";
import validate from "@schema/validate"
import {  uploadPdf } from "@middleware/upload"

const router = express.Router()

router.post("/search-vendor", vendorController.getPenyediaByKode)
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



router.post("/store-profil", validate(storeProfilVendorSchema), profilVendorController.storeProfilVendor)
router.post("/upload", uploadPdf.single("isian"), profilVendorController.storeUpload)
router.post("/get-profil", validate(getJawabProfilVendorSchema), profilVendorController.getProfilVendor)

router.delete("/hapus/profil/:id", validate(parameterSchema), profilVendorController.hapusProfilUpload)
router.delete("/hapus/profil-vendor/:id", validate(parameterSchema), profilVendorController.hapusProfil)

//Perorangan 
//Pengalaman Perorangan
router.post("/perorangan/upload/pengalaman", uploadPdf.single("file"), validate(payloadStoreUploadPengalamanPeroranganSchema), profilVendorController.storeUploadPengalamanOrang)
router.delete("/perorangan/hapus/pengalaman/:id", validate(parameterSchema), profilVendorController.hapusPengalaman)
router.get("/perorangan/profil-pengalaman/:id",validate(parameterSchema), profilVendorController.getPdfUploadPengalamanPerorangan)

//Sertifikat Perorangan
router.get("/perorang/profil-sertif/:id", profilVendorController.getPdfUploadSertifikat);
router.delete("/hapus/sertifikat/:id", validate(parameterSchema), profilVendorController.hapusSertifikat)
router.post("/upload/sertifikat", uploadPdf.single("file"),validate(storeUploadSertifikatSchema), profilVendorController.storeUploadSertifikat)


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
router.get("/badan-usaha/fasilitas/kepemilikan/get-upload/:id", validate(parameterSchema), profilVendorController.getPdfUploadFasilitasKepemilikan)
router.get("/badan-usaha/fasilitas/foto/get-upload/:id", validate(parameterSchema), profilVendorController.getPdfUploadFasilitasFoto)
router.post("/badan-usaha/fasilitas", uploadPdf.fields([{name : "file_bukti_kepemilikan", maxCount : 1}, {name : "file_foto", maxCount : 1}]), validate(payloadFasilitasSchema), profilVendorController.storeFasilitas)
router.delete("/badan-usaha/fasilitas/delete/:id", validate(parameterSchema), profilVendorController.hapusFasilitas)
router.put("/badan-usaha/fasilitas/update/:id", uploadPdf.fields([{name : "file_bukti_kepemilikan", maxCount : 1}, {name : "file_foto", maxCount : 1}]), validate(payloadFasilitasUpdateSchema), profilVendorController.updateFasilitas)

//Pengalaman
router.get("/badan-usaha/pengalaman", profilVendorController.getPengalaman)
router.get("/badan-usaha/pengalaman/kontrak/get-upload/:id", validate(parameterSchema), profilVendorController.getPdfUploadPengalamanKontrak)
router.get("/badan-usaha/pengalaman/bast/get-upload/:id", validate(parameterSchema), profilVendorController.getPdfUploadPengalamanBast)
router.post("/badan-usaha/pengalaman", uploadPdf.fields([{name : "file_kontrak", maxCount : 1}, {name : "file_bast", maxCount : 1}]), validate(payloadPengalamanSchema), profilVendorController.storePengalaman)
router.delete("/badan-usaha/pengalaman/delete/:id", validate(parameterSchema), profilVendorController.hapusPengalamanBadanUsaha)
router.put("/badan-usaha/pengalaman/update/:id", uploadPdf.fields([{name : "file_kontrak", maxCount : 1}, {name : "file_bast", maxCount : 1}]), validate(payloadPengalamanUpdateSchema), profilVendorController.updatePengalaman)

//Tenaga Ahli
router.get("/badan-usaha/tenaga-ahli", profilVendorController.getTenagaAhli)
router.get("/badan-usaha/tenaga-ahli/ktp/get-upload/:id", validate(parameterSchema), profilVendorController.getPdfUploadTenagaAhliKtp)
router.get("/badan-usaha/tenaga-ahli/cv/get-upload/:id", validate(parameterSchema), profilVendorController.getPdfUploadTenagaAhliCv)
router.get("/badan-usaha/tenaga-ahli/ijazah/get-upload/:id", validate(parameterSchema), profilVendorController.getPdfUploadTenagaAhliIjazah)
router.post("/badan-usaha/tenaga-ahli", uploadPdf.fields([{name : "file_ktp", maxCount : 1}, {name : "file_ijazah", maxCount : 1},{name : "file_cv", maxCount : 1}]), validate(payloadTenagaAhliSchema), profilVendorController.storeTenagaAhli)
router.delete("/badan-usaha/tenaga-ahli/delete/:id", validate(parameterSchema), profilVendorController.hapusTenagaAhli)
router.put("/badan-usaha/tenaga-ahli/update/:id", uploadPdf.fields([{name : "file_ktp", maxCount : 1}, {name : "file_ijazah", maxCount : 1},{name : "file_cv", maxCount : 1}]), validate(payloadTenagaAhliUpdateSchema), profilVendorController.updateTenagaAhli)

//Tenaga Pendukung
router.get("/badan-usaha/tenaga-pendukung", profilVendorController.getTenagaPendukung)
router.get("/badan-usaha/tenaga-pendukung/ktp/get-upload/:id", validate(parameterSchema), profilVendorController.getPdfUploadTenagaPendukungKtp)
router.get("/badan-usaha/tenaga-pendukung/cv/get-upload/:id", validate(parameterSchema), profilVendorController.getPdfUploadTenagaPendukungCv)
router.get("/badan-usaha/tenaga-pendukung/ijazah/get-upload/:id", validate(parameterSchema), profilVendorController.getPdfUploadTenagaPendukungIjazah)
router.post("/badan-usaha/tenaga-pendukung", uploadPdf.fields([{name : "file_ktp", maxCount : 1}, {name : "file_ijazah", maxCount : 1},{name : "file_cv", maxCount : 1}]), validate(payloadTenagaPendukungSchema), profilVendorController.storeTenagaPendukung)
router.delete("/badan-usaha/tenaga-pendukung/delete/:id", validate(parameterSchema), profilVendorController.hapusTenagaPendukung)
router.put("/badan-usaha/tenaga-pendukung/update/:id", uploadPdf.fields([{name : "file_ktp", maxCount : 1}, {name : "file_ijazah", maxCount : 1},{name : "file_cv", maxCount : 1}]), validate(payloadTenagaPendukungUpdateSchema), profilVendorController.updateTenagaPendukung)

//Kantor
router.get("/badan-usaha/kantor", profilVendorController.getKantor)
router.get("/badan-usaha/kantor/get-upload/:id", validate(parameterSchema), profilVendorController.getPdfUploadKantor)
router.post("/badan-usaha/kantor", uploadPdf.single("file"), validate(payloadKantorSchema), profilVendorController.storeKantor)
router.delete("/badan-usaha/kantor/delete/:id", validate(parameterSchema), profilVendorController.hapusKantor)
router.put("/badan-usaha/kantor/update/:id", uploadPdf.single("file"), validate(payloadKantorUpdateSchema), profilVendorController.updateKantor)

//PengalamanSekarang
router.get("/badan-usaha/pengalaman-sekarang", profilVendorController.getPengalamanSekarang)
router.get("/badan-usaha/pengalaman-sekarang/get-upload/:id", validate(parameterSchema), profilVendorController.getPdfUploadPengalamanSekarang)
router.post("/badan-usaha/pengalaman-sekarang", uploadPdf.array("file"), validate(payloadPengalamanSekarangSchema), profilVendorController.storePengalamanSekarang)
router.delete("/badan-usaha/pengalaman-sekarang/delete/:id", validate(parameterSchema), profilVendorController.hapusPengalamanSekarangBadanUsaha)
router.put("/badan-usaha/pengalaman-sekarang/update/:id", uploadPdf.array("file"), validate(payloadPengalamanSekarangUpdateSchema), profilVendorController.updatePengalamanSekarang)

//Pengalaman TA
router.get("/badan-usaha/pengalaman-ta/:id",validate(parameterSchema), profilVendorController.getPengalamanTa)
router.post("/badan-usaha/pengalaman-ta",  
    uploadPdf.array("file", 10),
    profilVendorController.storePengalamanTA)
router.get("/badan-usaha/pengalaman-ta/get-upload/:id", validate(parameterSchema),profilVendorController.getPdfUploadPengalamanTa)

//Pengalaman TP
router.get("/badan-usaha/pengalaman-tp/:id", validate(parameterSchema), profilVendorController.getPengalamanTp)
router.post("/badan-usaha/pengalaman-tp",  
    uploadPdf.array("file", 10),
    profilVendorController.storePengalamanTP)
router.get("/badan-usaha/pengalaman-tp/get-upload/:id", validate(parameterSchema),profilVendorController.getPdfUploadPengalamanTp)

export default router