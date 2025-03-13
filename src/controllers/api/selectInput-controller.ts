import { httpCode, responseStatus } from "@utils/prefix";
import { responseSuccess } from "@utils/response-success";
import { Request, Response, NextFunction, response } from "express";
import { errorLogger, debugLogger } from "@config/logger";


import selectInputService from "@services/api/v1/selectInput-service";
import CustomError from "@middleware/error-handler";

const domisiliInput = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const response = await selectInputService.domisiliInput()

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menampilkan Data", response)
    } catch (error) {
        errorLogger.error(`Testing Error Get Domisil Input ${error}`)
        next(error)
    }
}

const bankInput = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const response = await selectInputService.bankInput()

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menampilkan Data", response)
    } catch (error) {
        errorLogger.error(`Testing Error Get Bank Input ${error}`)
        next(error)
    }
}

const kbli = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const response = await selectInputService.kbli()

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menampilkan Data", response)
    } catch (error) {
        errorLogger.error(`Testing Error KBLI ${error}`)
        next(error)
    }
}

const jenisPengadaan = async (
    req : Request,
    res : Response, 
    next : NextFunction
) : Promise<void> => {
    try {
        const response = await selectInputService.jenisPengadaan()

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menampilkan Data", response)
    } catch (error) {
        errorLogger.error(`Testing Error JenisPengadaan ${error}`)
        next(error)
    }
}

const jenjangPendidikan = async (
    req : Request,
    res : Response, 
    next : NextFunction
) : Promise<void> => {
    try {
        const response = await selectInputService.jenjangPendidikan()

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menampilkan Data", response)

    } catch (error) {
        errorLogger.error(`Testing Error Jenjang Pendidikan ${error}`)
        next(error)
    }
}

const kepemilikan = async (
    req : Request,
    res : Response, 
    next : NextFunction
) : Promise<void> => {
    try {
        const response = await selectInputService.kepemilikan()

        responseSuccess(res, httpCode.ok, responseStatus.success, "Berhasil Menampilkan Data", response)

    } catch (error) {
        errorLogger.error(`Testing Error Jenjang Pendidikan ${error}`)
        next(error)
    }
}

export default {
    domisiliInput,
    bankInput,
    kbli,
    jenisPengadaan,
    jenjangPendidikan,
    kepemilikan
}