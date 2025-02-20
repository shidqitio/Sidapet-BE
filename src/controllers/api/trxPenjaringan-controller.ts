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

const storeTahap = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const request : PayloadTrxPenjaringanSchema["body"] = req.body

        const response = await trxPenjaringanService.storeTahap(request)

        responseSuccess(res, httpCode.created, responseStatus.success,"Berhasil Menambah Data", response)

    } catch (error) {
        errorLogger.error(`Testing Error Get Kategori ${error}`)
        next(error)
    }
}

export default {
    storeTahap
}