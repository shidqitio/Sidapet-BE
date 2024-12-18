import CustomError from "@middleware/error-handler";
import { debugLogger } from "@config/logger";
import db from "@config/database";
import { responseStatus, httpCode } from "@utils/prefix";

//Import Model
import Kategori from "@models/kategori-model";
//Import Schema
import {
    PayloadKategoriSchema,
    ParameterSchema
} from "@schema/api/kategori-schema"

//Get All Kategori
const getKategori = async () : Promise<Kategori[]> => {
    try {
        const getAll = await Kategori.findAll()

        return getAll
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

const storeKategori = async (request:PayloadKategoriSchema["body"]) : Promise<Kategori> => {
    try {
        const exKategori = await Kategori.findOne({
            where : {
                nama_kategori : request.nama_kategori
            }
        })

        if(exKategori) throw new CustomError(httpCode.conflict, responseStatus.success, "Data Sudah Tersedia")

        const storeKategori = await Kategori.create({
            nama_kategori : request.nama_kategori
        })

        if(!storeKategori) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Gagal Store Data")

        return storeKategori
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

const getByIdKategori = async (id:ParameterSchema["params"]["id"]) : Promise<Kategori> => {
    try {
        const exKategori = await Kategori.findOne({
            where : {
                kode_kategori : id
            }
        })

        if(!exKategori) throw new CustomError(httpCode.notFound, responseStatus.success, "Data Tidak Ditemukan")

        return exKategori
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

const deleteKategori = async (id:ParameterSchema["params"]["id"]) : Promise<Kategori> => {
    try {
        const exKategori = await Kategori.findByPk(id)

        if(!exKategori) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Data yang dihapus tidak tersedia")

        const delKategori = await Kategori.destroy({
            where : {
                kode_kategori : id
            }
        })

        if(delKategori === 0) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Data Gagal Dihapus")

        return exKategori
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
    getKategori,
    storeKategori,
    getByIdKategori,
    deleteKategori,
}
