import CustomError from "@middleware/error-handler";
import { debugLogger } from "@config/logger";
import db from "@config/database";
import { responseStatus, httpCode } from "@utils/prefix";

//Import Model 
import ItemTanyaTpl from "@models/itemTanyaTpl-model";

//Import Schema
import {
    PayloadItemTanyaTplSchema,
    PayloadUpdateItemTanyaTplSchema,
    ParameterSchema
} from "@schema/api/itemTanyaTpl-schema"
import TipeInput from "@models/tipeInput-model";


//Get All Item Tanya TPL 
const getItemTanyaTplAll = async () : Promise<ItemTanyaTpl[]> => {
    try {
        const itemTanyaTpl = await ItemTanyaTpl.findAll()

        return itemTanyaTpl
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

//Get By Id 
const getItemTanyaTplById = async (id:ParameterSchema["params"]["id"]) : Promise<ItemTanyaTpl> => {
    try {
        const getItemTanya = await ItemTanyaTpl.findOne({
            where : {
                kode_tpl : id
            }
        })

        if(!getItemTanya) throw new CustomError(httpCode.notFound, responseStatus.error, "Data Tidak Ada")

        return getItemTanya
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

//Store Item Tanya
const storeItemTanya = async (request:PayloadItemTanyaTplSchema["body"]) : Promise<ItemTanyaTpl> => {
    try {
        const exItemTanyaTpl = await ItemTanyaTpl.findOne({
            where : {
                nama_item : request.nama_item,
            }
        })

        if(exItemTanyaTpl) throw new CustomError(httpCode.conflict, responseStatus.success, "Data Item Sudah Tersedia")

        const exTipeInput = await TipeInput.findOne({
            where : {
                tipe_input : request.tipe_input
            }
        })
        
        if(!exTipeInput) throw new CustomError(httpCode.badRequest, responseStatus.error, "Terjadi Kesalahan Pada Tipe Input")

        const storeItemTanyaTpl = await ItemTanyaTpl.create({
            nama_item : request.nama_item,
            keterangan : request.keterangan,
            tipe_input : exTipeInput.tipe_input
        })

        if(!storeItemTanyaTpl) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Terjadi Kesalahan Insert Item Tanya")

        return storeItemTanyaTpl
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


//Update Item Tanya 
const updateItemTanyaTpl = async (id:PayloadUpdateItemTanyaTplSchema["params"]["id"],
    request : PayloadUpdateItemTanyaTplSchema["body"]
) : Promise<ItemTanyaTpl> => {
    try {
        const exItemTanyaTpl = await ItemTanyaTpl.findByPk(id)

        if(!exItemTanyaTpl) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Item Tanya Tpl Tidak Tersedia")

        const exTipeInput = await ItemTanyaTpl.findOne({
            where : {
                tipe_input : request.tipe_input
            }
        })

        exItemTanyaTpl.nama_item = request.nama_item,
        exItemTanyaTpl.keterangan = request.keterangan
        exItemTanyaTpl.tipe_input = request.tipe_input

        const updateItemTanyaTpl = await exItemTanyaTpl.save()

        if(!updateItemTanyaTpl) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Update Item Tanya Tpl Gagal")

        return updateItemTanyaTpl
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

//Delete Item Tanya
const deleteItemTanyaTpl = async (id:ParameterSchema["params"]["id"]) : Promise<ItemTanyaTpl> => {
    try {
        const exItemTanyaTpl = await ItemTanyaTpl.findByPk(id)

        if(!exItemTanyaTpl) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Item Tanya Tpl Tidak Tersedia")

        const deleteItemTanyaTpl = await ItemTanyaTpl.destroy({
            where : {
                kode_tpl : id
            }
        })

        if(deleteItemTanyaTpl === 0) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Delete Item Tanya TPL Gagal ")

        return exItemTanyaTpl
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
    getItemTanyaTplAll,
    getItemTanyaTplById,
    storeItemTanya,
    updateItemTanyaTpl,
    deleteItemTanyaTpl,
}