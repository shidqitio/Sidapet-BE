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
        errorLogger.error(`Testing Error Get All KatDokumenVendor ${error}`)
        next(error)
    }
}

export default {
    domisiliInput
}