import getConfig from "@config/dotenv";
import CustomError from "@middleware/error-handler";
import logger, { errorLogger, debugLogger } from "@config/logger";
import { httpCode, responseStatus } from "@utils/prefix";
import db from "@config/database";
import {uploadPdf} from "@services/pdf_upload"

//Import Model
import JenisVendor from "@models/jenisVendor-model";
import KatDokumenVendor from "@models/katDokumenVendor-model";
import KatItemTanya from "@models/katItemTanya-model";
import ItemTanya from "@models/itemTanya-model";
import Domisili from "@models/domisili-model";

//Import Schema
import {
    ParameterSchema, 
    QuerySchema,
    StoreProfilVendorSchema,
    StoreUploadVendorSchema
} from "@schema/api/profilVendor-schema"
import { QueryTypes, Sequelize } from "sequelize";
import sequelize from "sequelize";
import TrxJawabProfil from "@models/trxJawabProfil-model";

import FormData from "form-data"

import fs from "fs"

//GET MENU 
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

//GET SUB MENU
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

//GET KATEGORI ITEM TANYA
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

//List Pertanyaan Dinasi Perorangan
const listPertanyaanPerorangan = async (
    id:ParameterSchema["params"]["id"]) : Promise<KatDokumenVendor | null> => {
    try {
        const listPertanyaan : KatDokumenVendor | null = await KatDokumenVendor.findOne({
            attributes : ["kode_kat_dokumen_vendor", "kode_jenis_vendor", "nama_kategori"],
            where : {
                kode_jenis_vendor : 2, 
                kode_kat_dokumen_vendor : id,
            }, 
            include : [
                {
                    attributes : ["kode_kat_item_tanya", "kode_kat_dokumen_vendor", "kategori_item"],
                    model : KatItemTanya, 
                    as : "KatItemTanya", 
                    include : [
                        {
                            attributes : ["kode_item", "kode_kat_item_tanya", "urutan", "nama_item"],
                            model : ItemTanya, 
                            as : "ItemTanya",
                            where : {
                                jenis_item : "default"
                            }
                        }
                    ]
                }
            ],
            order : [
            [{ model: KatItemTanya, as: "KatItemTanya" }, { model: ItemTanya, as: "ItemTanya" }, "urutan", "ASC"]   
            ]
        })

        if(!listPertanyaan) throw new CustomError(httpCode.notFound, responseStatus.error, "Data Tidak Ada")

        return listPertanyaan
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

const storeProfilVendor = async (request:StoreProfilVendorSchema["body"]) : Promise<any> => {
    try {
        const profil : StoreProfilVendorSchema["body"]["profil"] = request.profil

        const arrGagal : any[] = []

        const arrBerhasil : any[] = []

        await Promise.all(profil.map(async(item : any) => {
            const exProfil = await TrxJawabProfil.findOne({
                where : {
                    kode_item : item.kode_item,
                    kode_vendor : item.kode_vendor,
                }
            })
            if(exProfil) {
                arrGagal.push({
                    kode_vendor : exProfil.kode_vendor,
                    kode_item : exProfil.kode_item,
                    isian : exProfil.isian
                })
            }
            if(!exProfil) {
                arrBerhasil.push({
                    kode_vendor : item.kode_vendor,
                    kode_item : item.kode_item,
                    isian : item.isian
                })
            }
        }) 
    )
        
        const storeProfil = await TrxJawabProfil.bulkCreate(arrBerhasil)

        if(arrBerhasil.length === 0) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Gagal Store ke Profil Vendor")

        return storeProfil
        
        
    } catch (error) {
        console.log(error)
        if(error instanceof CustomError) {
            throw new CustomError(error.code,error.status, error.message)
        } 
        else {
            debugLogger.debug(error)
            throw new CustomError(500, responseStatus.error, "Internal server error.")
        }
    }
}


const storeUpload = async (request:StoreUploadVendorSchema["body"], file : Express.Multer.File) : Promise<any> => {
    try {
        console.log(request.kode_item);
        

        const exProfil = await TrxJawabProfil.findOne({
            where : {
                kode_item : request.kode_item,
                kode_vendor : request.kode_vendor
            }
        })

        if (exProfil) throw new CustomError(httpCode.conflict, responseStatus.success, "Data Sudah Terdaftar")

        console.log("TES PERTAMA : ", file.path)

        const formData = new FormData()

        formData.append('nama_aplikasi','SI-DaPeT')
        formData.append('file', fs.createReadStream(file.path))


        const upload = await uploadPdf(formData)


        if(upload[1] !== null || !upload[0]){
            fs.unlinkSync(file.path)
            throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Upload Gagal")
        }
            

        console.log(upload[0])

        const create = await TrxJawabProfil.create({
            kode_item : parseInt(request.kode_item),
            kode_vendor : parseInt(request.kode_vendor),
            isian : upload[0].file_name,
            encrypt_key : upload[0].keypass
        })    

        if(!create) {
            fs.unlinkSync(file.path)
            throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Gagal Upload File")
        }
           

        if(create) {
            console.log("TESS DATA KESINI : ", file.path)
            fs.unlinkSync(file.path)
        }

        return create
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



const tesDomisili = async (id:ParameterSchema["params"]["id"]) => {
    try {
        const queryJawabItem = await db.query(`
            SELECT c.kode_vendor, c.nama_perusahaan, b.kode_item, b.nama_item, b.tipe_input, a.isian 
                FROM trx_jawab_profil a JOIN 
                ref_item_tanya b ON a.kode_item = b.kode_item
                JOIN ref_vendor c
                ON a.kode_vendor = c.kode_vendor
                WHERE c.kode_vendor = :id
            `, {
                replacements : {id : id},
                type : QueryTypes.SELECT
            })
   
        // console.log(queryJawabItem)

        const domisiliQuery = await Domisili.findAll({
            raw : true
        })

        queryJawabItem.forEach((item: any) => {
            if (item.tipe_input === "select") {
              const matchingDomisili = domisiliQuery.find(
                (dom: any) => dom.kode_domisili === parseInt(item.isian)
              );
              
              item.domisili = matchingDomisili 
                ? {
                    kode_domisili: matchingDomisili.kode_domisili,
                    nama_domisili: matchingDomisili.nama_domisili
                  }
                : null;
            }
          });         

        return queryJawabItem
        

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



export default {
    getMenuAll,
    getSubMenu,
    katItemTanya,
    listPertanyaanPerorangan,
    storeProfilVendor,
    storeUpload,
    tesDomisili
}