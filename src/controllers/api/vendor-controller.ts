import { httpCode, responseStatus } from "@utils/prefix";
import { responseSuccess, responseSuccessCount } from "@utils/response-success";
import { Request, Response, NextFunction } from "express";
import { errorLogger, debugLogger } from "@config/logger";

import {
    PayloadGetPenyediaSchema,
    QuerySchema
} from "@schema/api/vendor-schema"

import vendorService from "@services/api/v1/vendor-service";

const getPenyediaLimitOffset = async (
    req : Request,
    res : Response,
    next : NextFunction
) : Promise<void> => {
    try {
        const page : QuerySchema["query"]["page"] = req.query.page as string
        const limit : QuerySchema["query"]["limit"] = req.query.limit as string

        const response = await vendorService.getPenyediaLimitOffset(page, limit)

        responseSuccessCount(res, httpCode.ok, responseStatus.success, "Berhasil Menampilkan Data", response.vendor, page, limit, response.count)
    } catch (error) {
        errorLogger.error(`Testing Error Get Penyedia Limit Offset ${error}`)
        next(error)
    }
}

const getPenyediaAll = async (
    req : Request,
    res : Response,
    next : NextFunction
) : Promise<void> => {
    try {
        const id = req.params.id

        const response = await vendorService.getPenyediaAll(id)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menampilkan Data", response)
    } catch (error) {
        errorLogger.error(`Testing Error Get Penyedia All ${error}`)
        next(error)
    }
}

const getPenyediaByKode = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const request : PayloadGetPenyediaSchema["body"] = req.body

        const response = await vendorService.getPenyediaByKode(request)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menampilkan Data", response)
    } catch (error) {
        errorLogger.error(`Testing Error Get Penyedia By Kode ${error}`)
        next(error)
    }
}



export default {
    getPenyediaLimitOffset,
    getPenyediaAll,
    getPenyediaByKode
}