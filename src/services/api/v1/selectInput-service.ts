import getConfig from "@config/dotenv";
import CustomError from "@middleware/error-handler";
import logger, { errorLogger, debugLogger } from "@config/logger";
import { httpCode, responseStatus } from "@utils/prefix";
import db from "@config/database";
import {uploadPdf, deleteFile} from "@services/pdf_upload"

import Domisili from "@models/domisili-model";


const domisiliInput = async () : Promise<any>=> {
    try {
        const domisili = await Domisili.findAll({
            raw : true
        })

        const cek = domisili.map(item => {
            return {
                "label" : item.nama_domisili,
                "value" : item.kode_domisili
            }
        })

        console.log(cek)

        return cek
        
    } catch (error) {
        if(error instanceof CustomError) {
            throw new CustomError(error.code,error.status, error.message)
        } 
        else {
            debugLogger.debug(error)
            throw new CustomError(500, responseStatus.error, "Internal server error.")
        }
    }
}

export default {
    domisiliInput
}