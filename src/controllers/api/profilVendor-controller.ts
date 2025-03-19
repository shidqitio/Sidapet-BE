import { httpCode, responseStatus } from "@utils/prefix";
import { responseSuccess } from "@utils/response-success";
import { Request, Response, NextFunction, response } from "express";
import { errorLogger, debugLogger } from "@config/logger";
import {
StoreProfilVendorSchema,
ParameterSchema,
QuerySchema,
StoreUploadVendorSchema,
GetJawabProfilVendorSchema,
StoreUploadSertifikatSchema,
StoreUploadPengalamanSchema,
StoreUploadKomisarisSchema,
UpdateKomisarisSchema,
PayloadDireksiSchema,
PayloadUpdateDireksiSchema,
PayloadIjinUsaha,
PayloadIjinUsahaUpdateSchema,
PayloadSahamPerusahaanSchema,
PayloadSahamPerusahaanUpdateSchema,
PayloadPersonaliaSchema,
PayloadPersonaliaUpdateSchema,
PayloadFasilitasSchema,
PayloadFasilitasUpdateSchema,
PayloadPengalamanSchema,
PayloadPengalamanUpdateSchema,
PayloadPengalamanSekarangSchema,
PayloadPengalamanSekarangUpdateSchema,
PayloadTenagaAhliSchema,
PayloadTenagaAhliUpdateSchema,
PayloadTenagaPendukungSchema,
PayloadTenagaPendukungUpdateSchema,
PayloadKantorSchema,
PayloadKantorUpdateSchema,
PayloadPengalamanTaSchema,
PayloadPengalamanTpSchema,
PayloadStoreUploadPengalamanPeroranganSchema,
PayloadStoreUploadSertifikatPeroranganSchema,
PayloadSertifikatTASchema,
PayloadSertifikatTPSchema,
PayloadPengalamanTaSatuanSchema,
PayloadPengalamaTpSatuanSchema,
PayloadSertifikatTASatuanSchema,
PayloadSertifikatTPSatuanSchema
} from "@schema/api/profilVendor-schema"

import profilVendorService from "@services/api/v1/profilVendor-service";
import CustomError from "@middleware/error-handler";
import { object } from "zod";
import { tesUpload } from "@middleware/upload";

const getMenuAll = async (
    req : Request,
    res : Response,
    next: NextFunction
) : Promise<void> => {
    try {
        const id : ParameterSchema["params"]["id"] = req.params.id

        const response = await profilVendorService.getMenuAll(id)


        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menampilkan Data", response)

    } catch (error) {
        errorLogger.error(`Testing Error Get All KatDokumenVendor ${error}`)
        next(error)
    }
}



const getSubMenu = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const id : ParameterSchema["params"]["id"] = req.params.id

        const response = await profilVendorService.getSubMenu(id)
        
        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menampilkan Data", response)
    } catch (error) {
        errorLogger.error(`Testing Error Get All SubKatDokumenVendor ${error}`)
        next(error)
    }
}

const getMenuStatus = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {

        
        const kode_vendor = req.user.kode_vendor

        console.log(kode_vendor)

        if(!kode_vendor) throw new CustomError(httpCode.unauthorized, responseStatus.error, "Belum Terdaftar Sebagai Vendor")

        const response = await profilVendorService.getMenuStatus(kode_vendor)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menampilkan Data", response)
    } catch (error) {
        errorLogger.error(`Testing Error Get All SubKatDokumenVendor ${error}`)
        next(error)
    }
}



const katItemTanya = async (
    req :Request,
    res :Response,
    next: NextFunction) : Promise<void> => {
    try {
        const id : ParameterSchema["params"]["id"] = req.params.id

        const response = await profilVendorService.katItemTanya(id)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menampilkan Data", response)
    } catch (error) {
        errorLogger.error(`Testing Error Get All KatItemTanya ${error}`)
        next(error)
    }
}

const listPertanyaanPerorangan = async (
    req:Request, 
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const id : ParameterSchema["params"]["id"] = req.params.id

        const response = await profilVendorService.listPertanyaanPerorangan(id)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menampilkan Data", response)
    } catch (error) {
        errorLogger.error(`Testing Error Get All KatItemTanya ${error}`)
        next(error)
    }
}

const storeProfilVendor = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const request : StoreProfilVendorSchema["body"] = req.body

        const kode_vendor = req.user.kode_vendor as number

        const response = await profilVendorService.storeProfilVendor(request, kode_vendor)

        responseSuccess(res,httpCode.created, responseStatus.success, "Berhasil Menampilkan Data", response)
    } catch (error) {
        errorLogger.error(`Testing Error Store Profil Vendor ${error}`)
        next(error)
    }
}

const storeUpload = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const request : StoreUploadVendorSchema["body"] = req.body

        const file = req.file as Express.Multer.File

        const kode_vendor = req.user.kode_vendor as number

        const response = await profilVendorService.storeUpload(request, file, kode_vendor)

        responseSuccess(res,httpCode.created, responseStatus.success, "Berhasil Menampilkan Data", response)
    } catch (error) {
        errorLogger.error(`Testing Error Store Upload Vendor ${error}`)
        next(error)
    }
}

const hapusProfil = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const id : ParameterSchema["params"]["id"] = req.params.id

        const response = await profilVendorService.hapusProfil(id)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Hapus Data Berhasil", response)
    } catch (error) {
        errorLogger.error(`Testing Error Hapus Profil ${error}`)
        next(error)
    }
}

const tesDomisili = async (
    req:Request, 
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const id : ParameterSchema["params"]["id"] = req.params.id

        const response = await profilVendorService.tesDomisili(id)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menampilkan Data", response)
    } catch (error) {
        errorLogger.error(`Testing Error Get All Jawab Profil ${error}`)
        next(error)
    }
}

const getProfilVendor = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const request : GetJawabProfilVendorSchema["body"] = req.body

        const kode_vendor = req.user.kode_vendor as number

        if(!req.user.kode_vendor) throw new CustomError(httpCode.unauthorized, responseStatus.error, "Belum Terdaftar Sebagai Vendor")

        const response = await profilVendorService.getProfilVendor(request, kode_vendor)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menampilkan Data", response)
        
    } catch (error) {
        errorLogger.error(`Testing Error Get Profil Vendor ${error}`)
        next(error)
    }
}

const hapusProfilUpload = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const id : ParameterSchema["params"]["id"] = req.params.id

        const response = await profilVendorService.hapusUploadProfil(id)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Data Profil Berhasil Dihapus", response)
    } catch (error) {
        errorLogger.error(`Testing Error Hapus Profil Upload ${error}`)
        next(error)
    }
}

const domisili = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const response = await profilVendorService.domisili()

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menampilkan Data", response)
    } catch (error) {
        errorLogger.error(`Testing Error Domisili ${error}`)
        next(error)
    }
}

const getPdfUpload = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const kode_vendor = req.user.kode_vendor

        if(!kode_vendor) throw new CustomError(httpCode.unauthorized, responseStatus.error, "Belum Terdaftar Sebagai Vendor")

        const id : ParameterSchema["params"]["id"] = req.params.id

        const response = await profilVendorService.getPdfUpload(id, kode_vendor)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menampilkan Data", response.data)
    } catch (error) {
        errorLogger.error(`Testing Error Get PDF Upload  ${error}`)
        next(error)
    }
}

//Pengalaman

