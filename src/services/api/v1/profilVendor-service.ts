import getConfig from "@config/dotenv";
import CustomError from "@middleware/error-handler";
import logger, { errorLogger, debugLogger } from "@config/logger";
import { httpCode, responseStatus } from "@utils/prefix";
import db from "@config/database";

//Import Model
import JenisVendor from "@models/jenisVendor-model";
import KatDokumenVendor from "@models/katDokumenVendor-model";
import KatItemTanya from "@models/katItemTanya-model";

//Import Schema
import {
    ParameterSchema, 
    QuerySchema
} from "@schema/api/profilVendor-schema"

const getMenuAll = async (id : ParameterSchema["params"]["id"]) : Promise <KatDokumenVendor[]> => {
    try {
        const getMenu : KatDokumenVendor[] = await KatDokumenVendor.findAll({
            where : {
                is_main : true,
                kode_jenis_vendor : parseInt(id)
            }
        })

        // console.log("TESDATA", getMenu)

        return getMenu
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

const getSubMenu = async (id:ParameterSchema["params"]["id"]) : Promise<KatDokumenVendor[]> => {
    try {
        const getMenuSub : KatDokumenVendor[] = await KatDokumenVendor.findAll({
            where : {
                main_kat : id,
                is_main : false
            }
        })

        return getMenuSub
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

const katItemTanya = async (id:ParameterSchema["params"]["id"]) : Promise<KatDokumenVendor> => {
    try {
        const getKategoriItem : KatDokumenVendor | null = await KatDokumenVendor.findOne({
            where : {
                kode_kat_dokumen_vendor : id
            }, 
            include : [
                {
                    model : KatItemTanya,
                    as : "KatItemTanya",
                }
            ]
        })

        if(!getKategoriItem) throw new CustomError(httpCode.notFound, responseStatus.success, "Data Tidak Ditemukan")

        return getKategoriItem
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
    getMenuAll,
    getSubMenu,
    katItemTanya
}