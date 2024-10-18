import { httpCode, responseStatus } from "@utils/prefix";
import { responseSuccess, responseSuccessCount } from "@utils/response-success";
import { Request, Response, NextFunction } from "express";
import { errorLogger, debugLogger } from "@config/logger";
import {
    PayloadRegisterSchema, 
    ParamsRegisterVendorSchema,
    UpdateStatusRegisterSchema,
    QuerySchema,
    ParameterSchema,
    ParamaterStatusVendorSchema,
} from "@schema/api/vendorRegister-schema"

import vendorRegisterService from "@services/api/v1/vendorRegister-service";

//Get All Vendor
const getAllVendor = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const page : QuerySchema["query"]["page"] = req.query.page as string
        const limit : QuerySchema["query"]["limit"] = req.query.limit as string

        const response = await vendorRegisterService.getAllVendor(page, limit)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menampilkan Data", response, page, limit)
    
    } catch (error) {
        errorLogger.error(`Testing Error Get All Vendor ${error}`)
        next(error)
    }
}

//Get All Vendor By Status Verif
const getVendorbyStatusVerifikasi = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const page : QuerySchema["query"]["page"] = req.query.page as string
        const limit : QuerySchema["query"]["limit"] = req.query.limit as string

        const id : ParamaterStatusVendorSchema["params"]["id"] = req.params.id as any

        const response = await vendorRegisterService.getVendorbyStatusVerifikasi(page, limit, id)


        responseSuccessCount(res, httpCode.ok, responseStatus.success, "Berhasil Menampilkan Data", response, page, limit, response[0].count_data_show)
    
    } catch (error) {
        errorLogger.error(`Testing Error Get All By Status Vendor ${error}`)
        next(error)
    }
}

//Register Vendor
const registerVendor = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const request : PayloadRegisterSchema["body"] = req.body


        const response = await vendorRegisterService.registerVendor(request, req.file as Express.Multer.File)

        responseSuccess(res, httpCode.created, responseStatus.success, "Berhasil Register Vendor", response)
    } catch (error) {
        errorLogger.error(`Testing Error Register Vendor ${error}`)
        next(error)
    }
}


//Get Detail Vendor
const getRegisterVendorDetail = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const id : ParameterSchema["params"]["id"] = req.params.id


        const response = await vendorRegisterService.getRegisterVendorDetail(id)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menampilkan Data", response)
    } catch (error) {
        errorLogger.error(`Testing Error Register Vendor ${error}`)
        next(error)
    }
}

//Update Status Vendor
const updateStatusVendor = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const id : ParameterSchema["params"]["id"] = req.params.id
        const status_register : UpdateStatusRegisterSchema["body"]["status_register"] = req.body.status_register
        const alasan = req.body.alasan
        
        const uch = req.user ? req.user.email : null

        const response = await vendorRegisterService.updateStatusVendor(id, status_register, alasan, uch)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Mengubah Status", response )
    } catch (error) {
        errorLogger.error(`Testing Error Update Status Vendor ${error}`)
        next(error)
    }
}

//Register External to Usman
const insertExternaltoUsman = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const id : ParameterSchema["params"]["id"] = req.params.id

        const response = await vendorRegisterService.insertExternaltoUsman(id)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Masuk Usman", response)
    } catch (error) {
        errorLogger.error(`Testing Error External To Usman ${error}`)
        next(error)
    }
}

const migrasiUserUsman = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const response = await vendorRegisterService.migrasiUserUsman()

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Migrasi Data Usman", response)
    } catch (error) {
        errorLogger.error(`Testing Error Migrasi Usman ${error}`)
        next(error)
    }
}

//Get All Vendor By Status Verif Search
const getVendorbyStatusVerifikasiSearch = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const page : QuerySchema["query"]["page"] = req.query.page as string
        const limit : QuerySchema["query"]["limit"] = req.query.limit as string


        const id : ParamaterStatusVendorSchema["params"]["id"] = req.params.id as any

        const {search_input, jenis_vendor} = req.body

        const response = await vendorRegisterService.getVendorbyStatusVerifikasiSearch(page, limit, id, search_input, jenis_vendor)


        responseSuccessCount(res, httpCode.ok, responseStatus.success, "Berhasil Menampilkan Data", response, page, limit, response.count_data_show)
    
    } catch (error) {
        errorLogger.error(`Testing Error Get All By Status Vendor ${error}`)
        next(error)
    }
}

export default {
    getAllVendor, 
    getRegisterVendorDetail,
    getVendorbyStatusVerifikasi,
    updateStatusVendor,
    insertExternaltoUsman,
    registerVendor,
    migrasiUserUsman,
    getVendorbyStatusVerifikasiSearch
}