const storeUploadPengalamanOrang = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const request : PayloadStoreUploadPengalamanPeroranganSchema["body"] = req.body

        const kode_vendor = req.user.kode_vendor

        if(!kode_vendor) throw new CustomError(httpCode.unauthorized, responseStatus.error, "Belum Terdaftar Sebagai Vendor")

        const response = await profilVendorService.uploadPengalamanOrang(request, req.file as Express.Multer.File, kode_vendor)

        responseSuccess(res, httpCode.created, responseStatus.success, "Data Pengalaman Perorangan Berhasil Di Upload", response)
    } catch (error) {
        errorLogger.error(`Testing Error Store Upload Pengalaman Orang ${error}`)
        next(error)
    }
}

const getPengalamanVendor = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const kode_vendor = req.user.kode_vendor

        if(!kode_vendor) throw new CustomError(httpCode.unauthorized, responseStatus.error, "Belum Terdaftar Sebagai Vendor")

        const response = await profilVendorService.getPengalamanVendor(kode_vendor)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menampilkan Data", response)
    } catch (error) {
        errorLogger.error(`Testing Error Get Pengalaman Vendor ${error}`)
        next(error)
    }
}

const hapusPengalaman = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const id : ParameterSchema["params"]["id"] = req.params.id

        const response = await profilVendorService.hapusPengalaman(id)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Data Sertifikat Berhasil Di Hapus", response)


    } catch (error) {
        errorLogger.error(`Testing Error Hapus Pengalaman Orang ${error}`)
        next(error)
    }
}

const getPdfUploadPengalamanPerorangan = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const kode_vendor = req.user.kode_vendor

        if(!kode_vendor) throw new CustomError(httpCode.unauthorized, responseStatus.error, "Belum Terdaftar Sebagai Vendor")

        const id : ParameterSchema["params"]["id"] = req.params.id

        const response = await profilVendorService.getPdfUploadPengalamanPerorangan(id, kode_vendor)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menampilkan Data", response.data)
    } catch (error) {
        errorLogger.error(`Testing Error Get PDF Upload  ${error}`)
        next(error)
    }
}

//SERTIFIKAT PERORANGAN

const getSertifikat = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const kode_vendor = req.user.kode_vendor

        if(!kode_vendor) throw new CustomError(httpCode.unauthorized, responseStatus.error, "Belum Terdaftar Sebagai Vendor")

        const response = await profilVendorService.getSertifikat(kode_vendor)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menampilkan Data", response)
    } catch (error) {
        errorLogger.error(`Testing Error Get Sertifikat  ${error}`)
        next(error)
    }
}


const hapusSertifikat = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const id : ParameterSchema["params"]["id"] = req.params.id

        const response = await profilVendorService.hapusSertifikat(id)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Data Sertifikat Berhasil Di Hapus", response)


    } catch (error) {
        errorLogger.error(`Testing Error Hapus Sertifikat Orang ${error}`)
        next(error)
    }
}

const storeUploadSertifikat = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const request : PayloadStoreUploadSertifikatPeroranganSchema["body"] = req.body

        const kode_vendor = req.user.kode_vendor

        if(!kode_vendor) throw new CustomError(httpCode.unauthorized, responseStatus.error, "Belum Terdaftar Sebagai Vendor")

        const response = await profilVendorService.storeUploadSertifikat(request, req.file as Express.Multer.File, kode_vendor)

        responseSuccess(res, httpCode.created, responseStatus.success, "Data Sertifikat Berhasil Di Upload", response)

    } catch (error) {
        errorLogger.error(`Testing Error Store Upload Sertifikat ${error}`)
        next(error)
    }
}

const getPdfUploadSertifikat = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const kode_vendor = req.user.kode_vendor

        if(!kode_vendor) throw new CustomError(httpCode.unauthorized, responseStatus.error, "Belum Terdaftar Sebagai Vendor")

        const id : ParameterSchema["params"]["id"] = req.params.id

        const response = await profilVendorService.getPdfUploadSertifikat(id, kode_vendor)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menampilkan Data", response.data)
    } catch (error) {
        errorLogger.error(`Testing Error Get PDF Upload  ${error}`)
        next(error)
    }
}








// ################ BADAN USAHA ##########################

// ##### LIST TANYA #############

const listPertanyaanBadanUsaha = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const id : ParameterSchema["params"]["id"] = req.params.id

        const response = await profilVendorService.listPertanyaanBadanUsaha(id)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menampilkan Data", response)
    } catch (error) {
        errorLogger.error(`Testing Error Get List Badan Usaha  ${error}`)
        next(error)
    }
}

// ################ KOMISARIS ###################

const getKomisarisVendor = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const kode_vendor = req.user.kode_vendor

        if(!kode_vendor) throw new CustomError(httpCode.unauthorized, responseStatus.error, "Belum Terdaftar Sebagai Vendor")

        const response = await profilVendorService.getKomisarisVendor(kode_vendor)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menampilkan Data", response)

    } catch (error) {
        errorLogger.error(`Testing Error Get Komisaris Vendor  ${error}`)
        next(error)
    }
}

const storeUploadKomisaris = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const kode_vendor = req.user.kode_vendor

        if(!kode_vendor) throw new CustomError(httpCode.unauthorized, responseStatus.error, "Belum Terdaftar Sebagai Vendor")

        const request : StoreUploadKomisarisSchema["body"] = req.body

        const file = req.file

        const response = await profilVendorService.storeUploadKomisaris(request, kode_vendor, file as Express.Multer.File)

        responseSuccess(res, httpCode.created, responseStatus.success, "Berhasil Menambah Komisaris", response)

    } catch (error) {
        errorLogger.error(`Testing Error Store Komisaris  ${error}`)
        next(error)
    }
}

const hapusKomisaris = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const id : ParameterSchema["params"]["id"] = req.params.id

        const response = await profilVendorService.hapusKomisaris(id)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menghapus Komisaris", response)

    } catch (error) {
        errorLogger.error(`Testing Error Delete Komisaris  ${error}`)
        next(error)
    }
}

const getPdfUploadKomisaris = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const kode_vendor = req.user.kode_vendor

        if(!kode_vendor) throw new CustomError(httpCode.unauthorized, responseStatus.error, "Belum Terdaftar Sebagai Vendor")

        const id : ParameterSchema["params"]["id"] = req.params.id

        const response = await profilVendorService.getPdfUploadKomisaris(id, kode_vendor)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menampilkan Data", response.data)
    } catch (error) {
        errorLogger.error(`Testing Error Get PDF Komisaris Upload  ${error}`)
        next(error)
    }
}

const updateKomisaris = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const id : UpdateKomisarisSchema["params"]["id"] = req.params.id

        const request : UpdateKomisarisSchema["body"] = req.body

        const file = req.file

        const response = await profilVendorService.updateKomisaris(id, request, file as Express.Multer.File)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Mengubah Komisaris", response)

    } catch (error) {
        errorLogger.error(`Testing Error Store Komisaris  ${error}`)
        next(error)
    }
}

// ################ DIREKSI #####################
const getDireksiVendor = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const kode_vendor = req.user.kode_vendor

        if(!kode_vendor) throw new CustomError(httpCode.unauthorized, responseStatus.error, "Belum Terdaftar Sebagai Vendor")

        const response = await profilVendorService.getDireksiVendor(kode_vendor)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menampilkan Data", response)

    } catch (error) {
        errorLogger.error(`Testing Error Get Direksi Vendor  ${error}`)
        next(error)
    }
}

