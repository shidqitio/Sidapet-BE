import { httpCode, responseStatus } from "@utils/prefix";
import { responseSuccess } from "@utils/response-success";
import { Request, Response, NextFunction } from "express";
import { errorLogger, debugLogger } from "@config/logger";
import itemTanyaTplService from "@services/api/v1/itemTanyaTpl-service";

import {
    PayloadItemTanyaTplSchema,
    PayloadUpdateItemTanyaTplSchema,
    ParameterSchema
} from "@schema/api/itemTanyaTpl-schema"

const getItemTanyaTplAll = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const response = await itemTanyaTplService.getItemTanyaTplAll()

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menampilkan Data", response)

    } catch (error) {
        errorLogger.error(`Testing Error Get All Item Tanya Tpl ${error}`)
        next(error)
    }
}

const getItemTanyaTplById = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const id : ParameterSchema["params"]["id"] = req.params.id

        const response = await itemTanyaTplService.getItemTanyaTplById(id)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menampilkan Data", response)
    } catch (error) {
        errorLogger.error(`Testing Error Get By Id Item Tanya Tpl ${error}`)
        next(error)
    }
}

const storeItemTanyaTpl = async (
    req : Request,
    res : Response,
    next : NextFunction) : Promise<void> => {
    try {
        
        const request : PayloadItemTanyaTplSchema["body"] = req.body

        const response = await itemTanyaTplService.storeItemTanya(request)

        responseSuccess(res, httpCode.created, responseStatus.success, "Berhasil Membuat Item Tanya Tpl", response)
    } catch (error) {
        errorLogger.error(`Testing Error Store Item Tanya Tpl ${error}`)
        next(error)
    }
}

const updateItemTanyaTpl = async (
    req : Request,
    res : Response,
    next : NextFunction) : Promise<void> => {
    try {
        const id : PayloadUpdateItemTanyaTplSchema["params"]["id"] = req.params.id

        const request : PayloadUpdateItemTanyaTplSchema["body"] = req.body

        const response = await itemTanyaTplService.updateItemTanyaTpl(id, request)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Mengubah Item", response)
    } catch (error) {
        errorLogger.error(`Testing Error Update Item Tanya Tpl ${error}`)
        next(error)
    }
}

const deleteItemTanyaTpl = async (
    req : Request,
    res : Response,
    next : NextFunction) : Promise<void> => {
    try {
        const id : ParameterSchema["params"]["id"] = req.params.id

        const response = await itemTanyaTplService.deleteItemTanyaTpl(id)

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menghapus Item Tanya", response)

    } catch (error) {
        errorLogger.error(`Testing Error Delete Item Tanya Tpl ${error}`)
        next(error)
    }
}

export default {
    getItemTanyaTplAll,
    getItemTanyaTplById,
    storeItemTanyaTpl,
    updateItemTanyaTpl,
    deleteItemTanyaTpl,

}