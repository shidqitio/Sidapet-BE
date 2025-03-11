import { responseStatus, httpCode } from "@utils/prefix";
import { responseSuccess, responseSuccessCount } from "@utils/response-success";
import { Request, Response, NextFunction } from "express";
import { errorLogger } from "@config/logger";
import trxPenjaringanService from "@services/api/v1/trxPenjaringan-service";

import {
    PayloadTrxPenjaringanSchema,
    ParameterSchema,
    QuerySchema
} from "@schema/api/trxPenjaringan-schema"
import TrxPenjaringan from "@models/trxPenjaringan-model";

const getPenjaringan = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const page : QuerySchema["query"]["page"] = req.query.page as string
        const limit : QuerySchema["query"]["limit"] = req.query.limit as string
        const id : ParameterSchema["params"]["id"] = req.params.id

        const response = await trxPenjaringanService.getPenjaringan(page, limit, id)

        responseSuccessCount(res, httpCode.ok, responseStatus.success, "Berhasil Menampilkan Data", response.trx_penjaringan, page, limit, response.count)
    } catch (error) {
        errorLogger.error(`Testing Error Get Penjaringan ${error}`)
        next(error)
    }
}

const getDetailPenjaringan = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const id : ParameterSchema["params"]["id"] = req.params.id

        const response = await trxPenjaringanService.getDetailPenjaringan(id)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menampilkan Data", response)
    } catch (error) {
        errorLogger.error(`Testing Error Get Penjaringan Detail ${error}`)
        next(error)
    }
}

const storeTahap = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const request : PayloadTrxPenjaringanSchema["body"] = req.body

        const response = await trxPenjaringanService.storeTahap(request)

        responseSuccess(res, httpCode.created, responseStatus.success,"Berhasil Menambah Data", response)

    } catch (error) {
        errorLogger.error(`Testing Error Store Tahap ${error}`)
        next(error)
    }
}

const ajukanPenjaringan = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const id : ParameterSchema["params"]["id"] = req.params.id

        const response = await trxPenjaringanService.ajukanPenjaringan(id)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Mengubah Status Data", response)
    } catch (error) {
        errorLogger.error(`Testing Error Update Status Penjaringan ${error}`)
        next(error)
    }
}

const deleteTrxPenjaringan = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const id : ParameterSchema["params"]["id"] = req.params.id

        const response = await trxPenjaringanService.deleteTrxPenjaringan(id)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menghapus Data", response)
    } catch (error) {
        errorLogger.error(`Testing Error Delete Penjaringan ${error}`)
        next(error)
    }
}


export default {
    storeTahap,
    getPenjaringan,
    getDetailPenjaringan,
    ajukanPenjaringan,
    deleteTrxPenjaringan,
}