const storeUploadDireksi = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const kode_vendor = req.user.kode_vendor

        if(!kode_vendor) throw new CustomError(httpCode.unauthorized, responseStatus.error, "Belum Terdaftar Sebagai Vendor")

        const request : PayloadDireksiSchema["body"] = req.body

        const file = req.file

        const response = await profilVendorService.storeUploadDireksi(request, kode_vendor, file as Express.Multer.File)

        responseSuccess(res, httpCode.created, responseStatus.success, "Berhasil Menambah Direksi", response)

    } catch (error) {
        errorLogger.error(`Testing Error Store Komisaris  ${error}`)
        next(error)
    }
}

const hapusDireksi = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const id : ParameterSchema["params"]["id"] = req.params.id

        const response = await profilVendorService.hapusDireksi(id)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menghapus Direksi", response)

    } catch (error) {
        errorLogger.error(`Testing Error Delete Direksi  ${error}`)
        next(error)
    }
}

const getPdfUploadDireksi = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const kode_vendor = req.user.kode_vendor

        if(!kode_vendor) throw new CustomError(httpCode.unauthorized, responseStatus.error, "Belum Terdaftar Sebagai Vendor")

        const id : ParameterSchema["params"]["id"] = req.params.id

        const response = await profilVendorService.getPdfUploadDireksi(id, kode_vendor)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menampilkan Data", response.data)
    } catch (error) {
        errorLogger.error(`Testing Error Get PDF Direksi Upload  ${error}`)
        next(error)
    }
}

const updateDireksi = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const id : PayloadUpdateDireksiSchema["params"]["id"] = req.params.id

        const request : PayloadUpdateDireksiSchema["body"] = req.body

        const file = req.file

        const response = await profilVendorService.updateDireksi(id, request, file as Express.Multer.File)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Mengubah Direksi", response)

    } catch (error) {
        errorLogger.error(`Testing Error Update Direksi  ${error}`)
        next(error)
    }
}

//################# Ijin Usaha ##############################

const getIjinUsaha = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const kode_vendor = req.user.kode_vendor

        if(!kode_vendor) throw new CustomError(httpCode.unauthorized, responseStatus.error, "Belum Terdaftar Sebagai Vendor")

        const response = await profilVendorService.getIjinUsaha(kode_vendor)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menampilkan Data", response)

    } catch (error) {
        errorLogger.error(`Testing Error Get Ijin Usaha Vendor  ${error}`)
        next(error)
    }
}

const storeIjinUsaha = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const kode_vendor = req.user.kode_vendor

        if(!kode_vendor) throw new CustomError(httpCode.unauthorized, responseStatus.error, "Belum Terdaftar Sebagai Vendor")

        const request : PayloadIjinUsaha["body"] = req.body

        const file = req.file

        const response = await profilVendorService.storeIjinUsaha(request, kode_vendor, file as Express.Multer.File)

        responseSuccess(res, httpCode.created, responseStatus.success, "Berhasil Menambah Ijin Usaha", response)

    } catch (error) {
        errorLogger.error(`Testing Error Store Komisaris  ${error}`)
        next(error)
    }
}

const hapusIjinUsaha = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const id : ParameterSchema["params"]["id"] = req.params.id

        const response = await profilVendorService.hapusIjinUsaha(id)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menghapus Ijin Usaha", response)

    } catch (error) {
        errorLogger.error(`Testing Error Delete Ijin Usaha  ${error}`)
        next(error)
    }
}

const getPdfUploadIjinUsaha = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const kode_vendor = req.user.kode_vendor

        if(!kode_vendor) throw new CustomError(httpCode.unauthorized, responseStatus.error, "Belum Terdaftar Sebagai Vendor")

        const id : ParameterSchema["params"]["id"] = req.params.id

        const response = await profilVendorService.getPdfUploadIjinUsaha(id, kode_vendor)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menampilkan Data", response.data)
    } catch (error) {
        errorLogger.error(`Testing Error Get PDF Ijin Usaha Upload  ${error}`)
        next(error)
    }
}

const updateIjinUsaha = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const id : PayloadIjinUsahaUpdateSchema["params"]["id"] = req.params.id

        const request : PayloadIjinUsahaUpdateSchema["body"] = req.body

        const file = req.file

        const response = await profilVendorService.updateIjinUsaha(id, request, file as Express.Multer.File)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Mengubah Ijin Usaha", response)

    } catch (error) {
        errorLogger.error(`Testing Error Store Ijin Usaha  ${error}`)
        next(error)
    }
}

//################# Saham Perusahaan ##############################

const getSahamPerusahaan = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const kode_vendor = req.user.kode_vendor

        if(!kode_vendor) throw new CustomError(httpCode.unauthorized, responseStatus.error, "Belum Terdaftar Sebagai Vendor")

        const response = await profilVendorService.getSahamPerusahaan(kode_vendor)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menampilkan Data", response)

    } catch (error) {
        errorLogger.error(`Testing Error Get Saham Perusahaan Vendor  ${error}`)
        next(error)
    }
}

const storeSahamPerusahaan = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const kode_vendor = req.user.kode_vendor

        if(!kode_vendor) throw new CustomError(httpCode.unauthorized, responseStatus.error, "Belum Terdaftar Sebagai Vendor")

        const request : PayloadSahamPerusahaanSchema["body"] = req.body

        const file = req.file

        const response = await profilVendorService.storeSahamPerusahaan(request, kode_vendor, file as Express.Multer.File)

        responseSuccess(res, httpCode.created, responseStatus.success, "Berhasil Menambah Saham Perusahaan", response)

    } catch (error) {
        errorLogger.error(`Testing Error Store Saham Perusahaan  ${error}`)
        next(error)
    }
}

const hapusSahamPerusahaan = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const id : ParameterSchema["params"]["id"] = req.params.id

        const response = await profilVendorService.hapusSahamPerusahaan(id)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menghapus Saham Perusahaan", response)

    } catch (error) {
        errorLogger.error(`Testing Error Delete Saham Usaha  ${error}`)
        next(error)
    }
}

const getPdfUploadSahamPerusahaan = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const kode_vendor = req.user.kode_vendor

        if(!kode_vendor) throw new CustomError(httpCode.unauthorized, responseStatus.error, "Belum Terdaftar Sebagai Vendor")

        const id : ParameterSchema["params"]["id"] = req.params.id

        const response = await profilVendorService.getPdfUploadSahamPerusahaan(id, kode_vendor)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menampilkan Data", response.data)
    } catch (error) {
        errorLogger.error(`Testing Error Get PDF Saham Perusahaan Upload  ${error}`)
        next(error)
    }
}

const updateSahamPerusahaan = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const id : PayloadSahamPerusahaanUpdateSchema["params"]["id"] = req.params.id

        const request : PayloadSahamPerusahaanUpdateSchema["body"] = req.body

        const file = req.file

        const response = await profilVendorService.updateSahamPerusahaan(id, request, file as Express.Multer.File)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Mengubah Saham Perusahaan", response)

    } catch (error) {
        errorLogger.error(`Testing Error Store Saham Perusahaan  ${error}`)
        next(error)
    }
}

// ###################### Personalia ######################
const getPersonalia = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const kode_vendor = req.user.kode_vendor

        if(!kode_vendor) throw new CustomError(httpCode.unauthorized, responseStatus.error, "Belum Terdaftar Sebagai Vendor")

        const response = await profilVendorService.getPersonalia(kode_vendor)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menampilkan Data", response)

    } catch (error) {
        errorLogger.error(`Testing Error Get Direksi Vendor  ${error}`)
        next(error)
    }
}

