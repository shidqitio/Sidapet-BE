import getConfig from "@config/dotenv";
import CustomError from "@middleware/error-handler";
import logger, { errorLogger, debugLogger } from "@config/logger";
import { httpCode, responseStatus } from "@utils/prefix";
import db from "@config/database";
import {uploadPdf, deleteFile} from "@services/pdf_upload"
import {setCache, getCache, delCache} from "@cache/cache"

import Domisili from "@models/domisili-model";
import Kbli from "@models/kbli-model";
import JenisPengadaan from "@models/jenisPengadaan-model";
import Bank from "@models/bank-model";
import JenjangPendidikan from "@models/jenjangPendidikan-model";
import Kepemilikan from "@models/kepemilikan-model";


const domisiliInput = async () : Promise<any>=> {
    try {
        const cacheKey = 'all_domisili'
        const cachedDomisili = getCache(cacheKey)

        if(cachedDomisili) {
            return cachedDomisili
        }

        const domisili = await Domisili.findAll({
            raw : true
        })

        const cek = domisili.map(item => {
            return {
                "label" : item.nama_domisili,
                "value" : item.kode_domisili
            }
        })

        setCache(cacheKey, cek)

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

const kbli = async () : Promise<Kbli[]> => {
    try {
        const cacheKey = "kbli"
        const cachedKbli = getCache(cacheKey)

        if(cachedKbli) return cachedKbli


        const kbli = await Kbli.findAll()

        setCache(cacheKey, kbli)

        return kbli
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

const jenisPengadaan = async () : Promise<JenisPengadaan[]> => {
    try {
        const cacheKey = "jenisPengadaanAll"
        const cachedJenisPengadaan = getCache(cacheKey)

        if(cachedJenisPengadaan) return cachedJenisPengadaan

        const getJenisPengadaan = await JenisPengadaan.findAll({
            order : [["kode_jenis_pengadaan","ASC"]]
        })

        setCache(cacheKey, getJenisPengadaan)

        return getJenisPengadaan

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

const bankInput = async () : Promise<any>=> {
    try {
        const cacheKey = 'all_bank'
        const cachedBank = getCache(cacheKey)

        if(cachedBank) {
            return cachedBank
        }

        const bank = await Bank.findAll({
            raw : true
        })

        const cek = bank.map(item => {
            return {
                "label" : item.nama_bank,
                "value" : item.sandi_bank
            }
        })

        setCache(cacheKey, cek)

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

const jenjangPendidikan = async () : Promise<JenjangPendidikan[]> => {
    try {
        const cacheKey = "jenjangPendidikan_all"
        const cachedJenjangPendidikan = getCache(cacheKey)

        if(cachedJenjangPendidikan) return cachedJenjangPendidikan

        const getJenjangPendidikan = await JenjangPendidikan.findAll({
            order : [["kode_jenjang_pendidikan","ASC"]]
        })

        setCache(cacheKey, getJenjangPendidikan)

        return getJenjangPendidikan
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

const kepemilikan = async () : Promise<any> => {
    try {
        const cacheKey = "kepemilikan_all"
        const cachedKepemilikan = getCache(cacheKey)

        if(cachedKepemilikan) return cachedKepemilikan

        const getKepemilikan = await Kepemilikan.findAll({
            order : [["kode_kepemilikan","ASC"]]
        })

        setCache(cacheKey, getKepemilikan)

        return getKepemilikan
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
    domisiliInput,
    bankInput,
    kbli,
    jenisPengadaan,
    jenjangPendidikan,
    kepemilikan
}