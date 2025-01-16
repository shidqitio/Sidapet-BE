import { responseStatus, httpCode } from "@utils/prefix";
import { responseSuccess, responseSuccessCount } from "@utils/response-success";
import { Request, Response, NextFunction } from "express";
import { errorLogger } from "@config/logger";
import trxKategoriService from "@services/api/v1/trxKategori-service";

import {
    ParameterSchema,
    PayloadTrxKategoriSchema,
    QuerySchema
} from "@schema/api/trxKategori-schema"

const getListKategori = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const page : QuerySchema["query"]["page"] = req.query.page as string
        const limit : QuerySchema["query"]["limit"] = req.query.limit as string

        const response = await trxKategoriService.getListKategori(limit, page)

        responseSuccessCount(res, httpCode.ok, responseStatus.success, "Berhasil Menampilkan Data", response.rows, page, limit, response.count)
    } catch (error) {
        errorLogger.error(`Testing Error Get Kategori ${error}`)
        next(error)
    }
}

const storeTrxKategori = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const request : PayloadTrxKategoriSchema["body"] = req.body

        const response = await trxKategoriService.storeTrxKategori(request)

        responseSuccess(res, httpCode.created, responseStatus.success, "Berhasil Membuat Data", response)
    } catch (error) {
        errorLogger.error(`Testing Error Get Kategori ${error}`)
        next(error)
    }
}

const deleteTrxKategori = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const id : ParameterSchema["params"]["id"] = req.params.id
        const response = await trxKategoriService.deleteTrxKategori(id)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menghapus Data", response)
    } catch (error) {
        errorLogger.error(`Testing Error Get Kategori ${error}`)
        next(error)
    }
}

export default {
    getListKategori, 
    storeTrxKategori,
    deleteTrxKategori
}