const storePersonalia = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const kode_vendor = req.user.kode_vendor

        if(!kode_vendor) throw new CustomError(httpCode.unauthorized, responseStatus.error, "Belum Terdaftar Sebagai Vendor")

        const request : PayloadPersonaliaSchema["body"] = req.body

        const file = req.file

        const response = await profilVendorService.storePersonalia(request, kode_vendor, file as Express.Multer.File)

        responseSuccess(res, httpCode.created, responseStatus.success, "Berhasil Menambah Personalia", response)

    } catch (error) {
        errorLogger.error(`Testing Error Store Personalia Perusahaan  ${error}`)
        next(error)
    }
}

const hapusPersonalia = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const id : ParameterSchema["params"]["id"] = req.params.id

        const response = await profilVendorService.hapusPersonalia(id)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menghapus Personalia Perusahaan", response)

    } catch (error) {
        errorLogger.error(`Testing Error Delete Ijin Usaha  ${error}`)
        next(error)
    }
}

const getPdfUploadPersonalia = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const kode_vendor = req.user.kode_vendor

        if(!kode_vendor) throw new CustomError(httpCode.unauthorized, responseStatus.error, "Belum Terdaftar Sebagai Vendor")

        const id : ParameterSchema["params"]["id"] = req.params.id

        const response = await profilVendorService.getPdfUploadPersonalia(id, kode_vendor)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menampilkan Data", response.data)
    } catch (error) {
        errorLogger.error(`Testing Error Get PDF Saham Perusahaan Upload  ${error}`)
        next(error)
    }
}

const updatePersonalia = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const id : PayloadPersonaliaUpdateSchema["params"]["id"] = req.params.id

        const request : PayloadPersonaliaUpdateSchema["body"] = req.body

        const file = req.file

        const response = await profilVendorService.updatePersonalia(id, request, file as Express.Multer.File)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Mengubah Personalia Perusahaan", response)

    } catch (error) {
        errorLogger.error(`Testing Error Store Personalia Perusahaan  ${error}`)
        next(error)
    }
}

// ######################### Fasilitas ##########################

const getFasilitas = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const kode_vendor = req.user.kode_vendor

        if(!kode_vendor) throw new CustomError(httpCode.unauthorized, responseStatus.error, "Belum Terdaftar Sebagai Vendor")

        const response = await profilVendorService.getFasilitas(kode_vendor)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menampilkan Data", response)

    } catch (error) {
        errorLogger.error(`Testing Error Get Fasilitas Vendor  ${error}`)
        next(error)
    }
}

const storeFasilitas = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const kode_vendor = req.user.kode_vendor

        if(!kode_vendor) throw new CustomError(httpCode.unauthorized, responseStatus.error, "Belum Terdaftar Sebagai Vendor")

        const request : PayloadFasilitasSchema["body"] = req.body

        const files= req.files as { [fieldname: string]: Express.Multer.File[] };

        console.log(files);
        
        const file_bukti_kepemilikan = files['file_bukti_kepemilikan'] ? files['file_bukti_kepemilikan'][0] : undefined; // Assuming 'file1' is the field name for the first file
        console.log(file_bukti_kepemilikan);
        
        const file_foto = files['file_foto'] ? files['file_foto'][0] : undefined; // Assuming 'file2' is the field name for the second file

        if (!file_bukti_kepemilikan || !file_foto) {
            throw new CustomError(httpCode.badRequest, responseStatus.error, "Kedua file harus diupload");
        }

        console.log("FILE 1 : ", file_bukti_kepemilikan);

        console.log("FILE 2 : ", file_foto);
        

        const response = await profilVendorService.storeFasilitas(request, kode_vendor, file_bukti_kepemilikan as Express.Multer.File, file_foto as Express.Multer.File)

        responseSuccess(res, httpCode.created, responseStatus.success, "Berhasil Menambah Fasilitas", response)

    } catch (error) {
        errorLogger.error(`Testing Error Store Fasilitas Perusahaan  ${error}`)
        next(error)
    }
}

const hapusFasilitas = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const id : ParameterSchema["params"]["id"] = req.params.id

        const response = await profilVendorService.hapusFasilitas(id)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menghapus Fasilitas Perusahaan", response)

    } catch (error) {
        errorLogger.error(`Testing Error Delete Fasilitas  ${error}`)
        next(error)
    }
}

const getPdfUploadFasilitasKepemilikan = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const kode_vendor = req.user.kode_vendor

        if(!kode_vendor) throw new CustomError(httpCode.unauthorized, responseStatus.error, "Belum Terdaftar Sebagai Vendor")

        const id : ParameterSchema["params"]["id"] = req.params.id

        const response = await profilVendorService.getPdfUploadFasilitasKepemilikan(id, kode_vendor)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menampilkan Data", response.data)
    } catch (error) {
        errorLogger.error(`Testing Error Get PDF Fasilitas Kepemilikan  ${error}`)
        next(error)
    }
}

const getPdfUploadFasilitasFoto = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const kode_vendor = req.user.kode_vendor

        if(!kode_vendor) throw new CustomError(httpCode.unauthorized, responseStatus.error, "Belum Terdaftar Sebagai Vendor")

        const id : ParameterSchema["params"]["id"] = req.params.id

        const response = await profilVendorService.getPdfUploadFasilitasFoto(id, kode_vendor)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menampilkan Data", response.data)
    } catch (error) {
        errorLogger.error(`Testing Error Get PDF Fasilitas Foto  ${error}`)
        next(error)
    }
}

const updateFasilitas = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const id : PayloadFasilitasUpdateSchema["params"]["id"] = req.params.id

        const request : PayloadFasilitasUpdateSchema["body"] = req.body

        const files= req.files as { [fieldname: string]: Express.Multer.File[] };

        console.log(files);
        
        const file_bukti_kepemilikan = files['file_bukti_kepemilikan'] ? files['file_bukti_kepemilikan'][0] : undefined; // Assuming 'file1' is the field name for the first file
        console.log(file_bukti_kepemilikan);
        
        const file_foto = files['file_foto'] ? files['file_foto'][0] : undefined; // Assuming 'file2' is the field name for the second file

        


        const response = await profilVendorService.updateFasilitas(id, request, file_bukti_kepemilikan as Express.Multer.File, file_foto as Express.Multer.File)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Mengubah Fasilitas Perusahaan", response)

    } catch (error) {
        errorLogger.error(`Testing Error Store Fasilitas Perusahaan  ${error}`)
        next(error)
    }
}

// ######################### Pengalaman ##########################

const getPengalaman = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const kode_vendor = req.user.kode_vendor

        if(!kode_vendor) throw new CustomError(httpCode.unauthorized, responseStatus.error, "Belum Terdaftar Sebagai Vendor")

        const response = await profilVendorService.getPengalaman(kode_vendor)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menampilkan Data", response)

    } catch (error) {
        errorLogger.error(`Testing Error Get Pengalaman Vendor  ${error}`)
        next(error)
    }
}

