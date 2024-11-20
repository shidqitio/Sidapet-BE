import { httpCode, responseStatus } from "@utils/prefix";
import { responseSuccess } from "@utils/response-success";
import { Request, Response, NextFunction } from "express";
import { errorLogger, debugLogger } from "@config/logger";
import {
    PayloadItemTanyaSchema,
    ParameterSchema
} from "@schema/api/itemTanya-schema"
import CustomError from "@middleware/error-handler";
import itemTanyaService from "@services/api/v1/itemTanya-service";


const getKatDokVendor = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const id : ParameterSchema["params"]["id"] = req.params.id

        const response = await itemTanyaService.getKatDokVendor(id)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menampilkan Data", response)
    } catch (error) {
        errorLogger.error(`Testing Error Get All getKatDokVendor ${error}`)
        next(error)
    }
}

const getKatItemTanya = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const id : ParameterSchema["params"]["id"] = req.params.id

        const response = await itemTanyaService.getKatItemTanya(id)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menampilkan Data", response)
    } catch (error) {
        errorLogger.error(`Testing Error Get All getKatItemTanya ${error}`)
        next(error)
    }
}

const getItemTanyaCustom = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const id : ParameterSchema["params"]["id"] = req.params.id

        const response = await itemTanyaService.getItemTanyaCustom(id)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menampilkan Data", response)
    } catch (error) {
        errorLogger.error(`Testing Error Get All getItemTanyaCustom ${error}`)
        next(error)
    }
}

const getTipeInput = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const response = await itemTanyaService.getTipeInput()

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menampilkan Data", response)
    } catch (error) {
        errorLogger.error(`Testing Error Get All getTipeInput ${error}`)
        next(error)
    }
}

const storeItemTanya = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const request : PayloadItemTanyaSchema["body"] = req.body

        const response = await itemTanyaService.storeItemTanya(request)

        responseSuccess(res, httpCode.created, responseStatus.success, "Berhasil Menambahkan Item Tanya", response)
    } catch (error) {
        errorLogger.error(`Testing Error Get All storeItemTanya ${error}`)
        next(error)
    }
}

export default {
    getKatDokVendor,
    getKatItemTanya,
    getItemTanyaCustom,
    getTipeInput,
    storeItemTanya,
}