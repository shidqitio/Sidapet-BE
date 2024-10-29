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
StoreUploadPengalamanSchema
} from "@schema/api/profilVendor-schema"

import profilVendorService from "@services/api/v1/profilVendor-service";
import CustomError from "@middleware/error-handler";

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

const storeUploadSertifikat = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const request : StoreUploadSertifikatSchema["body"] = req.body

        const kode_vendor = req.user.kode_vendor

        if(!kode_vendor) throw new CustomError(httpCode.unauthorized, responseStatus.error, "Belum Terdaftar Sebagai Vendor")

        const response = await profilVendorService.storeUploadSertifikat(request, req.file as Express.Multer.File, kode_vendor)

        responseSuccess(res, httpCode.created, responseStatus.success, "Data Sertifikat Berhasil Di Upload", response)

    } catch (error) {
        errorLogger.error(`Testing Error Store Upload Sertifikat ${error}`)
        next(error)
    }
}

const storeUploadPengalamanOrang = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const request : StoreUploadPengalamanSchema["body"] = req.body

        const kode_vendor = req.user.kode_vendor

        if(!kode_vendor) throw new CustomError(httpCode.unauthorized, responseStatus.error, "Belum Terdaftar Sebagai Vendor")

        const response = await profilVendorService.uploadPengalamanOrang(request, req.file as Express.Multer.File, kode_vendor)

        responseSuccess(res, httpCode.created, responseStatus.success, "Data Sertifikat Berhasil Di Upload", response)
    } catch (error) {
        errorLogger.error(`Testing Error Store Upload Pengalaman Orang ${error}`)
        next(error)
    }
}

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

        res.send(response)
    } catch (error) {
        errorLogger.error(`Testing Error Get PDF Upload  ${error}`)
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
    getPdfUpload
}