const storePengalaman = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const kode_vendor = req.user.kode_vendor

        if(!kode_vendor) throw new CustomError(httpCode.unauthorized, responseStatus.error, "Belum Terdaftar Sebagai Vendor")

        const request : PayloadPengalamanSchema["body"] = req.body


        const files= req.files as { [fieldname: string]: Express.Multer.File[] };


        const file_kontrak = files['file_kontrak'] ? files['file_kontrak'][0] : undefined; // Assuming 'file1' is the field name for the first file
        console.log(file_kontrak);
        
        const file_bast = files['file_bast'] ? files['file_bast'][0] : undefined; // Assuming 'file2' is the field name for the second file

        if (!file_kontrak || !file_bast) {
            throw new CustomError(httpCode.badRequest, responseStatus.error, "Kedua file harus diupload");
        }

        
        const response = await profilVendorService.storePengalaman(request, kode_vendor, file_kontrak as Express.Multer.File, file_bast as Express.Multer.File)

        responseSuccess(res, httpCode.created, responseStatus.success, "Berhasil Menambah Pengalaman", response)

    } catch (error) {
        errorLogger.error(`Testing Error Store Pengalaman Perusahaan  ${error}`)
        next(error)
    }
}

const hapusPengalamanBadanUsaha = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const id : ParameterSchema["params"]["id"] = req.params.id

        const response = await profilVendorService.hapusPengalamanBadanUsaha(id)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menghapus Pengalaman Perusahaan", response)

    } catch (error) {
        errorLogger.error(`Testing Error Delete Pengalaman  ${error}`)
        next(error)
    }
}

const getPdfUploadPengalamanKontrak = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const kode_vendor = req.user.kode_vendor

        if(!kode_vendor) throw new CustomError(httpCode.unauthorized, responseStatus.error, "Belum Terdaftar Sebagai Vendor")

        const id : ParameterSchema["params"]["id"] = req.params.id

        const response = await profilVendorService.getPdfUploadPengalamanKontrak(id, kode_vendor)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menampilkan Data", response.data)
    } catch (error) {
        errorLogger.error(`Testing Error Get PDF Pengalaman Perusahaan Upload  ${error}`)
        next(error)
    }
}

const getPdfUploadPengalamanBast = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const kode_vendor = req.user.kode_vendor

        if(!kode_vendor) throw new CustomError(httpCode.unauthorized, responseStatus.error, "Belum Terdaftar Sebagai Vendor")

        const id : ParameterSchema["params"]["id"] = req.params.id

        const response = await profilVendorService.getPdfUploadPengalamanBast(id, kode_vendor)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menampilkan Data", response.data)
    } catch (error) {
        errorLogger.error(`Testing Error Get PDF Pengalaman Perusahaan Upload  ${error}`)
        next(error)
    }
}

const updatePengalaman = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const id : PayloadPengalamanUpdateSchema["params"]["id"] = req.params.id

        const request : PayloadPengalamanUpdateSchema["body"] = req.body
        const files= req.files as { [fieldname: string]: Express.Multer.File[] };


        const file_kontrak = files['file_kontrak'] ? files['file_kontrak'][0] : undefined; // Assuming 'file1' is the field name for the first file
        console.log(file_kontrak);
        
        const file_bast = files['file_bast'] ? files['file_bast'][0] : undefined; // Assuming 'file2' is the field name for the second file

        const response = await profilVendorService.updatePengalaman(id, request, file_kontrak as Express.Multer.File, file_bast as Express.Multer.File)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Mengubah Pengalaman Perusahaan", response)

    } catch (error) {
        errorLogger.error(`Testing Error Update Pengalaman Perusahaan  ${error}`)
        next(error)
    }
}

// #################### Tenaga Ahli #########################################
const getTenagaAhli = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const kode_vendor = req.user.kode_vendor

        if(!kode_vendor) throw new CustomError(httpCode.unauthorized, responseStatus.error, "Belum Terdaftar Sebagai Vendor")

        const response = await profilVendorService.getTenagaAhli(kode_vendor)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menampilkan Data", response)

    } catch (error) {
        errorLogger.error(`Testing Error Get Tenaga Ahli Vendor  ${error}`)
        next(error)
    }
}

const storeTenagaAhli = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const kode_vendor = req.user.kode_vendor

        if(!kode_vendor) throw new CustomError(httpCode.unauthorized, responseStatus.error, "Belum Terdaftar Sebagai Vendor")

        const request : PayloadTenagaAhliSchema["body"] = req.body


        const files= req.files as { [fieldname: string]: Express.Multer.File[] };


        const file_ktp = files['file_ktp'] ? files['file_ktp'][0] : undefined; // Assuming 'file1' is the field name for the first file
        
        const file_ijazah = files['file_ijazah'] ? files['file_ijazah'][0] : undefined; // Assuming 'file2' is the field name for the second file

        const file_cv = files['file_cv'] ? files['file_cv'][0] : undefined; // Assuming 'file2' is the field name for the second file


        if (!file_ktp || !file_ijazah || !file_cv) {
            throw new CustomError(httpCode.badRequest, responseStatus.error, "Semua file harus diupload");
        }

        
        const response = await profilVendorService.storeTenagaAhli(request, kode_vendor, file_ktp as Express.Multer.File, file_cv as Express.Multer.File, file_ijazah as Express.Multer.File)

        responseSuccess(res, httpCode.created, responseStatus.success, "Berhasil Menambah Tenaga Ahli", response)

    } catch (error) {
        errorLogger.error(`Testing Error Store Tenaga Ahli ${error}`)
        next(error)
    }
}

const hapusTenagaAhli = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const id : ParameterSchema["params"]["id"] = req.params.id

        const response = await profilVendorService.hapusTenagaAhli(id)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menghapus Tenaga Ahli", response)

    } catch (error) {
        errorLogger.error(`Testing Error Delete Tenaga Ahli  ${error}`)
        next(error)
    }
}

const updateTenagaAhli = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const id : PayloadTenagaAhliUpdateSchema["params"]["id"] = req.params.id

        const request : PayloadTenagaAhliUpdateSchema["body"] = req.body
        const files= req.files as { [fieldname: string]: Express.Multer.File[] };


        const file_ktp = files['file_ktp'] ? files['file_ktp'][0] : undefined; // Assuming 'file1' is the field name for the first file
        
        const file_ijazah = files['file_ijazah'] ? files['file_ijazah'][0] : undefined; // Assuming 'file2' is the field name for the second file

        const file_cv = files['file_cv'] ? files['file_cv'][0] : undefined; // Assuming 'file2' is the field name for the second file


        const response = await profilVendorService.updateTenagaAhli(id, request, file_ktp as Express.Multer.File, file_ijazah as Express.Multer.File, file_cv as Express.Multer.File)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Mengubah Tenaga Ahli", response)

    } catch (error) {
        errorLogger.error(`Testing Error Update Tenaga Ahli  ${error}`)
        next(error)
    }
}

const getPdfUploadTenagaAhliKtp = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const kode_vendor = req.user.kode_vendor

        if(!kode_vendor) throw new CustomError(httpCode.unauthorized, responseStatus.error, "Belum Terdaftar Sebagai Vendor")

        const id : ParameterSchema["params"]["id"] = req.params.id

        const response = await profilVendorService.getPdfUploadTenagaAhliKtp(id, kode_vendor)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menampilkan Data", response.data)
    } catch (error) {
        errorLogger.error(`Testing Error Get PDF Tenaga Ahli KTP  ${error}`)
        next(error)
    }
}

const getPdfUploadTenagaAhliCv = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const kode_vendor = req.user.kode_vendor

        if(!kode_vendor) throw new CustomError(httpCode.unauthorized, responseStatus.error, "Belum Terdaftar Sebagai Vendor")

        const id : ParameterSchema["params"]["id"] = req.params.id

        const response = await profilVendorService.getPdfUploadTenagaAhliCv(id, kode_vendor)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menampilkan Data", response.data)
    } catch (error) {
        errorLogger.error(`Testing Error Get PDF Tenaga Ahli CV  ${error}`)
        next(error)
    }
}

