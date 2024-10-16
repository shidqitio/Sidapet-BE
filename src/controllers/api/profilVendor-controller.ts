import { httpCode, responseStatus } from "@utils/prefix";
import { responseSuccess } from "@utils/response-success";
import { Request, Response, NextFunction, response } from "express";
import { errorLogger, debugLogger } from "@config/logger";
import {
StoreProfilVendorSchema,
ParameterSchema,
QuerySchema
} from "@schema/api/profilVendor-schema"

import profilVendorService from "@services/api/v1/profilVendor-service";

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

        const response = await profilVendorService.storeProfilVendor(request)

        responseSuccess(res,httpCode.created, responseStatus.success, "Berhasil Menampilkan Data", response)
    } catch (error) {
        errorLogger.error(`Testing Error Store Profil Vendor ${error}`)
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

export default{
    getMenuAll,
    getSubMenu,
    katItemTanya,
    listPertanyaanPerorangan,
    storeProfilVendor,
    tesDomisili
}