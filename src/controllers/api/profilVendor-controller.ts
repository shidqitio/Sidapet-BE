import { httpCode, responseStatus } from "@utils/prefix";
import { responseSuccess } from "@utils/response-success";
import { Request, Response, NextFunction, response } from "express";
import { errorLogger, debugLogger } from "@config/logger";
import {
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

export default{
    getMenuAll,
    getSubMenu,
    katItemTanya,
}