const getPdfUploadTenagaAhliIjazah = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const kode_vendor = req.user.kode_vendor

        if(!kode_vendor) throw new CustomError(httpCode.unauthorized, responseStatus.error, "Belum Terdaftar Sebagai Vendor")

        const id : ParameterSchema["params"]["id"] = req.params.id

        const response = await profilVendorService.getPdfUploadTenagaAhliIjazah(id, kode_vendor)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menampilkan Data", response.data)
    } catch (error) {
        errorLogger.error(`Testing Error Get PDF Tenaga Ahli Ijazah  ${error}`)
        next(error)
    }
}

// ################### Kantor ##########################################
const getKantor = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const kode_vendor = req.user.kode_vendor

        if(!kode_vendor) throw new CustomError(httpCode.unauthorized, responseStatus.error, "Belum Terdaftar Sebagai Vendor")

        const response = await profilVendorService.getKantor(kode_vendor)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menampilkan Data", response)

    } catch (error) {
        errorLogger.error(`Testing Error Get Kantor  ${error}`)
        next(error)
    }
}

const storeKantor = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const kode_vendor = req.user.kode_vendor

        if(!kode_vendor) throw new CustomError(httpCode.unauthorized, responseStatus.error, "Belum Terdaftar Sebagai Vendor")

        const request : PayloadKantorSchema["body"] = req.body

        const file = req.file

        const response = await profilVendorService.storeKantor(request, kode_vendor, file as Express.Multer.File)

        responseSuccess(res, httpCode.created, responseStatus.success, "Berhasil Menambah Kantor", response)

    } catch (error) {
        errorLogger.error(`Testing Error Store Saham Perusahaan  ${error}`)
        next(error)
    }
}

const hapusKantor = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const id : ParameterSchema["params"]["id"] = req.params.id

        const response = await profilVendorService.hapusKantor(id)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menghapus Kantor", response)

    } catch (error) {
        errorLogger.error(`Testing Error Delete Kantor  ${error}`)
        next(error)
    }
}

const getPdfUploadKantor = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const kode_vendor = req.user.kode_vendor

        if(!kode_vendor) throw new CustomError(httpCode.unauthorized, responseStatus.error, "Belum Terdaftar Sebagai Vendor")

        const id : ParameterSchema["params"]["id"] = req.params.id

        const response = await profilVendorService.getPdfUploadKantor(id, kode_vendor)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menampilkan Data", response.data)
    } catch (error) {
        errorLogger.error(`Testing Error Get PDF Kantor  ${error}`)
        next(error)
    }
}

const updateKantor = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const id : PayloadKantorUpdateSchema["params"]["id"] = req.params.id

        const request : PayloadKantorUpdateSchema["body"] = req.body

        const file = req.file

        const response = await profilVendorService.updateKantor(id, request, file as Express.Multer.File)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Mengubah Kantor", response)

    } catch (error) {
        errorLogger.error(`Testing Error Store Kantor  ${error}`)
        next(error)
    }
}


// #################### Tenaga Pendukung ####################################
const getTenagaPendukung = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const kode_vendor = req.user.kode_vendor

        if(!kode_vendor) throw new CustomError(httpCode.unauthorized, responseStatus.error, "Belum Terdaftar Sebagai Vendor")

        const response = await profilVendorService.getTenagaPendukung(kode_vendor)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menampilkan Data", response)

    } catch (error) {
        errorLogger.error(`Testing Error Get Direksi Vendor  ${error}`)
        next(error)
    }
}

const storeTenagaPendukung = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const kode_vendor = req.user.kode_vendor

        if(!kode_vendor) throw new CustomError(httpCode.unauthorized, responseStatus.error, "Belum Terdaftar Sebagai Vendor")

        const request : PayloadTenagaPendukungSchema["body"] = req.body


        const files= req.files as { [fieldname: string]: Express.Multer.File[] };


        const file_ktp = files['file_ktp'] ? files['file_ktp'][0] : undefined; // Assuming 'file1' is the field name for the first file
        
        const file_ijazah = files['file_ijazah'] ? files['file_ijazah'][0] : undefined; // Assuming 'file2' is the field name for the second file

        const file_cv = files['file_cv'] ? files['file_cv'][0] : undefined; // Assuming 'file2' is the field name for the second file


        if (!file_ktp || !file_ijazah || !file_cv) {
            throw new CustomError(httpCode.badRequest, responseStatus.error, "Semua file harus diupload");
        }

        
        const response = await profilVendorService.storeTenagaPendukung(request, kode_vendor, file_ktp as Express.Multer.File, file_cv as Express.Multer.File, file_ijazah as Express.Multer.File)

        responseSuccess(res, httpCode.created, responseStatus.success, "Berhasil Menambah Tenaga Pendukung", response)

    } catch (error) {
        errorLogger.error(`Testing Error Store Tenaga Pendukung  ${error}`)
        next(error)
    }
}

const hapusTenagaPendukung = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const id : ParameterSchema["params"]["id"] = req.params.id

        const response = await profilVendorService.hapusTenagaPendukung(id)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menghapus Tenaga Pendukung", response)

    } catch (error) {
        errorLogger.error(`Testing Error Delete Tenaga Pendukung  ${error}`)
        next(error)
    }
}

const updateTenagaPendukung = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const id : PayloadTenagaAhliUpdateSchema["params"]["id"] = req.params.id

        const request : PayloadTenagaAhliUpdateSchema["body"] = req.body
        const files= req.files as { [fieldname: string]: Express.Multer.File[] };


        const file_ktp = files['file_ktp'] ? files['file_ktp'][0] : undefined; // Assuming 'file1' is the field name for the first file
        
        const file_ijazah = files['file_ijazah'] ? files['file_ijazah'][0] : undefined; // Assuming 'file2' is the field name for the second file

        const file_cv = files['file_cv'] ? files['file_cv'][0] : undefined; // Assuming 'file2' is the field name for the second file


        const response = await profilVendorService.updateTenagaPendukung(id, request, file_ktp as Express.Multer.File, file_ijazah as Express.Multer.File, file_cv as Express.Multer.File)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Mengubah Tenaga Pendukung", response)

    } catch (error) {
        errorLogger.error(`Testing Error Store Pengalaman Perusahaan  ${error}`)
        next(error)
    }
}

const getPdfUploadTenagaPendukungKtp = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const kode_vendor = req.user.kode_vendor

        if(!kode_vendor) throw new CustomError(httpCode.unauthorized, responseStatus.error, "Belum Terdaftar Sebagai Vendor")

        const id : ParameterSchema["params"]["id"] = req.params.id

        const response = await profilVendorService.getPdfUploadTenagaPendukungKtp(id, kode_vendor)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menampilkan Data", response.data)
    } catch (error) {
        errorLogger.error(`Testing Error Get PDF Tenaga Pendukung KTP  ${error}`)
        next(error)
    }
}

const getPdfUploadTenagaPendukungCv = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const kode_vendor = req.user.kode_vendor

        if(!kode_vendor) throw new CustomError(httpCode.unauthorized, responseStatus.error, "Belum Terdaftar Sebagai Vendor")

        const id : ParameterSchema["params"]["id"] = req.params.id

        const response = await profilVendorService.getPdfUploadTenagaPendukungCv(id, kode_vendor)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menampilkan Data", response.data)
    } catch (error) {
        errorLogger.error(`Testing Error Get PDF Tenaga Pendukung CV  ${error}`)
        next(error)
    }
}

