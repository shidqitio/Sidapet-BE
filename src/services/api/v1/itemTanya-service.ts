import CustomError from "@middleware/error-handler";
import { debugLogger } from "@config/logger";
import db from "@config/database";
import { httpCode, responseStatus } from "@utils/prefix";


//Import Model
import KatDokumenVendor from "@models/katDokumenVendor-model";
import KatItemTanya from "@models/katItemTanya-model";
import ItemTanya, {jenis_item} from "@models/itemTanya-model";
import TipeInput from "@models/tipeInput-model";

//Import Schema
import {
    PayloadItemTanyaSchema,
    ParameterSchema
} from "@schema/api/itemTanya-schema"
import JenisVendor from "@models/jenisVendor-model";
import ItemTanyaTpl from "@models/itemTanyaTpl-model";

const getKatDokVendor = async (id : ParameterSchema["params"]["id"] ) : Promise<KatDokumenVendor[]> => {
    try {
        const getKatDokVenMain : KatDokumenVendor[] = await KatDokumenVendor.findAll({
            where : {
                kode_jenis_vendor : id,
                is_has_sub : false
            },
            attributes : [
                "kode_kat_dokumen_vendor",
                "kode_jenis_vendor",
                "nama_kategori"
            ]
        })

        return getKatDokVenMain
    
    } catch (error) {
        console.log(error);
        
        if(error instanceof CustomError) {
            throw new CustomError(error.code,error.status, error.message)
        } 
        else {
            debugLogger.debug(error)
            throw new CustomError(500, responseStatus.error, "Internal server error.")
        }
    }
}

const getKatItemTanya = async (id:ParameterSchema["params"]["id"]) : Promise<KatItemTanya[]> => {
    try {
        const getKatItem : KatItemTanya[] = await KatItemTanya.findAll({
            where : {
                kode_kat_dokumen_vendor : id
            }
        })

        return getKatItem
    } catch (error) {
        console.log(error);
        
        if(error instanceof CustomError) {
            throw new CustomError(error.code,error.status, error.message)
        } 
        else {
            debugLogger.debug(error)
            throw new CustomError(500, responseStatus.error, "Internal server error.")
        }
    }
}


const getItemTanyaCustom = async (id : ParameterSchema["params"]["id"]) : Promise<ItemTanya[]> => {
    try {
        const exItemTanya = await ItemTanya.findAll({
            where : {
                jenis_item : "custom"
            },
            attributes : [
                "kode_item",
                "kode_jenis_vendor",
                "nama_item",
                "keterangan",
                "tipe_input",
                "is_required",
            ],
            include : [
                {
                    model : JenisVendor,
                    as : "JenisVendor",
                },
                {
                    model : KatItemTanya,
                    as : "KatItemTanya",
                    where : {
                        kode_kat_item_tanya : id
                    },
                    attributes : [
                        "kode_kat_item_tanya",
                        "kategori_item"
                    ]
                }
            ]
        })

        return exItemTanya
    } catch (error) {
        console.log(error);
        
        if(error instanceof CustomError) {
            throw new CustomError(error.code,error.status, error.message)
        } 
        else {
            debugLogger.debug(error)
            throw new CustomError(500, responseStatus.error, "Internal server error.")
        }
    }
}

const getTipeInput = async () : Promise<TipeInput[]> => {
    try {
        const getInput = await TipeInput.findAll({
            attributes : [
                "tipe_input"
            ]
        })

        return getInput
    } catch (error) {
        console.log(error);
        
        if(error instanceof CustomError) {
            throw new CustomError(error.code,error.status, error.message)
        } 
        else {
            debugLogger.debug(error)
            throw new CustomError(500, responseStatus.error, "Internal server error.")
        }
    }
}

const storeItemTanya = async (
    request:PayloadItemTanyaSchema["body"]) : Promise<any> => {
    try {

        const urutan : number  = await ItemTanya.max("urutan", {
            where : {
                kode_kat_dokumen_vendor : request.kode_kat_dokumen_vendor,
                kode_kat_item_tanya : request.kode_kat_item_tanya,
                kode_jenis_vendor : request.kode_jenis_vendor
            }
        })

        let urutanItem

        if(urutan === 0) {
            urutanItem = 0
        }
        else {
            urutanItem = urutan + 1 
        }

        let itemTanyaTpl = await ItemTanyaTpl.findByPk(request.kode_tpl)

        if(!itemTanyaTpl) throw new CustomError(httpCode.badRequest, responseStatus.error, "Item Tanya TPL Tidak Tersedia")
   
        
            
        const storeItem = await ItemTanya.create({
            kode_jenis_vendor : request.kode_jenis_vendor,
            kode_kat_dokumen_vendor : request.kode_kat_dokumen_vendor,
            kode_kat_item_tanya : request.kode_kat_item_tanya,
            nama_item : itemTanyaTpl.nama_item,
            keterangan : itemTanyaTpl.keterangan,
            tipe_input : itemTanyaTpl.tipe_input,
            kode_trx_kategori : request.kode_trx_kategori,
            is_required : request.is_required,
            jenis_item : jenis_item.custom,
            urutan : urutan
        })

        if(!storeItem) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error,"Gagal Input Item Tanya")

        const getData = {
            kode_jenis_vendor : storeItem.kode_jenis_vendor,
            kode_kat_dokumen_vendor : storeItem.kode_kat_dokumen_vendor,
            kode_kat_item_tanya : storeItem.kode_kat_item_tanya,
            nama_item : storeItem.nama_item,
            keterangan : storeItem.keterangan,
            tipe_input : storeItem.tipe_input,
            kode_trx_kategori : storeItem.kode_trx_kategori,
            is_required : storeItem.is_required,
            jenis_item : storeItem.jenis_item
        }


        return getData
    } catch (error) {
        console.log(error);
        
        if(error instanceof CustomError) {
            throw new CustomError(error.code,error.status, error.message)
        } 
        else {
            debugLogger.debug(error)
            throw new CustomError(500, responseStatus.error, "Internal server error.")
        }
    }
}

const deleteItemTanyaCustom = async (id:ParameterSchema["params"]["id"]) : Promise<ItemTanya> => {
    try {
        const exItemTanya = await ItemTanya.findOne({
            where : {
                kode_item : id,
                jenis_item : jenis_item.custom
            }
        })

        if(!exItemTanya) throw new CustomError(httpCode.badRequest, responseStatus.error, "Terjadi Kesalahan Parameter / Item Tanya Bukan Custom")

        const deleteItem = await ItemTanya.destroy({
            where : {
                kode_item : id,
                jenis_item : jenis_item.custom
            }
        })

        if(deleteItem === 0) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Terjadi Kesalahan Pada Delete")

        return exItemTanya
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
    getKatDokVendor,
    getKatItemTanya,
    getItemTanyaCustom,
    getTipeInput,
    storeItemTanya,
    deleteItemTanyaCustom
}