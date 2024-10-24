import getConfig from "@config/dotenv";
import CustomError from "@middleware/error-handler";
import logger, { errorLogger, debugLogger } from "@config/logger";
import { httpCode, responseStatus } from "@utils/prefix";
import db from "@config/database";
import {uploadPdf, deleteFile} from "@services/pdf_upload"

//Import Model
import JenisVendor from "@models/jenisVendor-model";
import KatDokumenVendor from "@models/katDokumenVendor-model";
import KatItemTanya from "@models/katItemTanya-model";
import ItemTanya from "@models/itemTanya-model";
import Domisili from "@models/domisili-model";
import TrxKatDokKomplit from "@models/trxKatDokKomplit-model";
import SertifPerorangan from "@models/sertifPerorangan-model";
import PengalamanPerorangan from "@models/pengalamanPerorangan-model";

//Import Schema
import {
    ParameterSchema, 
    QuerySchema,
    StoreProfilVendorSchema,
    StoreUploadVendorSchema,
    GetJawabProfilVendorSchema,
    StoreUploadSertifikatSchema,
    StoreUploadPengalamanSchema
} from "@schema/api/profilVendor-schema"
import { QueryTypes, Sequelize } from "sequelize";
import sequelize from "sequelize";
import TrxJawabProfil, { TrxJawabProfilOutput } from "@models/trxJawabProfil-model";

import FormData from "form-data"

import fs from "fs"
import RegisterVendor from "@models/registerVendor-model";

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