const getPdfUploadTenagaPendukungIjazah = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const kode_vendor = req.user.kode_vendor

        if(!kode_vendor) throw new CustomError(httpCode.unauthorized, responseStatus.error, "Belum Terdaftar Sebagai Vendor")

        const id : ParameterSchema["params"]["id"] = req.params.id

        const response = await profilVendorService.getPdfUploadTenagaPendukungIjazah(id, kode_vendor)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menampilkan Data", response.data)
    } catch (error) {
        errorLogger.error(`Testing Error Get PDF Tenaga Pendukung Ijazah  ${error}`)
        next(error)
    }
}

// #################### Pengalaman Sekarang ##################################

const getPengalamanSekarang = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const kode_vendor = req.user.kode_vendor

        if(!kode_vendor) throw new CustomError(httpCode.unauthorized, responseStatus.error, "Belum Terdaftar Sebagai Vendor")

        const response = await profilVendorService.getPengalamanSekarang(kode_vendor)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menampilkan Data", response)

    } catch (error) {
        errorLogger.error(`Testing Error Get Pengalaman Sekarang Vendor  ${error}`)
        next(error)
    }
}

const storePengalamanSekarang = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const kode_vendor = req.user.kode_vendor

        if(!kode_vendor) throw new CustomError(httpCode.unauthorized, responseStatus.error, "Belum Terdaftar Sebagai Vendor")

        const request : PayloadPengalamanSekarangSchema["body"] = req.body

        const file = req.file

        const response = await profilVendorService.storePengalamanSekarang(request, kode_vendor, file as Express.Multer.File)

        responseSuccess(res, httpCode.created, responseStatus.success, "Berhasil Menambah Pengalaman Sekarang", response)

    } catch (error) {
        errorLogger.error(`Testing Error Store Pengalaman Perusahaan  ${error}`)
        next(error)
    }
}

const hapusPengalamanSekarangBadanUsaha = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const id : ParameterSchema["params"]["id"] = req.params.id

        const response = await profilVendorService.hapusPengalamanSekarangBadanUsaha(id)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menghapus Pengalaman Sekarang Perusahaan", response)

    } catch (error) {
        errorLogger.error(`Testing Error Delete Pengalaman Sekarang  ${error}`)
        next(error)
    }
}

const getPdfUploadPengalamanSekarang = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const kode_vendor = req.user.kode_vendor

        if(!kode_vendor) throw new CustomError(httpCode.unauthorized, responseStatus.error, "Belum Terdaftar Sebagai Vendor")

        const id : ParameterSchema["params"]["id"] = req.params.id

        const response = await profilVendorService.getPdfUploadPengalamanSekarang(id, kode_vendor)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menampilkan Data", response.data)
    } catch (error) {
        errorLogger.error(`Testing Error Get PDF Pengalaman Sekarang Perusahaan Upload  ${error}`)
        next(error)
    }
}

const updatePengalamanSekarang = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const id : PayloadPengalamanSekarangUpdateSchema["params"]["id"] = req.params.id

        const request : PayloadPengalamanSekarangUpdateSchema["body"] = req.body

        const file = req.file

        const response = await profilVendorService.updatePengalamanSekarang(id, request, file as Express.Multer.File)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Mengubah Pengalaman Sekarang Perusahaan", response)

    } catch (error) {
        errorLogger.error(`Testing Error Store Pengalaman Sekarang Perusahaan  ${error}`)
        next(error)
    }
}

//PengalamanTA 
const getPengalamanTa = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const id : ParameterSchema["params"]["id"] = req.params.id

        const response = await profilVendorService.getAllPengalamanTa(id)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menampilkan Data", response)

    } catch (error) {
        errorLogger.error(`Testing Error Get Kantor  ${error}`)
        next(error)
    }
}

const storePengalamanTA = async (
    req:Request,
    res:Response,
    next:NextFunction ) : Promise<void> => {
    try {

        const request : PayloadPengalamanTaSchema["body"] = req.body

        console.log("TES REQUEST : ",request);
        

        const file = req.files

        // console.log(file);
        
        
        // console.log(file);
        

        const response = await profilVendorService.storePengalamanTA(request, file as Express.Multer.File[])

        responseSuccess(res, httpCode.created, responseStatus.success, "Berhasil Menambah Pengalaman TA", response)

    } catch (error) {
        errorLogger.error(`Testing Error Store Pengalaman TA  ${error}`)
        next(error)
    }
}

const storePengalamanTASatuan = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const request : PayloadPengalamanTaSatuanSchema["body"] = req.body

        const file = req.file

        const response = await profilVendorService.storePengalamanTASatuan(request, file as Express.Multer.File)

        responseSuccess(res, httpCode.created, responseStatus.success, "Berhasil Menambah Pengalaman TA", response)

    } catch (error) {
        errorLogger.error(`Testing Error Store Pengalaman TA  ${error}`)
        next(error)
    }
}

const getPdfUploadPengalamanTa = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const kode_vendor = req.user.kode_vendor

        if(!kode_vendor) throw new CustomError(httpCode.unauthorized, responseStatus.error, "Belum Terdaftar Sebagai Vendor")

        const id : ParameterSchema["params"]["id"] = req.params.id

        const response = await profilVendorService.getPdfUploadPengalamanTa(id, kode_vendor)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menampilkan Data", response.data)
    } catch (error) {
        errorLogger.error(`Testing Error Get PDF Tenaga Pendukung CV  ${error}`)
        next(error)
    }
}

//PengalamanTP
const getPengalamanTp = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const id : ParameterSchema["params"]["id"] = req.params.id

        const response = await profilVendorService.getAllPengalamanTp(id)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menampilkan Data", response)

    } catch (error) {
        errorLogger.error(`Testing Error Get Kantor  ${error}`)
        next(error)
    }
}

const storePengalamanTP = async (
    req:Request,
    res:Response,
    next:NextFunction ) : Promise<void> => {
    try {

        const request : PayloadPengalamanTpSchema["body"] = req.body

        

        const file = req.files

        const response = await profilVendorService.storePengalamanTP(request, file as Express.Multer.File[])

        responseSuccess(res, httpCode.created, responseStatus.success, "Berhasil Menambah Pengalaman TA", response)

    } catch (error) {
        errorLogger.error(`Testing Error Store Pengalaman TA  ${error}`)
        next(error)
    }
}

const storePengalamanTPSatuan = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const request : PayloadPengalamaTpSatuanSchema["body"] = req.body

        const file = req.file

        const response = await profilVendorService.storePengalamanTPSatuan(request, file as Express.Multer.File)

        responseSuccess(res, httpCode.created, responseStatus.success, "Berhasil Menambah Pengalaman TP", response)

    } catch (error) {
        errorLogger.error(`Testing Error Store Pengalaman TA  ${error}`)
        next(error)
    }
}



const getPdfUploadPengalamanTp = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const kode_vendor = req.user.kode_vendor

        if(!kode_vendor) throw new CustomError(httpCode.unauthorized, responseStatus.error, "Belum Terdaftar Sebagai Vendor")

        const id : ParameterSchema["params"]["id"] = req.params.id

        const response = await profilVendorService.getPdfUploadPengalamanTa(id, kode_vendor)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menampilkan Data", response.data)
    } catch (error) {
        errorLogger.error(`Testing Error Get PDF Tenaga Pendukung CV  ${error}`)
        next(error)
    }
}

