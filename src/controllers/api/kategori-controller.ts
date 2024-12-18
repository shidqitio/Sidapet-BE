import { responseStatus, httpCode } from "@utils/prefix";
import { responseSuccess } from "@utils/response-success";
import { Request, Response, NextFunction } from "express";
import { errorLogger, debugLogger } from "@config/logger";
import kategoriService from "@services/api/v1/kategori-service";

import {
    PayloadKategoriSchema,
    ParameterSchema
} from "@schema/api/kategori-schema"


const getKategori = async (
    req : Request,
    res : Response,
    next : NextFunction
) : Promise<void> => {
    try {
        const response = await kategoriService.getKategori()

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menampilkan Data", response)
    } catch (error) {
        errorLogger.error(`Testing Error Get Kategori ${error}`)
        next(error)
    }
}

const storeKategori = async (
    req : Request,
    res : Response,
    next : NextFunction
) : Promise<void> => {
    try {
        const request : PayloadKategoriSchema["body"] = req.body

        const response = await kategoriService.storeKategori(request)

        responseSuccess(res, httpCode.created, responseStatus.success, "Berhasil Membuat Data", response)
    } catch (error) {
        errorLogger.error(`Testing Error Create Kategori ${error}`)
        next(error)
    }
}

const getByIdKategori = async (
    req: Request,
    res: Response,
    next: NextFunction) : Promise<void> => {
    try {
        const id : ParameterSchema["params"]["id"] = req.params.id

        const response = await kategoriService.getByIdKategori(id)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menampilkan Data", response)
    } catch (error) {
        errorLogger.error(`Testing Error Get By Id Kategori ${error}`)
        next(error)
    }
}

const deleteKategori = async (
    req: Request,
    res: Response,
    next:NextFunction) : Promise<void> => {
    try {
        const id : ParameterSchema["params"]["id"] = req.params.id

        const response = await kategoriService.deleteKategori(id)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menghapus Data", response)
    } catch (error) {
        errorLogger.error(`Testing Error Delete Kategori ${error}`)
        next(error)
    }
}


export default {
    getKategori,
    storeKategori,
    getByIdKategori,
    deleteKategori,
}