//Get Menu With Status By User
const getMenuStatus = async (kode_vendor:number) : Promise<KatDokumenVendor[]> => {
    try {
        console.log(kode_vendor)
        
        const getJenisVndor = await RegisterVendor.findOne({
            attributes : ["kode_jenis_vendor", "kode_vendor"],
            where : {
                kode_vendor : kode_vendor
            },
            raw : true
        })

        console.log("TES");
        

        console.log("TES DISINI " , getJenisVndor?.kode_vendor);
        

        const getMenu : KatDokumenVendor[] = await KatDokumenVendor.findAll({
            attributes : [
                "kode_kat_dokumen_vendor",
                "kode_jenis_vendor",
                "urutan",
                "is_main",
                "is_has_sub",
                "main_kat",
                "nama_kategori",
                [sequelize.literal(`Case 
                    WHEN "TrxKatDokKomplit"."is_komplit" = TRUE 
                    THEN TRUE
                    ELSE FALSE 
                    END
                    `), 'status_komplit']
            ],
            where : {
                is_main : true,
                kode_jenis_vendor : getJenisVndor?.kode_jenis_vendor
            },
            include : [
                {
                    model : TrxKatDokKomplit,
                    as : "TrxKatDokKomplit",
                    attributes : [],
                    required : false,
                    where : {
                        kode_vendor : kode_vendor
                    }
                }
            ]
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

//################# PERORANGAN ########################################

//List Pertanyaan Perorangan
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
                            attributes : ["kode_item", "kode_kat_item_tanya", "urutan", "nama_item", "tipe_input"],
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

//Store Profil Vendor
const storeProfilVendor = async (request:StoreProfilVendorSchema["body"], kode_vendor : number) : Promise<any> => {
    const t = await db.transaction()
    try {


        const profil : StoreProfilVendorSchema["body"]["profil"] = request.profil

        const arrGagal : any[] = []

        const arrBerhasil : any[] = []

        await Promise.all(profil.map(async(item : any) => {
            const exProfil = await TrxJawabProfil.findOne({
                where : {
                    kode_item : item.kode_item,
                    kode_vendor : kode_vendor,
                }, 
                transaction : t
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
                    kode_vendor : kode_vendor,
                    kode_item : item.kode_item,
                    isian : item.isian
                })
            }
        }) 
    )
        
        const storeProfil = await TrxJawabProfil.bulkCreate(arrBerhasil, {
            transaction : t
        })

        if(arrBerhasil.length === 0) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Gagal Store ke Profil Vendor / Profil Sudah Pernah Terisi")

        const getKatDokumen : ItemTanya | null = await ItemTanya.findOne({
            where : {
                kode_item : arrBerhasil[0].kode_item
            },
            attributes : [
                "kode_item",
                "kode_kat_dokumen_vendor"
            ],
            transaction : t
        })

        if(!getKatDokumen) throw new CustomError(httpCode.notFound, responseStatus.error, "Kat Dokumen Vendor Tidak Ada")

        const storeStatus = await TrxKatDokKomplit.create({
            kode_kat_dokumen_vendor : getKatDokumen?.kode_kat_dokumen_vendor,
            kode_vendor : arrBerhasil[0].kode_vendor,
            is_komplit : true
        }, {transaction : t})

        if(!storeStatus) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Gagal Merubah Status Profil")

        await t.commit()

        return storeProfil
        
        
    } catch (error) {
        console.log(error)
        await t.rollback()
        if(error instanceof CustomError) {
            throw new CustomError(error.code,error.status, error.message)
        } 
        else {
            debugLogger.debug(error)
            throw new CustomError(500, responseStatus.error, "Internal server error.")
        }
    }
}

//Store Upload Profil
const storeUpload = async (request:StoreUploadVendorSchema["body"], file : Express.Multer.File, user : number) : Promise<any> => {
    try {        


        if(!file) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "File Tidak Terkirim")

        if(!user || user === null || user === undefined) throw new CustomError(httpCode.unauthorized, responseStatus.error, "Belum Terdaftar Sebagai Vendor")

        const exProfil = await TrxJawabProfil.findOne({
            where : {
                kode_item : request.kode_item,
                kode_vendor : user
            }
        })
        
     

        if (exProfil) throw new CustomError(httpCode.conflict, responseStatus.success, "Data Sudah Terdaftar")


        const formData = new FormData()

        formData.append('nama_aplikasi','SI-DaPeT')
        formData.append('file', fs.createReadStream(file.path))

        console.log("TES 1 :", file.path)


        const upload = await uploadPdf(formData)


        if(upload[1] !== null || !upload[0]){
            fs.unlinkSync(file.path)
            throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Upload Gagal")
        }
            

        const create = await TrxJawabProfil.create({
            kode_item : parseInt(request.kode_item),
            kode_vendor : user,
            isian : upload[0].file_name,
            encrypt_key : upload[0].keypass
        })    

        if(!create) {
            fs.unlinkSync(file.path)
            await deleteFile(upload[0].file_name)
            throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Gagal Upload File")
        }
           

        if(create) {
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

//Get Profil Perorangan
const getProfilVendor = async (request:GetJawabProfilVendorSchema["body"], kode_vendor : number) : Promise<any> => {
    try {
        const queryJawabItem = await db.query(`
            SELECT c.kode_vendor, c.nama_perusahaan, b.kode_item, b.nama_item, b.tipe_input, a.isian 
                FROM trx_jawab_profil a JOIN 
                ref_item_tanya b ON a.kode_item = b.kode_item
                JOIN ref_vendor c
                ON a.kode_vendor = c.kode_vendor
                WHERE c.kode_vendor = :kode_vendor
                AND b.kode_kat_dokumen_vendor = :kode_kat_dokumen_vendor
            `, {
                replacements : {
                    kode_vendor : kode_vendor,
                    kode_kat_dokumen_vendor : request.kode_kat_dokumen_vendor
                },
                type : QueryTypes.SELECT
            })
            
   
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

//Store Upload Perorangan
const storeUploadSertifikat = async (request:StoreUploadSertifikatSchema["body"], file : Express.Multer.File, kode_vendor : number) : Promise<any> => {
    try {
         
        const formData = new FormData()

        formData.append('nama_aplikasi','SI-DaPeT')
        formData.append('file', fs.createReadStream(file.path))

        const upload = await uploadPdf(formData)

        console.log(upload)

        if(upload[1] !== null || !upload[0]){
            throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Upload Gagal")
        }

        const create = await SertifPerorangan.create({
            kode_vendor : kode_vendor,
            nm_sertif_orang : request.nm_sertif_orang,
            path_sertif : upload[0].file_name,
            encrypt_key : upload[0].keypass
        })


        if(!create) {
            await deleteFile(upload[0].file_name)
            throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Upload Gagal")
        }

        if(create) {
            fs.unlinkSync(file.path)
        }

        return create
        
    } catch (error) {
        console.log(error)
        fs.unlinkSync(file.path)
        if(error instanceof CustomError) {
            throw new CustomError(error.code,error.status, error.message)
        } 
        else {
            debugLogger.debug(error)
            throw new CustomError(500, responseStatus.error, "Internal server error.")
        }
    }
}


//Upload Pengalaman Perorangan
const uploadPengalamanOrang = async (
    request:StoreUploadPengalamanSchema["body"], file : Express.Multer.File, kode_vendor : number) : Promise<any> => {
    try {
        const formData = new FormData()

        formData.append('nama_aplikasi','SI-DaPeT')
        formData.append('file', fs.createReadStream(file.path))

        const upload = await uploadPdf(formData)


        if(upload[1] !== null || !upload[0]){
            throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Upload Gagal")
        }

        const create = await PengalamanPerorangan.create({
            kode_vendor : kode_vendor,
            nm_pnglmn_org : request.nm_pnglmn_org,
            path_pnglmn : upload[0].file_name,
            encrypt_key : upload[0].keypass
        })


        if(!create) {
            await deleteFile(upload[0].file_name)
            throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Upload Gagal")
        }

        if(create) {
            fs.unlinkSync(file.path)
        }

        return create
    } catch (error) {
        console.log(error)
        fs.unlinkSync(file.path)
        if(error instanceof CustomError) {
            throw new CustomError(error.code,error.status, error.message)
        } 
        else {
            debugLogger.debug(error)
            throw new CustomError(500, responseStatus.error, "Internal server error.")
        }
    }
}

//Hapus Sertifikat
const hapusSertifikat = async (id:ParameterSchema["params"]["id"]) : Promise<SertifPerorangan> => {
    try {
        const exSertif = await SertifPerorangan.findOne({
            where : {
                kode_sertif : id
            }
        })

        if(!exSertif) throw new CustomError(httpCode.notFound, responseStatus.success, "Data Sertif Tidak Ada")
            

        const hapusFile = await deleteFile(exSertif.path_sertif as string)

        console.log(hapusFile)

        // if(hapusFile[1] !== null) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Gagal Hapus File")

        const hapusData = await SertifPerorangan.destroy({
            where : {
                kode_sertif : id
            }
        })

        if(hapusData === 0 ) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Gagal Hapus Data")

        console.log(hapusFile);

        return exSertif
        
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

//Hapus Pengalaman
const hapusPengalaman = async (id:ParameterSchema["params"]["id"]) : Promise<PengalamanPerorangan> => {
    try {
        const exPengalaman = await PengalamanPerorangan.findOne({
            where : {
                kode_pengalaman : id
            }
        })

        if(!exPengalaman) throw new CustomError(httpCode.notFound, responseStatus.success, "Data Sertif Tidak Ada")
            

        const hapusFile = await deleteFile(exPengalaman.path_pnglmn as string)

        console.log(hapusFile)

        // if(hapusFile[1] !== null) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Gagal Hapus File")

        const hapusData = await PengalamanPerorangan.destroy({
            where : {
                kode_pengalaman : id
            }
        })

        if(hapusData === 0 ) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Gagal Hapus Data")

        console.log(hapusFile);

        return exPengalaman
        
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

// //GET PDF 
// const getPdfUpload = async (kode_vendor:number) : Promise<any> => {
//     try {
//         const getPdf = await 
//     } catch (error) {
        
//     }
// }

const hapusUploadProfil = async (id:ParameterSchema["params"]["id"]) : Promise<any> => {
    try {
        const exProfil = await TrxJawabProfil.findOne({
            where : {
                kode_jawab_profil : id
            }
        })

        if(!exProfil) throw new CustomError(httpCode.notFound, responseStatus.success, "Data Profil Tidak Ada")
            

        const hapusFile = await deleteFile(exProfil.isian as string)

        console.log(hapusFile)

        // if(hapusFile[1] !== null) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Gagal Hapus File")

        const hapusData = await TrxJawabProfil.destroy({
            where : {
                kode_jawab_profil : id
            }
        })

        if(hapusData === 0 ) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Gagal Hapus Data")

        console.log(hapusFile);

        return TrxJawabProfil
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


//################# PERORANGAN ########################################

//Domisili Select 
const domisili = async () : Promise<Domisili[]> => {
    try {
        const domisiliAll = await Domisili.findAll()

        return domisiliAll
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
    katItemTanya,
    listPertanyaanPerorangan,
    storeProfilVendor,
    storeUpload,
    tesDomisili,
    getProfilVendor,
    domisili,
    storeUploadSertifikat,
    uploadPengalamanOrang,
    getMenuStatus,
    hapusSertifikat,
    hapusPengalaman,
    hapusUploadProfil
}