//Sertifikat TA
const getSertifikatTA = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const id : ParameterSchema["params"]["id"] = req.params.id

        const response = await profilVendorService.getAllSertifikatTa(id)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menampilkan Data", response)

    } catch (error) {
        errorLogger.error(`Testing Error Get Kantor  ${error}`)
        next(error)
    }
}

const storeSertifikatTA = async (
    req:Request,
    res:Response,
    next:NextFunction ) : Promise<void> => {
    try {

        const request : PayloadSertifikatTASchema["body"] = req.body

        

        const file = req.files

        const response = await profilVendorService.storeSertifTa(request, file as Express.Multer.File[])

        responseSuccess(res, httpCode.created, responseStatus.success, "Berhasil Menambah Sertifikat TA", response)

    } catch (error) {
        errorLogger.error(`Testing Error Store Pengalaman TA  ${error}`)
        next(error)
    }
}

const storeSertifikatTASatuan = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const request : PayloadSertifikatTASatuanSchema["body"] = req.body

        const file = req.file

        const response = await profilVendorService.storeSertifikatTASatuan(request, file as Express.Multer.File)

        responseSuccess(res, httpCode.created, responseStatus.success, "Berhasil Menambah Sertifikat TA", response)

    } catch (error) {
        errorLogger.error(`Testing Error Store Pengalaman TA  ${error}`)
        next(error)
    }
}


const getPdfUploadSertifikatTa = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const kode_vendor = req.user.kode_vendor

        if(!kode_vendor) throw new CustomError(httpCode.unauthorized, responseStatus.error, "Belum Terdaftar Sebagai Vendor")

        const id : ParameterSchema["params"]["id"] = req.params.id

        const response = await profilVendorService.getPdfUploadSertifikatTa(id, kode_vendor)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menampilkan Data", response.data)
    } catch (error) {
        errorLogger.error(`Testing Error Get PDF Tenaga Pendukung CV  ${error}`)
        next(error)
    }
}


//SERTIFIKAT TP

const getSertifikatTP = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const id : ParameterSchema["params"]["id"] = req.params.id

        const response = await profilVendorService.getAllSertifikatTp(id)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menampilkan Data", response)

    } catch (error) {
        errorLogger.error(`Testing Error Get Kantor  ${error}`)
        next(error)
    }
}

const storeSertifikatTP = async (
    req:Request,
    res:Response,
    next:NextFunction ) : Promise<void> => {
    try {

        const request : PayloadSertifikatTPSchema["body"] = req.body

        

        const file = req.files

        const response = await profilVendorService.storeSertifTP(request, file as Express.Multer.File[])

        responseSuccess(res, httpCode.created, responseStatus.success, "Berhasil Menambah Sertifikat TP", response)

    } catch (error) {
        errorLogger.error(`Testing Error Store Sertifikat TP  ${error}`)
        next(error)
    }
}

const storeSertifikatTPSatuan = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const request : PayloadSertifikatTPSatuanSchema["body"] = req.body

        const file = req.file

        const response = await profilVendorService.storeSertifikatTPSatuan(request, file as Express.Multer.File)

        responseSuccess(res, httpCode.created, responseStatus.success, "Berhasil Menambah Sertifikat TP", response)

    } catch (error) {
        errorLogger.error(`Testing Error Store Pengalaman TA  ${error}`)
        next(error)
    }
}

const getPdfUploadSertifikatTP = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const kode_vendor = req.user.kode_vendor

        if(!kode_vendor) throw new CustomError(httpCode.unauthorized, responseStatus.error, "Belum Terdaftar Sebagai Vendor")

        const id : ParameterSchema["params"]["id"] = req.params.id

        const response = await profilVendorService.getPdfUploadSertifikatTp(id, kode_vendor)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menampilkan Data", response.data)
    } catch (error) {
        errorLogger.error(`Testing Error Get PDF Sertifikat TP  ${error}`)
        next(error)
    }
}

export default{
    getMenuAll,
    getSubMenu,
    katItemTanya,
    listPertanyaanPerorangan,
    storeProfilVendor,
    storeUpload,
    getProfilVendor,
    hapusProfil,
    tesDomisili,
    domisili,
    storeUploadSertifikat,
    storeUploadPengalamanOrang,
    hapusSertifikat,
    hapusPengalaman,
    getMenuStatus,
    hapusProfilUpload,
    getSertifikat,
    getPengalamanVendor,
    getPdfUpload,
    getPdfUploadSertifikat,
    getPdfUploadPengalamanPerorangan,

    //Badan Usaha

    //List Tanya
    listPertanyaanBadanUsaha,

    //Komisaris 
    getKomisarisVendor,
    storeUploadKomisaris,
    hapusKomisaris,
    getPdfUploadKomisaris,
    updateKomisaris,

    //Direksi 
    getDireksiVendor,
    storeUploadDireksi,
    hapusDireksi,
    getPdfUploadDireksi,
    updateDireksi,

    //Ijin Usaha
    getIjinUsaha,
    storeIjinUsaha,
    hapusIjinUsaha,
    getPdfUploadIjinUsaha,
    updateIjinUsaha,

    //Saham Perusahaan
    getSahamPerusahaan,
    storeSahamPerusahaan,
    hapusSahamPerusahaan,
    getPdfUploadSahamPerusahaan,
    updateSahamPerusahaan,

    //Personalia 
    getPersonalia,
    storePersonalia,
    hapusPersonalia,
    getPdfUploadPersonalia,
    updatePersonalia,

    //Fasilitas 
    getFasilitas,
    storeFasilitas,
    hapusFasilitas,
    getPdfUploadFasilitasKepemilikan,
    getPdfUploadFasilitasFoto,
    updateFasilitas,

    //Pengalaman
    getPengalaman,
    storePengalaman,
    hapusPengalamanBadanUsaha,
    getPdfUploadPengalamanKontrak,
    getPdfUploadPengalamanBast,
    updatePengalaman,

    //Pengalaman Sekarang
    getPengalamanSekarang,
    storePengalamanSekarang,
    hapusPengalamanSekarangBadanUsaha,
    getPdfUploadPengalamanSekarang,
    updatePengalamanSekarang,

    //Kantor
    getKantor,
    storeKantor,
    hapusKantor,
    getPdfUploadKantor,
    updateKantor,

    //Tenaga Pendukung
    getTenagaPendukung,
    storeTenagaPendukung,
    hapusTenagaPendukung,
    updateTenagaPendukung,
    getPdfUploadTenagaPendukungKtp,
    getPdfUploadTenagaPendukungCv,
    getPdfUploadTenagaPendukungIjazah,

    //Tenaga Ahli 
    getTenagaAhli,
    storeTenagaAhli,
    hapusTenagaAhli,
    updateTenagaAhli,
    getPdfUploadTenagaAhliKtp,
    getPdfUploadTenagaAhliCv,
    getPdfUploadTenagaAhliIjazah,

    //Pengalaman TA
    storePengalamanTA,
    getPdfUploadPengalamanTa,
    getPengalamanTa,
    storePengalamanTASatuan,

    //Pengalaman TP
    storePengalamanTP,
    getPdfUploadPengalamanTp,
    getPengalamanTp,
    storePengalamanTPSatuan,


    //SERTIFIKAT TA
    getSertifikatTA,
    storeSertifikatTA,
    getPdfUploadSertifikatTa,
    storeSertifikatTASatuan,

    //SERTIFIKAT TP 
    getSertifikatTP,
    storeSertifikatTP,
    getPdfUploadSertifikatTP,
    storeSertifikatTPSatuan,

    




}