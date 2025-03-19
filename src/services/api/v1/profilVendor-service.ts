import getConfig from "@config/dotenv";
import CustomError from "@middleware/error-handler";
import logger, { errorLogger, debugLogger } from "@config/logger";
import { httpCode, responseStatus } from "@utils/prefix";
import db from "@config/database";
import {uploadPdf, deleteFile, uploadPdfMany, uploadPdfManyPersonalia, uploadPdfArray} from "@services/pdf_upload"
import { showFile } from "@services/pdf_show";

//Import Model
import JenisVendor from "@models/jenisVendor-model";
import KatDokumenVendor from "@models/katDokumenVendor-model";
import KatItemTanya from "@models/katItemTanya-model";
import ItemTanya from "@models/itemTanya-model";
import Domisili from "@models/domisili-model";
import TrxKatDokKomplit from "@models/trxKatDokKomplit-model";
import SertifPerorangan from "@models/sertifikatPerorangan-model";
import PengalamanPerorangan from "@models/pengalamanPerorangan-model";
import RegisterVendor from "@models/registerVendor-model";
import KomisarisPerusahaan from "@models/komisarisPerusahaan-model";
import DireksiPerusahaan from "@models/direksiPerusahaan-model";
import IjinUsahaPerusahaan, { jenis_izin_usaha } from "@models/ijinUsahaPerusahaan-model";
import SahamPerusahaan from "@models/sahamPerusahaan-model";
import PersonaliaPerusahaan from "@models/personalianPerusahaan-model";
import FasilitasPerusahaan from "@models/fasilitasPerusahaan-model";
import Pengalaman from "@models/pengalaman-model";
import PengalamanSekarang from "@models/pengalamanSekarang-model";

//Import Schema
import {
    ParameterSchema, 
    QuerySchema,
    StoreProfilVendorSchema,
    StoreUploadVendorSchema,
    GetJawabProfilVendorSchema,
    StoreUploadSertifikatSchema,
    StoreUploadPengalamanSchema,
    StoreUploadKomisarisSchema,
    UpdateKomisarisSchema,
    PayloadDireksiSchema,
    PayloadUpdateDireksiSchema,
    PayloadIjinUsaha,
    PayloadIjinUsahaUpdateSchema,
    PayloadSahamPerusahaanSchema,
    PayloadSahamPerusahaanUpdateSchema,
    PayloadPersonaliaSchema,
    PayloadPersonaliaUpdateSchema,
    PayloadFasilitasSchema,
    PayloadFasilitasUpdateSchema,
    PayloadPengalamanSchema,
    PayloadPengalamanUpdateSchema,
    PayloadPengalamanSekarangSchema,
    PayloadPengalamanSekarangUpdateSchema,
    PayloadKantorSchema, 
    PayloadKantorUpdateSchema,
    PayloadTenagaAhliSchema,
    PayloadTenagaAhliUpdateSchema,
    PayloadTenagaPendukungSchema,
    PayloadTenagaPendukungUpdateSchema,
    PayloadPengalamanTaSchema,
    PayloadPengalamanTpSchema,
    PayloadStoreUploadPengalamanPeroranganSchema,
    PayloadStoreUploadSertifikatPeroranganSchema,
    PayloadSertifikatTASchema,
    PayloadSertifikatTPSchema,
    PayloadPengalamanTaSatuanSchema,
    PayloadPengalamaTpSatuanSchema,
    PayloadSertifikatTASatuanSchema,
    PayloadSertifikatTPSatuanSchema,
} from "@schema/api/profilVendor-schema"

import { QueryTypes, Sequelize } from "sequelize";
import sequelize from "sequelize";
import TrxJawabProfil, { TrxJawabProfilOutput } from "@models/trxJawabProfil-model";
import { Op } from "sequelize";
import FormData from "form-data"

import fs from "fs"

import {setCache, getCache, delCache,flushAllCache} from "@cache/cache"
import path from "path";
import moment from "moment";
import Kantor from "@models/kantor-model";
import TenagaAhli from "@models/tenagaAhli-model";
import TenagaPendukung from "@models/tenagaPendukung-model";
import PengalamanTa from "@models/pengalamanTa-model";
import PengalamanTp from "@models/pengalamanTp-model";
import SertifTA from "@models/sertifTA-model";
import SertifTP from "@models/sertifTP-model";


//GET MENU 
const getMenuAll = async (id : ParameterSchema["params"]["id"]) : Promise <KatDokumenVendor[]> => {
    try {
        const cacheKey = `menu_${id}`
        const cacheMenu = getCache(cacheKey)

        if(cacheMenu) {
            console.log("TES DATA");
            
            return cacheMenu
        }

        const getMenu : KatDokumenVendor[] = await KatDokumenVendor.findAll({
            where : {
                is_main : true,
                kode_jenis_vendor : parseInt(id)
            }
        })

        // console.log("TESDATA", getMenu)

        setCache(cacheKey, getMenu)

        return getMenu
    } catch (error) {
        debugLogger.debug(error)
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
        const cacheKey = `submenu_${id}`
        const cacheSubMenu = getCache(cacheKey)

        if(cacheSubMenu) {
            return cacheSubMenu
        }

        const getMenuSub : KatDokumenVendor[] = await KatDokumenVendor.findAll({
            where : {
                main_kat : id,
                is_main : false
            }
        })

        setCache(cacheKey, getMenuSub)

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

//Get Profil Perorangan
const getProfilVendor = async (request:GetJawabProfilVendorSchema["body"], kode_vendor : number) : Promise<any> => {
    try {
        const queryJawabItem : any = await db.query(`
            SELECT a.kode_jawab_profil, c.kode_vendor, c.nama_perusahaan, b.kode_item, b.nama_item, b.tipe_input, a.isian 
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


            for(const item of queryJawabItem) {
                if(item.tipe_input === "table"){
                    const callNamaTabel : any = await db.query(`
                    SELECT metadata->>'nama_tabel' AS tabel FROM ref_item_tanya WHERE kode_item = ${item.kode_item}
                    `, {
                        type : QueryTypes.SELECT
                    })


                    const cekDataquery : any = await db.query(`
                        SELECT * FROM ${callNamaTabel[0].tabel} WHERE kode_vendor = :kode_vendor
                        `, {
                            replacements : {
                                kode_vendor : kode_vendor
                            },
                            type : QueryTypes.SELECT
                    })

                    await cekDataquery.forEach((row : any) => {
                        delete row.encrypt_key;
                    });
                    
                    let showData

                    if(cekDataquery.length !== 0) {
                        showData = cekDataquery
                    } 
                    else {
                        showData = []
                    }

                    item.isian = showData;
                }
            }
   

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

//Store Profil Vendor
const storeProfilVendor = async (request:StoreProfilVendorSchema["body"], kode_vendor : number) : Promise<any> => {
    const t = await db.transaction()
    try {


        const profil : StoreProfilVendorSchema["body"]["profil"] = request.profil

        const arrExist : any[] = []

        let arrBerhasil : any[] = []

        const arrGagal : any[] = []

        await Promise.all(profil.map(async(item : any) => {
            const exProfil = await TrxJawabProfil.findOne({
                where : {
                    kode_item : item.kode_item,
                    kode_vendor : kode_vendor,
                }, 
                transaction : t
            })
            if(exProfil) {
                // arrExist.push({
                //     kode_vendor : exProfil.kode_vendor,
                //     kode_item : exProfil.kode_item,
                //     isian : exProfil.isian
                // })
                // let delExist = await TrxJawabProfil.destroy({
                //     where : {
                //         kode_vendor : kode_vendor,
                //         kode_item : exProfil.kode_item
                //     },
                //     transaction : t
                // })

                // if(delExist === 0) {
                //     arrGagal.push({
                //         kode_vendor : exProfil.kode_vendor,
                //         kode_item : exProfil.kode_item,
                //         isian : exProfil.isian
                //     })
                // }
                
                const UpdateExist = await TrxJawabProfil.update({
                    isian : item.isian
                }, {
                    where : {
                        kode_vendor : kode_vendor,
                        kode_item : exProfil.kode_item,
                    },
                    returning : true,
                    transaction : t
                })

                

                if(UpdateExist[0] === 0) {
                    arrGagal.push({
                        kode_vendor : exProfil.kode_vendor,
                        kode_item : exProfil.kode_item,
                        isian : exProfil.isian
                    })
                }
                arrExist.push({
                    kode_jawab_profil : exProfil.kode_jawab_profil,
                    kode_vendor : UpdateExist[1][0].kode_vendor,
                    kode_item : UpdateExist[1][0].kode_item,
                    isian : UpdateExist[1][0].isian
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
            returning : ["kode_jawab_profil", "kode_item","kode_vendor","isian"],
            transaction : t
        })

        arrBerhasil = arrBerhasil.concat(arrExist)

        


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

        if(!getKatDokumen) throw new CustomError(httpCode.notFound, responseStatus.success, "Kat Dokumen Vendor Tidak Ada")

        const getItemTanya = await ItemTanya.findAll({
            where : {
                kode_kat_dokumen_vendor : getKatDokumen.kode_kat_dokumen_vendor,
                is_required : true
            },
            raw : true,
            transaction : t
        })

        const jawabProfil = await TrxJawabProfil.findAll({
            where : {
                kode_vendor : kode_vendor
            },
            raw : true,
            transaction : t
        })

        const unsansweredItems = getItemTanya.filter(tanya => !jawabProfil.some(jawab => jawab.kode_item === tanya.kode_item))

        

        const status = unsansweredItems.length === 0 ? "finish" : "not_finish"

        let storeStatus

        if(status === "finish") {
            let checkStatus = await TrxKatDokKomplit.findOne({
                where : {
                    kode_vendor : kode_vendor,
                    kode_kat_dokumen_vendor : getKatDokumen?.kode_kat_dokumen_vendor,
                },
                transaction : t
            })

            if(!checkStatus) {
                storeStatus = await TrxKatDokKomplit.create({
                    kode_kat_dokumen_vendor : getKatDokumen?.kode_kat_dokumen_vendor,
                    kode_vendor : kode_vendor,
                    is_komplit : true
                }, {transaction : t})
            }

            else {
                storeStatus = await TrxKatDokKomplit.update({
                    is_komplit : true
                }, {
                    where : {
                        kode_kat_dokumen_vendor : getKatDokumen?.kode_kat_dokumen_vendor,
                        kode_vendor : kode_vendor,
                    },
                    transaction : t
                })
            }

        }
        else {
           let checkStatus = await TrxKatDokKomplit.findOne({
                where : {
                    kode_vendor : kode_vendor,
                    kode_kat_dokumen_vendor : getKatDokumen?.kode_kat_dokumen_vendor,
                },
                transaction : t
            })

            if(!checkStatus) {
                storeStatus = await TrxKatDokKomplit.create({
                    kode_kat_dokumen_vendor : getKatDokumen?.kode_kat_dokumen_vendor,
                    kode_vendor : kode_vendor,
                    is_komplit : false
                }, {transaction : t})
            }

            else {
                storeStatus = await TrxKatDokKomplit.update({
                    is_komplit : false
                }, {
                    where : {
                        kode_kat_dokumen_vendor : getKatDokumen?.kode_kat_dokumen_vendor,
                        kode_vendor : kode_vendor,
                    },
                    transaction : t
                })
            }
        }
 

        if(!storeStatus) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Gagal Merubah Status Profil")

        await t.commit()

        return arrBerhasil
        
        
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
    const t = await db.transaction()
    try {        


        if(!file) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "File Tidak Terkirim")

        if(!user || user === null || user === undefined) throw new CustomError(httpCode.unauthorized, responseStatus.error, "Belum Terdaftar Sebagai Vendor")

        const exProfil = await TrxJawabProfil.findOne({
            where : {
                kode_item : request.kode_item,
                kode_vendor : user
            },
            transaction : t
        })
        
     

        if (exProfil) throw new CustomError(httpCode.conflict, responseStatus.success, "Data Sudah Terdaftar")


        const formData = new FormData()

        formData.append('nama_aplikasi','SI-DaPeT')
        formData.append('file', fs.createReadStream(file.path))


        const upload = await uploadPdf(formData)


        if(upload[1] !== null || !upload[0]){
            throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, `Upload Gagal ada kesalahan service : ${upload[1]}`)
        }
            

        const create = await TrxJawabProfil.create({
            kode_item : parseInt(request.kode_item),
            kode_vendor : user,
            isian : upload[0].file_name,
            encrypt_key : upload[0].keypass
        },
        {
            transaction : t,
            returning : ["kode_jawab_profil","kode_item","kode_vendor", "isian"],
           
        },
        )    

        const result = {
            kode_item : create.kode_item,
            kode_vendor : user,
            isian : create.isian
        }

        if(!create) {
            await deleteFile(upload[0].file_name)
            throw new CustomError(httpCode.serviceUnavailable, responseStatus.error, "Gagal Upload File")
        }
           

        if(create) {
            fs.unlinkSync(file.path)
        }

        const getKatDokumen : ItemTanya | null = await ItemTanya.findOne({
            where : {
                kode_item : parseInt(request.kode_item)
            },
            attributes : [
                "kode_item",
                "kode_kat_dokumen_vendor"
            ],
            transaction : t
        })

        if(!getKatDokumen) throw new CustomError(httpCode.notFound, responseStatus.success, "Kat Dokumen Vendor Tidak Ada")


        const getItemTanya = await ItemTanya.findAll({
            where : {
                kode_kat_dokumen_vendor : getKatDokumen.kode_kat_dokumen_vendor,
                is_required : true
            },
            raw : true,
            transaction : t
        })

        

        const jawabProfil = await TrxJawabProfil.findAll({
            where : {
                kode_vendor : user
            },
            raw : true,
            transaction : t
        })

        const unsansweredItems = getItemTanya.filter(tanya => !jawabProfil.some(jawab => jawab.kode_item === tanya.kode_item))


        const status = unsansweredItems.length === 0 ? "finish" : "not_finish"

        let storeStatus

        if(status === "finish") {
            let checkStatus = await TrxKatDokKomplit.findOne({
                where : {
                    kode_vendor : user,
                    kode_kat_dokumen_vendor : getKatDokumen?.kode_kat_dokumen_vendor,
                },
                transaction : t
            })

            if(!checkStatus) {
                storeStatus = await TrxKatDokKomplit.create({
                    kode_kat_dokumen_vendor : getKatDokumen?.kode_kat_dokumen_vendor,
                    kode_vendor : user,
                    is_komplit : true
                }, {transaction : t})
            }

            else {
                storeStatus = await TrxKatDokKomplit.update({
                    is_komplit : true
                }, {
                    where : {
                        kode_kat_dokumen_vendor : getKatDokumen?.kode_kat_dokumen_vendor,
                        kode_vendor : user,
                    },
                    transaction : t
                })
            }
        }
        else {
            let checkStatus = await TrxKatDokKomplit.findOne({
                where : {
                    kode_vendor : user,
                    kode_kat_dokumen_vendor : getKatDokumen?.kode_kat_dokumen_vendor,
                }
            })

            if(!checkStatus) {
                storeStatus = await TrxKatDokKomplit.create({
                    kode_kat_dokumen_vendor : getKatDokumen?.kode_kat_dokumen_vendor,
                    kode_vendor : user,
                    is_komplit : false
                }, {transaction : t})
            }

            else {
                storeStatus = await TrxKatDokKomplit.update({
                    is_komplit : false
                }, {
                    where : {
                        kode_kat_dokumen_vendor : getKatDokumen?.kode_kat_dokumen_vendor,
                        kode_vendor : user,
                    },
                    transaction : t
                })
            }
        }
 

        if(!storeStatus) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Gagal Merubah Status Profil")

        await t.commit()

        return result
    } catch (error) {

        fs.unlinkSync(file.path)
        
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


//UPDATE PROFIL
const updateProfil = async (request:StoreProfilVendorSchema["body"]) => {
    const profil : StoreProfilVendorSchema["body"]["profil"] = request.profil

    const arrGagal : any[] = []

    const arrBerhasil : any[] = []



}

//Hapus Profil 
const hapusProfil = async (id:ParameterSchema["params"]["id"]) : Promise<TrxJawabProfil>=> {
    try {
        const exProfil = await TrxJawabProfil.findByPk(id, {
            attributes : {exclude : ["encrypt_key"]}
        })

        if(!exProfil) throw new CustomError(httpCode.notFound, responseStatus.success, "Data Profil Tidak Ada")

        const deleteProfil = await TrxJawabProfil.destroy({
            where : {
                kode_jawab_profil : id
            }
        })

        if(deleteProfil === 0) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Gagal Hapus Data")

        return exProfil
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
                            attributes : ["kode_item", "kode_kat_item_tanya", "urutan", "nama_item", "tipe_input", "keterangan", "nama_unik", "jenis_item", "is_required", "metadata"],
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
            [{ model: KatItemTanya, as: "KatItemTanya" },"kode_kat_item_tanya", "ASC"],
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

//Get Menu With Status By User
const getMenuStatus = async (kode_vendor:number) : Promise<KatDokumenVendor[]> => {
    try {
        
        const getJenisVndor = await RegisterVendor.findOne({
            attributes : ["kode_jenis_vendor", "kode_vendor"],
            where : {
                kode_vendor : kode_vendor
            },
            raw : true
        })
        

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
            ],
            raw : true, 
            nest : true,
            order :[
                ["urutan", "ASC"]
            ]
            
            
        })

        const sub = await KatDokumenVendor.findAll({
            where : {
                kode_jenis_vendor : 1
            },
            attributes: [
                "kode_kat_dokumen_vendor",
                "kode_jenis_vendor",
                "urutan",
                "main_kat",
                "nama_kategori",
                [sequelize.literal(`Case 
                    WHEN "TrxKatDokKomplit"."is_komplit" = TRUE 
                    THEN TRUE
                    ELSE FALSE 
                    END
                    `), 'status_komplit']
            ],
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
            ],
            raw : true,
            order : [
                ["urutan", "ASC"]
            ]
        })

        console.log(sub)

        // getMenu.forEach((item : any) => {
        //     if(item.is_has_sub === true) {
        //         const matchingMain = sub.filter(
        //             (sub : any) => sub.main_kat === item.kode_kat_dokumen_vendor
        //         );

        //         item.subMenu = matchingMain.length > 0 ? matchingMain.map((subItem: any) => ({
        //             kode_kat_dokumen_vendor: subItem.kode_kat_dokumen_vendor,
        //             nama_kategori: subItem.nama_kategori
        //         })) : null;
        //     }
        // }) 

        getMenu.forEach((item: any) => {
            if (item.is_has_sub === true) {
                // Filter sub-items where main_kat matches the kode_kat_dokumen_vendor
                const matchingMain = sub.filter(
                    (subItem: any) => subItem.main_kat === item.kode_kat_dokumen_vendor
                );
        
                // If there are matching sub-items, map them to the desired format; otherwise, set subMenu to null
                item.subMenu = matchingMain.length > 0 
                    ? matchingMain.map((subItem: any) => ({
                        kode_kat_dokumen_vendor: subItem.kode_kat_dokumen_vendor,
                        nama_kategori: subItem.nama_kategori,
                        urutan : subItem.urutan,
                        status_komplit : subItem.status_komplit
                    }))
                    : null;

                     // Set getMenu's status_komplit based on all subMenu items
                        if (item.subMenu && item.subMenu.length > 0) {
                            item.status_komplit = item.subMenu.every((subItem: any) => subItem.status_komplit === true);
                        } else {
                            item.status_komplit = false;
                        }
            } else {
                // If item.is_has_sub is false, ensure subMenu is null
                item.subMenu = null;
            }
        });
        

        console.log("TESDATA : ", getMenu)

        return getMenu
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



//Get Pengalaman 
const getPengalamanVendor = async (kode_vendor : number) : Promise<PengalamanPerorangan[]> => {
    try {
        const getPengalaman  : PengalamanPerorangan[]= await PengalamanPerorangan.findAll({
            where : {
                kode_vendor : kode_vendor
            },
            attributes : {exclude : ["custom", "encrypt_key"]}
        })

        return getPengalaman
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

//Pengalaman Perorangan
//############# Upload Pengalaman Perorangan ###########################
const uploadPengalamanOrang = async (
    request:PayloadStoreUploadPengalamanPeroranganSchema["body"], file : Express.Multer.File, kode_vendor : number) : Promise<any> => {
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
            nama_pekerjaan : request.nama_pekerjaan,
            posisi : request.posisi,
            jangka_waktu : request.jangka_waktu,
            nilai_pekerjaan : parseInt(request.nilai_pekerjaan),
            file_bukti : upload[0].file_name,
            encrypt_key : upload[0].keypass
        }, 
        {
            returning : ["kode_vendor", "nama_pekerjaan","posisi","jangka_waktu", "nilai_pekerjaan", "file_bukti", "encrypt_key"]
        })

        const result = {
            kode_vendor : kode_vendor, 
            nomor : create.nama_pekerjaan,
            posisi : create.posisi,
            jangka_waktu : create.jangka_waktu,
            nilai_pekerjaan : create.nilai_pekerjaan,
            file_bukti : create.encrypt_key,
        }


        if(!create) {
            await deleteFile(upload[0].file_name)
            throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Upload Gagal")
        }

        if(create) {
            fs.unlinkSync(file.path)
        }

        return result
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

//Hapus Pengalaman
const hapusPengalaman = async (id:ParameterSchema["params"]["id"]) : Promise<PengalamanPerorangan> => {
    try {
        const exPengalaman = await PengalamanPerorangan.findOne({
            where : {
                kode_pengalaman_perorangan : id
            }
        })

        if(!exPengalaman) throw new CustomError(httpCode.notFound, responseStatus.success, "Data Sertif Tidak Ada")
            

        const hapusFile = await deleteFile(exPengalaman.file_bukti as string)


        if(hapusFile[1] !== null) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Gagal Hapus File")

        const hapusData = await PengalamanPerorangan.destroy({
            where : {
                kode_pengalaman_perorangan : id
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

const getPdfUploadPengalamanPerorangan = async (id:ParameterSchema["params"]["id"], kode_vendor:number) : Promise<any> => {
    try {
        const getPengalaman = await PengalamanPerorangan.findOne({
            where : {
                kode_vendor : kode_vendor,
                kode_pengalaman_perorangan : id,
                encrypt_key : {
                    [Op.not] : null
                }
            }
        })        

        if(!getPengalaman) throw new CustomError(httpCode.notFound, responseStatus.error, "Data Tidak Tersedia / Data Bukan Format PDF")

        const data = {
            nama_file : getPengalaman.file_bukti as string, 
            keypass : getPengalaman.encrypt_key as string
        }


        const tampilGambar = await showFile(data)

        return tampilGambar[0]

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

// #################################################################################################
// ######################## SERTIFIKAT PERORANGAN ##################################################
//Upload Sertifikat
const storeUploadSertifikat = async (request:PayloadStoreUploadSertifikatPeroranganSchema["body"], file : Express.Multer.File, kode_vendor : number) : Promise<any> => {
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
            nm_sertifikat: request.nm_sertif,
            file_bukti : upload[0].file_name,
            encrypt_key : upload[0].keypass
        },
        {
            returning : ["kode_vendor", "nm_sertifikat", "file_bukti"]
        })

        const result = {
            kode_vendor : kode_vendor,
            nm_sertifikat : create.nm_sertifikat,
            file_bukti : create.file_bukti
        }


        if(!create) {
            await deleteFile(upload[0].file_name)
            throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Upload Gagal")
        }

        if(create) {
            fs.unlinkSync(file.path)
        }

        return result
        
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

//Get Sertifikat 
const getSertifikat = async ( kode_vendor : number) : Promise<SertifPerorangan[]> => {
    try {
        const getSertifikat  : SertifPerorangan[]= await SertifPerorangan.findAll({
            where : {
                kode_vendor : kode_vendor
            },
            attributes : {exclude : ["custom", "encrypt_key"]}
        })

        return getSertifikat
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
//Hapus Sertifikat
const hapusSertifikat = async (id:ParameterSchema["params"]["id"]) : Promise<SertifPerorangan> => {
    try {
        const exSertif = await SertifPerorangan.findOne({
            where : {
                kode_sertif_perorangan : id
            }
        })

        if(!exSertif) throw new CustomError(httpCode.notFound, responseStatus.success, "Data Sertif Tidak Ada")
            

        const hapusFile = await deleteFile(exSertif.file_bukti as string)


        if(hapusFile[1] !== null) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Gagal Hapus File")

        const hapusData = await SertifPerorangan.destroy({
            where : {
                kode_sertif_perorangan : id
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

//Get PDF SERTIFIKAT
const getPdfUploadSertifikat = async (id:ParameterSchema["params"]["id"], kode_vendor:number) : Promise<any> => {
    try {
        const getSertifikat = await SertifPerorangan.findOne({
            where : {
                kode_vendor : kode_vendor,
                kode_sertif_perorangan : id,
                encrypt_key : {
                    [Op.not] : null
                }
            }
        })

        if(!getSertifikat) throw new CustomError(httpCode.notFound, responseStatus.error, "Data Tidak Tersedia / Data Bukan Format PDF")

        const data = {
            nama_file : getSertifikat.file_bukti as string, 
            keypass : getSertifikat.encrypt_key as string
        }


        const tampilGambar = await showFile(data)

        return tampilGambar[0]

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

// ###############################################################################################

//GET PDF 
const getPdfUpload = async (id:ParameterSchema["params"]["id"], kode_vendor:number) : Promise<any> => {
    try {
        const exTrxProfil = await TrxJawabProfil.findOne({
            where : {
                kode_vendor : kode_vendor,
                kode_jawab_profil : id,
                encrypt_key : {
                    [Op.not] : null
                }
            }
        })

        

        if(!exTrxProfil) throw new CustomError(httpCode.notFound, responseStatus.error, "Data Bukan Format PDF}")

        const data = {
            nama_file : exTrxProfil.isian as string, 
            keypass : exTrxProfil.encrypt_key as string
        }


        const tampilGambar = await showFile(data)

        console.log(tampilGambar)

        return tampilGambar[0]
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

        if(hapusFile[1] !== null) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Gagal Hapus File")

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



//#################### BADAN USAHA #####################################
//List Pertanyaan Badan Usaha
const listPertanyaanBadanUsaha = async (
    id:ParameterSchema["params"]["id"]) : Promise<KatDokumenVendor | null> => {
    try {
        const listPertanyaan : KatDokumenVendor | null = await KatDokumenVendor.findOne({
            attributes : ["kode_kat_dokumen_vendor", "kode_jenis_vendor", "nama_kategori", "is_main","is_has_sub"],
            where : {
                kode_jenis_vendor : 1, 
                kode_kat_dokumen_vendor : id,
            }, 
            include : [
                {
                    attributes : ["kode_kat_item_tanya", "kode_kat_dokumen_vendor", "kategori_item"],
                    model : KatItemTanya, 
                    as : "KatItemTanya", 
                    include : [
                        {
                            attributes : ["kode_item", "kode_kat_item_tanya", "urutan", "nama_item", "tipe_input", "keterangan", "nama_unik", "jenis_item", "is_required","metadata"],
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
            [{model : KatItemTanya, as : "KatItemTanya"}, "kode_kat_item_tanya", "ASC"],
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

//**************** PENGURUS BADAN USAHA ****************************** */

// ################ KOMISARIS ##############################
const getKomisarisVendor = async (kode_vendor:number) : Promise<KomisarisPerusahaan[]> => {
    try {
        const getKomisaris : KomisarisPerusahaan[] = await KomisarisPerusahaan.findAll({
            where : {
                kode_vendor : kode_vendor
            },
            attributes : {exclude : ["encrypt_key"]}
        })

        return getKomisaris
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

const storeUploadKomisaris = async (request:StoreUploadKomisarisSchema["body"], kode_vendor : number, file : Express.Multer.File) => {
    try {
        const formData = new FormData()

        formData.append('nama_aplikasi','SI-DaPeT')
        formData.append('file', fs.createReadStream(file.path))

        const upload = await uploadPdf(formData)


        if(upload[1] !== null || !upload[0]){
            console.log("CEK ERROR :", upload[1])
            throw new CustomError(httpCode.badRequest, responseStatus.error, "Upload Gagal")
        }

        const create = await KomisarisPerusahaan.create({
            kode_vendor : kode_vendor,
            nm_komisaris : request.nm_komisaris,
            jbtn_komisaris : request.jbtn_komisaris,
            hp_komisaris : request.hp_komisaris,
            no_ktp_komisaris : request.no_ktp_komisaris,
            is_ktp_selamanya : request.is_ktp_selamanya === "true" ? true : false,
            ktp_berlaku_awal : request.ktp_berlaku_awal ? moment.utc(request.ktp_berlaku_awal, "YYYY-MM-DD").toDate() : undefined,
            ktp_berlaku_akhir : request.ktp_berlaku_akhir ? moment.utc(request.ktp_berlaku_akhir, "YYYY-MM-DD").toDate() : undefined,
            path_ktp_komisaris : upload[0].file_name,
            encrypt_key : upload[0].keypass
        })

        const result = {
            kode_vendor : kode_vendor,
            nm_komisaris : request.nm_komisaris,
            jbtn_komisaris : request.jbtn_komisaris,
            hp_komisaris : request.hp_komisaris,
            no_ktp_komisaris : request.no_ktp_komisaris,
            is_ktp_selamanya : request.is_ktp_selamanya,
            ktp_berlaku_awal : request.ktp_berlaku_awal,
            ktp_berlaku_akhir : request.ktp_berlaku_akhir,
            path_ktp_komisaris : upload[0].file_name,
        }

        if(!create) {
            await deleteFile(upload[0].file_name)
            throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Upload Gagal")
        }

        if(create) {
            fs.unlinkSync(file.path)
        }

        return result


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

const hapusKomisaris = async (id:ParameterSchema["params"]["id"]) : Promise<KomisarisPerusahaan> => {
    try {
        const exKomisaris = await KomisarisPerusahaan.findOne({
            where : {
                kode_komisaris : id
            }
        })

        if(!exKomisaris) throw new CustomError(httpCode.notFound, responseStatus.success, "Data Komisaris Tidak Ada")
            

        const hapusFile = await deleteFile(exKomisaris.path_ktp_komisaris as string)

        console.log(hapusFile)

        if(hapusFile[1] !== null) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Gagal Hapus File")

        const hapusData = await KomisarisPerusahaan.destroy({
            where : {
                kode_komisaris : id
            }
        })

        if(hapusData === 0 ) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Gagal Hapus Data")

        console.log(hapusFile);

        return exKomisaris
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

const getPdfUploadKomisaris = async (id:ParameterSchema["params"]["id"], kode_vendor:number) : Promise<any> => {
    try {
        const getKomisaris = await KomisarisPerusahaan.findOne({
            where : {
                kode_vendor : kode_vendor,
                kode_komisaris : id,
                encrypt_key : {
                    [Op.not] : null
                }
            }
        })

        if(!getKomisaris) throw new CustomError(httpCode.notFound, responseStatus.error, "Data Tidak Tersedia / Data Bukan Format PDF")

        const data = {
            nama_file : getKomisaris.path_ktp_komisaris as string, 
            keypass : getKomisaris.encrypt_key as string
        }


        const tampilGambar = await showFile(data)

        return tampilGambar[0]

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

const updateKomisaris = async (id:UpdateKomisarisSchema["params"]["id"], 
    request:UpdateKomisarisSchema["body"],
     file : Express.Multer.File) : Promise<any> => {
    try {
        const exKomisaris = await KomisarisPerusahaan.findByPk(id)

        if(!exKomisaris) throw new CustomError(httpCode.notFound, responseStatus.success, "Komisaris Tidak Tersedia")

        let komisarisUpdate

        if(!file) {
            exKomisaris.nm_komisaris     = request.nm_komisaris
            exKomisaris.jbtn_komisaris   = request.jbtn_komisaris
            exKomisaris.hp_komisaris     = request.hp_komisaris
            exKomisaris.no_ktp_komisaris = request.no_ktp_komisaris
            exKomisaris.is_ktp_selamanya = request.is_ktp_selamanya === "true" ? true : false
            exKomisaris.ktp_berlaku_awal = request.ktp_berlaku_awal ? moment.utc(request.ktp_berlaku_awal, "YYYY-MM-DD").toDate() : undefined
            exKomisaris.ktp_berlaku_akhir = request.ktp_berlaku_akhir ? moment.utc(request.ktp_berlaku_akhir, "YYYY-MM-DD").toDate() : undefined

           await exKomisaris.save()
           komisarisUpdate = {
            nm_komisaris    : request.nm_komisaris,
            jbtn_komisaris  : request.jbtn_komisaris,
            hp_komisaris    : request.hp_komisaris,
            no_ktp_komisaris: request.no_ktp_komisaris,
            is_ktp_selamanya : request.is_ktp_selamanya,
            ktp_berlaku_awal : request.ktp_berlaku_awal,
            ktp_berlaku_akhir : request.ktp_berlaku_akhir,
            
        }
        }

        else {
            await deleteFile(exKomisaris.path_ktp_komisaris as string)

            const formData = new FormData()

            formData.append('nama_aplikasi','SI-DaPeT')
            formData.append('file', fs.createReadStream(file.path))
    
            const upload = await uploadPdf(formData)
    
    
            if(upload[1] !== null || !upload[0]){
                throw new CustomError(httpCode.badRequest, responseStatus.error, "Upload Gagal")
            }

            let komisarisUpd = await KomisarisPerusahaan.update({
                nm_komisaris      : request.nm_komisaris,
                jbtn_komisaris    : request.jbtn_komisaris,
                hp_komisaris      : request.hp_komisaris,
                no_ktp_komisaris  : request.no_ktp_komisaris,
                is_ktp_selamanya  : request.is_ktp_selamanya === "true" ? true                                              : false,
                ktp_berlaku_awal  : request.ktp_berlaku_awal ? moment.utc(request.ktp_berlaku_awal, "YYYY-MM-DD").toDate()  : undefined,
                ktp_berlaku_akhir : request.ktp_berlaku_akhir ? moment.utc(request.ktp_berlaku_akhir, "YYYY-MM-DD").toDate(): undefined,
                path_ktp_komisaris: upload[0].file_name,
                encrypt_key       : upload[0].keypass
            },{
                where : {
                    kode_komisaris: id
                },
                returning : true,
            })

            console.log(komisarisUpd)

            if(komisarisUpd[0] === 0) throw new CustomError(httpCode.unprocessableEntity,responseStatus.error,"Gagal Update Komisaris")

            komisarisUpdate = {
                nm_komisaris      : komisarisUpd[1][0].nm_komisaris,
                jbtn_direksi      : komisarisUpd[1][0].jbtn_komisaris,
                hp_komisaris      : komisarisUpd[1][0].hp_komisaris,
                no_ktp_komisaris  : komisarisUpd[1][0].no_ktp_komisaris,
                path_ktp_komisaris: komisarisUpd[1][0].path_ktp_komisaris,
                is_ktp_selamanya  : komisarisUpd[1][0].is_ktp_selamanya,
                ktp_berlaku_awal  : komisarisUpd[1][0].ktp_berlaku_awal,
                ktp_berlaku_akhir : komisarisUpd[1][0].ktp_berlaku_akhir,
            }
           
        }

        return komisarisUpdate
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


// ################ DIREKSI ################################
const getDireksiVendor = async (kode_vendor:number) : Promise<DireksiPerusahaan[]> => {
    try {
        const getDireksi : DireksiPerusahaan[] = await DireksiPerusahaan.findAll({
            where : {
                kode_vendor : kode_vendor
            },
            attributes : {exclude : ["encrypt_key"]}
        })

        return getDireksi
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

const storeUploadDireksi = async (request:PayloadDireksiSchema["body"], kode_vendor : number, file : Express.Multer.File) => {
    try {
        const formData = new FormData()

        formData.append('nama_aplikasi','SI-DaPeT')
        formData.append('file', fs.createReadStream(file.path))

        const upload = await uploadPdf(formData)


        if(upload[1] !== null || !upload[0]){
            throw new CustomError(httpCode.badRequest, responseStatus.error, "Upload Gagal")
        }

        const create = await DireksiPerusahaan.create({
            kode_vendor : kode_vendor,
            nm_direksi : request.nm_direksi,
            jbtn_direksi : request.jbtn_direksi,
            hp_direksi : request.hp_direksi,
            no_ktp_direksi : request.no_ktp_direksi,
            is_ktp_selamanya : request.is_ktp_selamanya === "true" ? true : false,
            ktp_berlaku_awal : request.ktp_berlaku_awal ?  moment.utc(request.ktp_berlaku_awal, "YYYY-MM-DD").toDate() : undefined,
            ktp_berlaku_akhir : request.ktp_berlaku_akhir ?  moment.utc(request.ktp_berlaku_akhir, "YYYY-MM-DD").toDate() : undefined,
            path_ktp_direksi : upload[0].file_name,
            encrypt_key : upload[0].keypass
        })

        const result = {
            kode_vendor : kode_vendor,
            nm_direksi : request.nm_direksi,
            jbtn_direksi : request.jbtn_direksi,
            hp_direksi : request.hp_direksi,
            is_ktp_selamanya : request.is_ktp_selamanya === "true" ? true : false,
            ktp_berlaku_awal : request.ktp_berlaku_awal,
            ktp_berlaku_akhir : request.ktp_berlaku_akhir,
            no_ktp_direksi : request.no_ktp_direksi,
            path_ktp_direksi : upload[0].file_name,
        }

        if(!create) {
            await deleteFile(upload[0].file_name)
            throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Upload Gagal")
        }

        if(create) {
            fs.unlinkSync(file.path)
        }

        return result


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

const hapusDireksi = async (id:ParameterSchema["params"]["id"]) : Promise<DireksiPerusahaan> => {
    try {
        const exDireksi = await DireksiPerusahaan.findOne({
            where : {
                kode_direksi_perus : id
            },
            attributes : {exclude : ["encrypt_key"]}
        })

        if(!exDireksi) throw new CustomError(httpCode.notFound, responseStatus.success, "Data Direksi Tidak Ada")
            

        const hapusFile = await deleteFile(exDireksi.path_ktp_direksi as string)

        if(hapusFile[1] !== null) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Gagal Hapus File")

        const hapusData = await DireksiPerusahaan.destroy({
            where : {
                kode_direksi_perus : id
            }
        })

        if(hapusData === 0 ) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Gagal Hapus Data")

        return exDireksi
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

const getPdfUploadDireksi = async (id:ParameterSchema["params"]["id"], kode_vendor:number) : Promise<any> => {
    try {
        const getDireksi = await DireksiPerusahaan.findOne({
            where : {
                kode_vendor : kode_vendor,
                kode_direksi_perus : id,
                encrypt_key : {
                    [Op.not] : null
                }
            }
        })


        if(!getDireksi) throw new CustomError(httpCode.notFound, responseStatus.error, "Data Tidak Tersedia / Data Bukan Format PDF")

        const data = {
            nama_file : getDireksi.path_ktp_direksi as string, 
            keypass : getDireksi.encrypt_key as string
        }


        const tampilGambar = await showFile(data)

        return tampilGambar[0]

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

const updateDireksi = async (id:PayloadUpdateDireksiSchema["params"]["id"], 
    request:PayloadUpdateDireksiSchema["body"],
     file : Express.Multer.File) : Promise<any> => {
    try {
        const exDireksi = await DireksiPerusahaan.findByPk(id)

        if(!exDireksi) throw new CustomError(httpCode.notFound, responseStatus.success, "Direksi Tidak Tersedia")

        let direksiUpdate

        if(!file) {
            exDireksi.nm_direksi = request.nm_direksi
            exDireksi.jbtn_direksi = request.jbtn_direksi
            exDireksi.hp_direksi = request.hp_direksi
            exDireksi.no_ktp_direksi = request.no_ktp_direksi
            exDireksi.is_ktp_selamanya = request.is_ktp_selamanya === "true" ? true : false
            exDireksi.ktp_berlaku_awal = request.ktp_berlaku_awal ? moment.utc(request.ktp_berlaku_awal, "YYYY-MM-DD").toDate() : undefined
            exDireksi.ktp_berlaku_akhir =request.ktp_berlaku_akhir ?  moment.utc(request.ktp_berlaku_akhir, "YYYY-MM-DD").toDate() : undefined
            await exDireksi.save()

            direksiUpdate = {
                nm_direksi : request.nm_direksi,
                jbtn_direksi :  request.jbtn_direksi,
                hp_direksi :  request.hp_direksi,
                no_ktp_direksi :  request.no_ktp_direksi,
                is_ktp_selamanya : request.is_ktp_selamanya === "true" ? true : false,
                ktp_berlaku_awal : request.ktp_berlaku_awal,
                ktp_berlaku_akhir : request.ktp_berlaku_akhir,
            }
        }

        else {
            await deleteFile(exDireksi.path_ktp_direksi as string)

            const formData = new FormData()

            formData.append('nama_aplikasi','SI-DaPeT')
            formData.append('file', fs.createReadStream(file.path))
    
            const upload = await uploadPdf(formData)
    
            console.log(upload)

            if(upload[1] !== null || !upload[0]){
                throw new CustomError(httpCode.badRequest, responseStatus.error, "Upload Gagal")
            }

            let direksiUpd = await DireksiPerusahaan.update({
                nm_direksi : request.nm_direksi,
                jbtn_direksi : request.jbtn_direksi,
                hp_direksi : request.hp_direksi,
                no_ktp_direksi : request.no_ktp_direksi,
                is_ktp_selamanya : request.is_ktp_selamanya === "true" ? true : false,
                ktp_berlaku_awal :request.ktp_berlaku_awal ?  moment.utc(request.ktp_berlaku_awal, "YYYY-MM-DD").toDate() : undefined,
                ktp_berlaku_akhir : request.ktp_berlaku_akhir ? moment.utc(request.ktp_berlaku_akhir, "YYYY-MM-DD").toDate() : undefined,
                path_ktp_direksi : upload[0].file_name,
                encrypt_key : upload[0].keypass
            },{
                where : {
                    kode_direksi_perus : id
                },
                returning : true,
            })

            console.log(direksiUpd)

            if(direksiUpd[0] === 0) throw new CustomError(httpCode.unprocessableEntity,responseStatus.error,"Gagal Update Komisaris")

                direksiUpdate = {
                    nm_direksi : direksiUpd[1][0].nm_direksi,
                    jbtn_direksi :direksiUpd[1][0].jbtn_direksi,
                    hp_direksi : direksiUpd[1][0].hp_direksi,
                    no_ktp_direksi  :direksiUpd[1][0].no_ktp_direksi,
                    is_ktp_selamanya : direksiUpd[1][0].is_ktp_selamanya,
                    ktp_berlaku_awal : direksiUpd[1][0].ktp_berlaku_awal,
                    ktp_berlaku_akhir : direksiUpd[1][0].ktp_berlaku_akhir,
                    path_ktp_direksi :direksiUpd[1][0].path_ktp_direksi,
                }
        }

        return direksiUpdate
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



/* **************** IZIN USAHA ***************************************** */
const getIjinUsaha = async (kode_vendor:number) : Promise<IjinUsahaPerusahaan[]> => {
    try {
        const getIjinUsaha : IjinUsahaPerusahaan[] = await IjinUsahaPerusahaan.findAll({
            where : {
                kode_vendor : kode_vendor
            },
            attributes : {exclude : ["encrypt_key"]}
        })

        return getIjinUsaha
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

const storeIjinUsaha = async (request:PayloadIjinUsaha["body"], kode_vendor : number, file : Express.Multer.File) : Promise<any> => {
    try {
        const formData = new FormData()

        formData.append('nama_aplikasi','SI-DaPeT')
        formData.append('file', fs.createReadStream(file.path))

        const upload = await uploadPdf(formData)


        if(upload[1] !== null || !upload[0]){
            throw new CustomError(httpCode.badRequest, responseStatus.error, "Upload Gagal")
        }

        const create = await IjinUsahaPerusahaan.create({
            kode_vendor : kode_vendor,
            nama : request.nama,
            jenis_izin_usaha : request.jenis_izin_usaha,
            nomor_izin : request.nomor_izin,
            kode : request.kode,
            judul : request.judul, 
            is_izin_selamanya : request.is_izin_selamanya === "true" ? true : false, 
            izin_berlaku_awal : moment.utc(request.izin_berlaku_awal, "YYYY-MM-DD").toDate(),
            izin_berlaku_akhir : moment.utc(request.izin_berlaku_akhir, "YYYY-MM-DD").toDate(),
            file_izin : upload[0].file_name,
            encrypt_key : upload[0].keypass 
        })

        const result = {
            kode_vendor : kode_vendor,
            nama : request.nama,
            jenis_izin_usaha : request.jenis_izin_usaha,
            nomor_izin : request.nomor_izin,
            kode : request.kode,
            judul : request.judul, 
            is_izin_selamanya : request.is_izin_selamanya, 
            izin_berlaku_awal : request.izin_berlaku_awal,
            izin_berlaku_akhir : request.izin_berlaku_akhir,
            file_izin : upload[0].file_name,
        }

        if(!create) {
            await deleteFile(upload[0].file_name)
            throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Upload Gagal")
        }

        if(create) {
            fs.unlinkSync(file.path)
        }

        return result


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

const hapusIjinUsaha = async (id:ParameterSchema["params"]["id"]) : Promise<IjinUsahaPerusahaan> => {
    try {
        const exIjinUsaha = await IjinUsahaPerusahaan.findOne({
            where : {
                kode_izin_usaha : id
            },
            attributes : {exclude : ["encrypt_key"]}
        })

        if(!exIjinUsaha) throw new CustomError(httpCode.notFound, responseStatus.success, "Data Ijin Usaha Tidak Ada")
            

        const hapusFile = await deleteFile(exIjinUsaha.file_izin as string)

        if(hapusFile[1] !== null) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Gagal Hapus File")

        const hapusData = await IjinUsahaPerusahaan.destroy({
            where : {
                kode_izin_usaha : id
            }
        })

        if(hapusData === 0 ) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Gagal Hapus Data")

        return exIjinUsaha
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

const getPdfUploadIjinUsaha = async (id:ParameterSchema["params"]["id"], kode_vendor:number) : Promise<any> => {
    try {
        const getIjinUsaha = await IjinUsahaPerusahaan.findOne({
            where : {
                kode_vendor : kode_vendor,
                kode_izin_usaha : id,
                encrypt_key : {
                    [Op.not] : null
                }
            }
        })


        if(!getIjinUsaha) throw new CustomError(httpCode.notFound, responseStatus.error, "Data Tidak Tersedia / Data Bukan Format PDF")

        const data = {
            nama_file : getIjinUsaha.file_izin as string, 
            keypass : getIjinUsaha.encrypt_key as string
        }


        const tampilGambar = await showFile(data)

        return tampilGambar[0]

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

const updateIjinUsaha = async (id:PayloadUpdateDireksiSchema["params"]["id"], 
    request:PayloadIjinUsahaUpdateSchema["body"],
     file : Express.Multer.File) : Promise<any> => {
    try {
        const exIjinUsaha = await IjinUsahaPerusahaan.findByPk(id)

        if(!exIjinUsaha) throw new CustomError(httpCode.notFound, responseStatus.success, "Ijin Usaha Tidak Tersedia")

        let izin_usaha

        if(!file) {
           exIjinUsaha.nama               = request.nama,
           exIjinUsaha.jenis_izin_usaha   = request.jenis_izin_usaha,
           exIjinUsaha.nomor_izin         = request.nomor_izin,
           exIjinUsaha.kode               = request.kode,
           exIjinUsaha.judul              = request.judul,
           exIjinUsaha.is_izin_selamanya  = request.is_izin_selamanya === "true" ? true : false,
           exIjinUsaha.izin_berlaku_awal = request.izin_berlaku_awal ? moment.utc(request.izin_berlaku_awal, "YYYY-MM-DD").toDate() : undefined,
           exIjinUsaha.izin_berlaku_akhir  = request.izin_berlaku_akhir ? moment.utc(request.izin_berlaku_akhir, "YYYY-MM-DD").toDate() : undefined,


            await exIjinUsaha.save()

            izin_usaha = {
                nama               : request.nama,
                jenis_izin_usaha   : request.jenis_izin_usaha,
                nomor_izin         : request.nomor_izin,
                kode               : request.kode,
                judul              : request.judul,
                is_izin_selamanya  : request.is_izin_selamanya,
                izin_berlaku_awal  : request.izin_berlaku_awal,
                izin_berlaku_akhir : request.izin_berlaku_akhir,
            }
        }

        else {
            await deleteFile(exIjinUsaha.file_izin as string)

            const formData = new FormData()

            formData.append('nama_aplikasi','SI-DaPeT')
            formData.append('file', fs.createReadStream(file.path))
    
            const upload = await uploadPdf(formData)
    
            console.log(upload)

            if(upload[1] !== null || !upload[0]){
                throw new CustomError(httpCode.badRequest, responseStatus.error, "Upload Gagal")
            }

            let ijinUsahaUpd = await IjinUsahaPerusahaan.update({
                nama               : request.nama,
                jenis_izin_usaha   : request.jenis_izin_usaha,
                nomor_izin         : request.nomor_izin,
                kode               : request.kode,
                judul              : request.judul,
                is_izin_selamanya  : request.is_izin_selamanya === "true" ? true : false,
                izin_berlaku_awal  : request.izin_berlaku_awal ? moment.utc(request.izin_berlaku_awal, "YYYY-MM-DD").toDate() : undefined,
                izin_berlaku_akhir : request.izin_berlaku_akhir ? moment.utc(request.izin_berlaku_akhir, "YYYY-MM-DD").toDate() : undefined,
                file_izin        : upload[0].file_name,
                encrypt_key      : upload[0].keypass
            },{
                where : {
                    kode_izin_usaha : id
                },
                returning : true,
            })


            if(ijinUsahaUpd[0] === 0) throw new CustomError(httpCode.unprocessableEntity,responseStatus.error,"Gagal Update Ijin Usaha")

                izin_usaha = {
                    nama              : ijinUsahaUpd[1][0].nama,
                    jenis_izin_usaha  : ijinUsahaUpd[1][0].jenis_izin_usaha,
                    nomor_izin        : ijinUsahaUpd[1][0].nomor_izin,
                    kode              : ijinUsahaUpd[1][0].kode,
                    judul             : ijinUsahaUpd[1][0].judul,
                    is_izin_selamanya : ijinUsahaUpd[1][0].is_izin_selamanya,
                    izin_berlaku_awal : ijinUsahaUpd[1][0].izin_berlaku_awal,
                    izin_berlaku_akhir: ijinUsahaUpd[1][0].izin_berlaku_akhir,
                    file_izin         : ijinUsahaUpd[1][0].file_izin,
                }
        }

        return izin_usaha
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



/* ***************** KEPEMILIKAN USAHA ********************************** */
const getSahamPerusahaan = async (kode_vendor:number) : Promise<SahamPerusahaan[]> => {
    try {
        const getSahamPerusahaan : SahamPerusahaan[] = await SahamPerusahaan.findAll({
            where : {
                kode_vendor : kode_vendor
            },
            attributes : {exclude : ["encrypt_key"]}
        })

        return getSahamPerusahaan
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

const storeSahamPerusahaan = async (request:PayloadSahamPerusahaanSchema["body"], kode_vendor : number, file : Express.Multer.File) : Promise<any> => {
    try {
        const formData = new FormData()

        formData.append('nama_aplikasi','SI-DaPeT')
        formData.append('file', fs.createReadStream(file.path))

        const upload = await uploadPdf(formData)


        if(upload[1] !== null || !upload[0]){
            throw new CustomError(httpCode.badRequest, responseStatus.error, "Upload Gagal")
        }

        const create = await SahamPerusahaan.create({
            kode_vendor : kode_vendor,
            nm_saham : request.nm_saham,
            no_ktp_saham : request.no_ktp_saham,
            alamat_saham : request.alamat_saham,
            persentase_saham : request.persentase_saham,
            is_saham_selamanya : request.is_saham_selamanya === "true" ? true : false,
            saham_berlaku_awal : request.saham_berlaku_awal ? moment.utc(request.saham_berlaku_awal, "YYYY-MM-DD").toDate() : undefined,
            saham_berlaku_akhir : request.saham_berlaku_akhir ? moment.utc(request.saham_berlaku_akhir, "YYYY-MM-DD").toDate() : undefined,
            path_saham : upload[0].file_name,
            encrypt_key : upload[0].keypass 
        })

        const result = {
            kode_vendor : kode_vendor,
            nm_saham : request.nm_saham,
            no_ktp_saham : request.no_ktp_saham,
            alamat_saham : request.alamat_saham,
            persentase_saham : request.persentase_saham,
            is_saham_selamanya : request.is_saham_selamanya,
            saham_berlaku_awal : request.saham_berlaku_awal,
            saham_berlaku_akhir : request.saham_berlaku_akhir,
            path_saham : upload[0].file_name,
        }

        if(!create) {
            await deleteFile(upload[0].file_name)
            throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Upload Gagal")
        }

        if(create) {
            fs.unlinkSync(file.path)
        }

        return result


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

const hapusSahamPerusahaan = async (id:ParameterSchema["params"]["id"]) : Promise<SahamPerusahaan> => {
    try {
        const exSahamPerusahaan = await SahamPerusahaan.findOne({
            where : {
                kode_saham : id
            },
            attributes : {exclude : ["encrypt_key"]}
        })

        if(!exSahamPerusahaan) throw new CustomError(httpCode.notFound, responseStatus.success, "Data Saham Perusahaan Tidak Ada")
            

        const hapusFile = await deleteFile(exSahamPerusahaan.path_saham as string)

        if(hapusFile[1] !== null) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Gagal Hapus File")

        const hapusData = await SahamPerusahaan.destroy({
            where : {
                kode_saham : id
            }
        })

        if(hapusData === 0 ) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Gagal Hapus Data")

        return exSahamPerusahaan
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

const getPdfUploadSahamPerusahaan = async (id:ParameterSchema["params"]["id"], kode_vendor:number) : Promise<any> => {
    try {
        const getSahamPerusahaan = await SahamPerusahaan.findOne({
            where : {
                kode_vendor : kode_vendor,
                kode_saham : id,
                encrypt_key : {
                    [Op.not] : null
                }
            }
        })


        if(!getSahamPerusahaan) throw new CustomError(httpCode.notFound, responseStatus.error, "Data Tidak Tersedia / Data Bukan Format PDF")

        const data = {
            nama_file : getSahamPerusahaan?.path_saham as string, 
            keypass : getSahamPerusahaan.encrypt_key as string
        }


        const tampilGambar = await showFile(data)

        return tampilGambar[0]

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

const updateSahamPerusahaan = async (id:PayloadSahamPerusahaanUpdateSchema["params"]["id"], 
    request:PayloadSahamPerusahaanUpdateSchema["body"],
     file : Express.Multer.File) : Promise<any> => {
    try {
        const exSahamPerusahaan = await SahamPerusahaan.findByPk(id)

        if(!exSahamPerusahaan) throw new CustomError(httpCode.notFound, responseStatus.success, "Saham Perusahaan Tidak Tersedia")

        let sahamPerusahaan

        if(!file) {
           exSahamPerusahaan.nm_saham         = request.nm_saham,
           exSahamPerusahaan.no_ktp_saham     = request.no_ktp_saham,
           exSahamPerusahaan.alamat_saham     = request.alamat_saham,
           exSahamPerusahaan.persentase_saham = request.persentase_saham,
           exSahamPerusahaan.is_saham_selamanya = request.is_saham_selamanya === "true" ? true : false,
           exSahamPerusahaan.saham_berlaku_awal = request.saham_berlaku_awal ? moment.utc(request.saham_berlaku_awal, "YYYY-MM-DD").toDate() : undefined,
           exSahamPerusahaan.saham_berlaku_akhir = request.saham_berlaku_akhir ? moment.utc(request.saham_berlaku_akhir, "YYYY-MM-DD").toDate() : undefined,

            await exSahamPerusahaan.save()

            sahamPerusahaan = {
                nm_saham        : request.nm_saham,
                no_ktp_saham    : request.no_ktp_saham,
                alamat_saham    : request.alamat_saham,
                persentase_saham: request.persentase_saham,
                is_saham_selamanya : request.is_saham_selamanya,
                saham_berlaku_awal : request.saham_berlaku_awal,
                saham_berlaku_akhir : request.saham_berlaku_akhir,
            }
        }

        else {
            await deleteFile(exSahamPerusahaan.path_saham as string)

            const formData = new FormData()

            formData.append('nama_aplikasi','SI-DaPeT')
            formData.append('file', fs.createReadStream(file.path))
    
            const upload : any = await uploadPdf(formData)
    
            console.log(upload)

            if(upload[1] !== null || !upload[0]){
                throw new CustomError(httpCode.badRequest, responseStatus.error, "Upload Gagal")
            }

            let sahamPerusahaanUpd = await SahamPerusahaan.update({
                nm_saham           : request.nm_saham,
                no_ktp_saham       : request.no_ktp_saham,
                alamat_saham       : request.alamat_saham,
                persentase_saham   : request.persentase_saham,
                is_saham_selamanya : request.is_saham_selamanya === "true" ? true                                                : false,
                saham_berlaku_awal : request.saham_berlaku_awal ? moment.utc(request.saham_berlaku_awal, "YYYY-MM-DD").toDate()  : undefined,
                saham_berlaku_akhir: request.saham_berlaku_akhir ? moment.utc(request.saham_berlaku_akhir, "YYYY-MM-DD").toDate(): undefined,
                path_saham         : upload[0].file_name,
                encrypt_key        : upload[0].keypass
            },{
                where : {
                    kode_saham : id
                },
                returning : true,
            })

            console.log(sahamPerusahaanUpd)

            if(sahamPerusahaanUpd[0] === 0) throw new CustomError(httpCode.unprocessableEntity,responseStatus.error,"Gagal Update Saham")

                sahamPerusahaan = {
                    nm_saham        : sahamPerusahaanUpd[1][0].nm_saham,
                    no_ktp_saham    : sahamPerusahaanUpd[1][0].no_ktp_saham,
                    alamat_saham    : sahamPerusahaanUpd[1][0].alamat_saham,
                    persentase_saham: sahamPerusahaanUpd[1][0].persentase_saham,
                    path_saham      : sahamPerusahaanUpd[1][0].path_saham,
                    is_saham_selamanya : sahamPerusahaanUpd[1][0].is_saham_selamanya,
                    saham_berlaku_awal : sahamPerusahaanUpd[1][0].saham_berlaku_awal,
                    saham_berlaku_akhir : sahamPerusahaanUpd[1][0].saham_berlaku_akhir,
                }
        }

        return sahamPerusahaan
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


// ***************** DATA PERSONALIA ************************************* */
const getPersonalia = async (kode_vendor:number) : Promise<PersonaliaPerusahaan[]> => {
    try {
        const getPersonalia : PersonaliaPerusahaan[] = await PersonaliaPerusahaan.findAll({
            where : {
                kode_vendor : kode_vendor
            },
            attributes : {exclude : ["encrypt_key"]}
        })

        return getPersonalia
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

const storePersonalia = async (request:PayloadPersonaliaSchema["body"], kode_vendor : number, file : Express.Multer.File) : Promise<any> => {
    try {
        const formData = new FormData()

        formData.append('nama_aplikasi','SI-DaPeT')
        formData.append('file', fs.createReadStream(file.path))

        const upload = await uploadPdf(formData)


        if(upload[1] !== null || !upload[0]){
            throw new CustomError(httpCode.badRequest, responseStatus.error, "Upload Gagal")
        }

        const create = await PersonaliaPerusahaan.create({
            kode_vendor : kode_vendor,
            nm_personal : request.nm_personal,
            tgl_personal : request.tgl_personal,
            pendidikan_personal : request.pendidikan_personal,
            jbtn_personal : request.jbtn_personal,
            pengalaman_personal : request.pengalaman_personal,
            keahlian_personal : request.keahlian_personal,
            sertif_personal : request.sertif_personal,
            path_personal : upload[0].file_name,
            encrypt_key : upload[0].keypass 
        })

        const result = {
            kode_vendor : kode_vendor,
            nm_personal : request.nm_personal,
            tgl_personal : request.tgl_personal,
            pendidikan_personal : request.pendidikan_personal,
            jbtn_personal : request.jbtn_personal,
            pengalaman_personal : request.pengalaman_personal,
            keahlian_personal : request.keahlian_personal,
            sertif_personal : request.sertif_personal,
            path_personal : upload[0].file_name,
        }

        if(!create) {
            await deleteFile(upload[0].file_name)
            throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Upload Gagal")
        }

        if(create) {
            fs.unlinkSync(file.path)
        }

        return result


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

const hapusPersonalia = async (id:ParameterSchema["params"]["id"]) : Promise<PersonaliaPerusahaan> => {
    try {
        const exPersonalia = await PersonaliaPerusahaan.findOne({
            where : {
                kode_personalia : id
            },
            attributes : {exclude : ["encrypt_key"]}
        })

        if(!exPersonalia) throw new CustomError(httpCode.notFound, responseStatus.success, "Data Personalia Perusahaan Tidak Ada")
            

        const hapusFile = await deleteFile(exPersonalia.path_personal as string)

        if(hapusFile[1] !== null) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Gagal Hapus File")

        const hapusData = await PersonaliaPerusahaan.destroy({
            where : {
                kode_personalia : id
            }
        })

        if(hapusData === 0 ) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Gagal Hapus Data")

        return exPersonalia
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

const getPdfUploadPersonalia = async (id:ParameterSchema["params"]["id"], kode_vendor:number) : Promise<any> => {
    try {
        const getPersonalia = await PersonaliaPerusahaan.findOne({
            where : {
                kode_vendor : kode_vendor,
                kode_personalia : id,
                encrypt_key : {
                    [Op.not] : null
                }
            }
        })


        if(!getPersonalia) throw new CustomError(httpCode.notFound, responseStatus.error, "Data Tidak Tersedia / Data Bukan Format PDF")

        const data = {
            nama_file : getPersonalia?.path_personal as string, 
            keypass : getPersonalia.encrypt_key as string
        }


        const tampilGambar = await showFile(data)

        return tampilGambar[0]

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

const updatePersonalia = async (id:PayloadPersonaliaUpdateSchema["params"]["id"], 
    request:PayloadPersonaliaUpdateSchema["body"],
     file : Express.Multer.File) : Promise<any> => {
    try {
        const exPersonalia = await PersonaliaPerusahaan.findByPk(id)

        if(!exPersonalia) throw new CustomError(httpCode.notFound, responseStatus.success, "Personalia Tidak Tersedia")

        let personalia

        if(!file) {
           exPersonalia.nm_personal         = request.nm_personal,
           exPersonalia.tgl_personal        = request.tgl_personal,
           exPersonalia.pendidikan_personal = request.pendidikan_personal,
           exPersonalia.jbtn_personal       = request.jbtn_personal,
           exPersonalia.pengalaman_personal = request.pengalaman_personal,
           exPersonalia.keahlian_personal   = request.keahlian_personal,
           exPersonalia.sertif_personal     = request.sertif_personal

            await exPersonalia.save()

            personalia = {
                nm_personal        : request.nm_personal,
                tgl_personal       : request.tgl_personal,
                pendidikan_personal: request.pendidikan_personal,
                jbtn_personal      : request.jbtn_personal,
                pengalaman_personal: request.pengalaman_personal,
                keahlian_personal  : request.keahlian_personal,
                sertif_personal    : request.sertif_personal
            }
        }

        else {
            await deleteFile(exPersonalia.path_personal as string)

            const formData = new FormData()

            formData.append('nama_aplikasi','SI-DaPeT')
            formData.append('file', fs.createReadStream(file.path))
    
            const upload : any = await uploadPdf(formData)
    
            console.log(upload)

            if(upload[1] !== null || !upload[0]){
                throw new CustomError(httpCode.badRequest, responseStatus.error, "Upload Gagal")
            }

            let personaliaUpd = await PersonaliaPerusahaan.update({
                nm_personal        : request.nm_personal,
                tgl_personal       : request.tgl_personal,
                pendidikan_personal: request.pendidikan_personal,
                jbtn_personal      : request.jbtn_personal,
                pengalaman_personal: request.pengalaman_personal,
                keahlian_personal  : request.keahlian_personal,
                sertif_personal    : request.sertif_personal,
                path_personal      : upload[0].file_name,
                encrypt_key     : upload[0].keypass
            },{
                where : {
                    kode_personalia : id
                },
                returning : true,
            })

            console.log(personaliaUpd)

            if(personaliaUpd[0] === 0) throw new CustomError(httpCode.unprocessableEntity,responseStatus.error,"Gagal Update Personalia")

                personalia = {
                    nm_personal :personaliaUpd[1][0].nm_personal,
                    tgl_personal :personaliaUpd[1][0].tgl_personal,
                    pendidikan_personal :personaliaUpd[1][0].pendidikan_personal,
                    jbtn_personal :personaliaUpd[1][0].jbtn_personal,
                    pengalaman_personal :personaliaUpd[1][0].pengalaman_personal,
                    keahlian_personal :personaliaUpd[1][0].keahlian_personal,
                    sertif_personal :personaliaUpd[1][0].sertif_personal,
                    path_personal :personaliaUpd[1][0].path_personal,
                }
        }

        return personalia
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

// ***************** FASILITAS *****************************************   */
const getFasilitas = async (kode_vendor:number) : Promise<FasilitasPerusahaan[]> => {
    try {
        const getFasilitas : FasilitasPerusahaan[] = await FasilitasPerusahaan.findAll({
            where : {
                kode_vendor : kode_vendor
            },
            attributes : {exclude : ["encrypt_key_kepemilikan", "encrypt_key_foto"]}
        })

        return getFasilitas
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

const storeFasilitas = async (request:PayloadFasilitasSchema["body"], kode_vendor : number, file_bukti_kepemilikan : Express.Multer.File, file_foto : Express.Multer.File) : Promise<any> => {
    try {
        const formData = new FormData()

        formData.append('nama_aplikasi','SI-DaPeT')
        formData.append('file1', fs.createReadStream(file_bukti_kepemilikan.path))
        formData.append('file2', fs.createReadStream(file_foto.path))

        const upload = await uploadPdfMany(formData)

        console.log(file_bukti_kepemilikan);
        


        if(upload[1] !== null || !upload[0]){
            throw new CustomError(httpCode.badRequest, responseStatus.error, "Upload Gagal")
        }

        const create = await FasilitasPerusahaan.create({
            kode_vendor : kode_vendor,
            nama : request.nama,
            jumlah : request.jumlah,
            kondisi : request.kondisi,
            kode_kepemilikan : parseInt(request.kode_kepemilikan),
            is_kepemilikan_selamanya : request.is_kepemilikan_selamanya === "true" ? true : false,
            kepemilikan_berlaku_awal : request.kepemilikan_berlaku_awal ? moment.utc(request.kepemilikan_berlaku_awal, "YYYY-MM-DD").toDate() : undefined,
            kepemilikan_berlaku_akhir : request.kepemilikan_berlaku_akhir ? moment.utc(request.kepemilikan_berlaku_akhir, "YYYY-MM-DD").toDate() : undefined,
            is_foto_selamanya : request.is_foto_selamanya === "true" ? true : false,
            foto_berlaku_awal : request.foto_berlaku_awal ? moment.utc(request.foto_berlaku_awal, "YYYY-MM-DD").toDate() : undefined,
            foto_berlaku_akhir : request.foto_berlaku_akhir ? moment.utc(request.foto_berlaku_akhir, "YYYY-MM-DD").toDate() : undefined,
            file_kepemilikan : upload[0][0].file_name,
            encrypt_key_kepemilikan : upload[0][0].keypass,
            file_foto : upload[0][1].file_name,
            encrypt_key_foto : upload[0][1].keypass 
        })

        const result = {
            kode_vendor : kode_vendor,
            nama : request.nama,
            jumlah : request.jumlah,
            kondisi : request.kondisi,
            kode_kepemilikan : request.kode_kepemilikan,
            is_kepemilikan_selamanya : request.is_kepemilikan_selamanya,
            kepemilikan_berlaku_awal : request.kepemilikan_berlaku_awal,
            kepemilikan_berlaku_akhir : request.kepemilikan_berlaku_akhir,
            is_foto_selamanya : request.is_foto_selamanya,
            foto_berlaku_awal : request.foto_berlaku_awal,
            foto_berlaku_akhir : request.foto_berlaku_akhir,
            file_kepemilikan : upload[0][0].file_name,
            file_foto : upload[0][1].file_name,
        }

        if(!create) {
            await deleteFile(upload[0][0].file_name)
            await deleteFile(upload[0][1].file_name)
            throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Store Data Gagal")
        }

        if(create) {
            fs.unlinkSync(file_bukti_kepemilikan.path)
            fs.unlinkSync(file_foto.path)
        }

        return result


    } catch (error) {
        debugLogger.debug(error)
        fs.unlinkSync(file_bukti_kepemilikan.path)
        fs.unlinkSync(file_foto.path)
        if(error instanceof CustomError) {
            throw new CustomError(error.code,error.status, error.message)
        } 
        else {
            debugLogger.debug(error)
            throw new CustomError(500, responseStatus.error, "Internal server error.")
        }
    }
}

const hapusFasilitas = async (id:ParameterSchema["params"]["id"]) : Promise<FasilitasPerusahaan> => {
    try {
        const exFasilitas = await FasilitasPerusahaan.findOne({
            where : {
                kode_fasilitas_usaha : id
            },
            attributes : {exclude : ["encrypt_key"]}
        })

        if(!exFasilitas) throw new CustomError(httpCode.notFound, responseStatus.success, "Data Fasilitas Perusahaan Tidak Ada")

        if(exFasilitas.file_kepemilikan) {
            const hapusFile = await deleteFile(exFasilitas.file_kepemilikan as string)
            if(hapusFile[1] !== null) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Gagal Hapus File")
        }

        if(exFasilitas.file_foto) {
            const hapusFile = await deleteFile(exFasilitas.file_foto as string)
            if(hapusFile[1] !== null) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Gagal Hapus File")
        }

        const hapusData = await FasilitasPerusahaan.destroy({
            where : {
                kode_fasilitas_usaha : id
            }
        })

        if(hapusData === 0 ) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Gagal Hapus Data")

        return exFasilitas
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

const getPdfUploadFasilitasKepemilikan = async (id:ParameterSchema["params"]["id"], kode_vendor:number) : Promise<any> => {
    try {
        const getFasilitas = await FasilitasPerusahaan.findOne({
            where : {
                kode_vendor : kode_vendor,
                kode_fasilitas_usaha : id,
                // encrypt_key : {
                //     [Op.not] : null
                // }
            }
        })


        if(!getFasilitas) throw new CustomError(httpCode.notFound, responseStatus.error, "Data Tidak Tersedia / Data Bukan Format PDF")

        const data = {
            nama_file : getFasilitas?.file_kepemilikan as string, 
            keypass : getFasilitas?.encrypt_key_kepemilikan as string
        }


        const tampilGambar = await showFile(data)

        return tampilGambar[0]

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

const getPdfUploadFasilitasFoto = async (id:ParameterSchema["params"]["id"], kode_vendor:number) : Promise<any> => {
    try {
        const getFasilitas = await FasilitasPerusahaan.findOne({
            where : {
                kode_vendor : kode_vendor,
                kode_fasilitas_usaha : id,
                // encrypt_key : {
                //     [Op.not] : null
                // }
            }
        })


        if(!getFasilitas) throw new CustomError(httpCode.notFound, responseStatus.error, "Data Tidak Tersedia / Data Bukan Format PDF")

        const data = {
            nama_file : getFasilitas?.file_foto as string, 
            keypass : getFasilitas.encrypt_key_foto as string
        }


        const tampilGambar = await showFile(data)

        return tampilGambar[0]

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

const updateFasilitas = async (id:PayloadFasilitasUpdateSchema["params"]["id"], 
    request:PayloadFasilitasUpdateSchema["body"],
    file_bukti_kepemilikan : Express.Multer.File, 
    file_foto : Express.Multer.File) : Promise<any> => {
    try {
        const exFasilitas = await FasilitasPerusahaan.findByPk(id)

        if(!exFasilitas) throw new CustomError(httpCode.notFound, responseStatus.success, "Fasilitas Tidak Tersedia")

        let fasilitas

        if(!file_bukti_kepemilikan && !file_foto ) {
            exFasilitas.nama = request.nama,
            exFasilitas.jumlah = request.jumlah,
            exFasilitas.kondisi = request.kondisi,
            exFasilitas.kode_kepemilikan = parseInt(request.kode_kepemilikan),
            exFasilitas.is_kepemilikan_selamanya = request.is_kepemilikan_selamanya === "true" ? true : false,
            exFasilitas.kepemilikan_berlaku_awal = request.kepemilikan_berlaku_awal ? moment.utc(request.kepemilikan_berlaku_awal, "YYYY-MM-DD").toDate() : undefined,
            exFasilitas.kepemilikan_berlaku_akhir = request.kepemilikan_berlaku_akhir ? moment.utc(request.kepemilikan_berlaku_akhir, "YYYY-MM-DD").toDate() : undefined,
            exFasilitas.is_foto_selamanya = request.is_foto_selamanya === "true" ? true : false,
            exFasilitas.foto_berlaku_awal = request.foto_berlaku_awal ? moment.utc(request.foto_berlaku_awal, "YYYY-MM-DD").toDate() : undefined,
            exFasilitas.foto_berlaku_akhir = request.foto_berlaku_akhir ? moment.utc(request.foto_berlaku_akhir, "YYYY-MM-DD").toDate() : undefined,

            await exFasilitas.save()

            fasilitas = {
                nama : request.nama,
                jumlah : request.jumlah,
                kondisi : request.kondisi,
                kode_kepemilikan : request.kode_kepemilikan,
                is_kepemilikan_selamanya : request.is_kepemilikan_selamanya,
                kepemilikan_berlaku_awal : request.kepemilikan_berlaku_awal,
                kepemilikan_berlaku_akhir : request.kepemilikan_berlaku_akhir,
                is_foto_selamanya : request.is_foto_selamanya,
                foto_berlaku_awal : request.foto_berlaku_awal,
                foto_berlaku_akhir : request.foto_berlaku_akhir, 
            }
        }

        else {
            await deleteFile(exFasilitas.file_kepemilikan as string)
            await deleteFile(exFasilitas.file_foto as string)

            const formData = new FormData()

            formData.append('nama_aplikasi','SI-DaPeT')
            formData.append('file1', fs.createReadStream(file_bukti_kepemilikan.path))
            formData.append('file2', fs.createReadStream(file_foto.path))

    
            const upload : any = await uploadPdfMany(formData)
    

            if(upload[1] !== null || !upload[0]){
                throw new CustomError(httpCode.badRequest, responseStatus.error, "Upload Gagal")
            }

            let fasilitasUpd = await FasilitasPerusahaan.update({
                nama : request.nama,
                jumlah : request.jumlah,
                kondisi : request.kondisi,
                kode_kepemilikan : parseInt(request.kode_kepemilikan),
                is_kepemilikan_selamanya : request.is_kepemilikan_selamanya === "true" ? true : false,
                kepemilikan_berlaku_awal : request.kepemilikan_berlaku_awal ? moment.utc(request.kepemilikan_berlaku_awal, "YYYY-MM-DD").toDate() : undefined,
                kepemilikan_berlaku_akhir : request.kepemilikan_berlaku_akhir ? moment.utc(request.kepemilikan_berlaku_akhir, "YYYY-MM-DD").toDate() : undefined,
                is_foto_selamanya : request.is_foto_selamanya === "true" ? true : false,
                foto_berlaku_awal : request.foto_berlaku_awal ? moment.utc(request.foto_berlaku_awal, "YYYY-MM-DD").toDate() : undefined,
                foto_berlaku_akhir : request.foto_berlaku_akhir ? moment.utc(request.foto_berlaku_akhir, "YYYY-MM-DD").toDate() : undefined,
                file_kepemilikan : upload[0][0].file_name,
                encrypt_key_kepemilikan : upload[0][0].keypass,
                file_foto : upload[0][1].file_name,
                encrypt_key_foto : upload[0][1].keypass 
            },{
                where : {
                    kode_fasilitas_usaha : id
                },
                returning : true,
            })


            if(fasilitasUpd[0] === 0) throw new CustomError(httpCode.unprocessableEntity,responseStatus.error,"Gagal Update Fasilitas")

                fasilitas = {
                    nama : fasilitasUpd[1][0].nama,
                    jumlah : fasilitasUpd[1][0].jumlah,
                    kondisi : fasilitasUpd[1][0].kondisi,
                    kode_kepemilikan : fasilitasUpd[1][0].kode_kepemilikan,
                    is_kepemilikan_selamanya : fasilitasUpd[1][0].is_kepemilikan_selamanya,
                    kepemilikan_berlaku_awal : fasilitasUpd[1][0].kepemilikan_berlaku_awal,
                    kepemilikan_berlaku_akhir : fasilitasUpd[1][0].kepemilikan_berlaku_akhir,
                    is_foto_selamanya : fasilitasUpd[1][0].is_foto_selamanya,
                    foto_berlaku_awal : fasilitasUpd[1][0].foto_berlaku_awal,
                    foto_berlaku_akhir : fasilitasUpd[1][0].foto_berlaku_akhir,
                    file_kepemilikan : fasilitasUpd[1][0].file_kepemilikan,
                    file_foto : fasilitasUpd[1][0].file_foto,
                }
        }

        return fasilitas
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

//#################### Kantor ########################################
const getKantor = async (kode_vendor:number) : Promise<Kantor[]> => {
    try {
        const getKantor : Kantor[] = await Kantor.findAll({
            where : {
                kode_vendor : kode_vendor
            }, 
            attributes : {exclude : ["encrypt_key"]}
        })

        return getKantor
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

const storeKantor = async (request:PayloadKantorSchema["body"], kode_vendor : number, file : Express.Multer.File) : Promise<any> => {
    try {
        const formData = new FormData()

        formData.append('nama_aplikasi','SI-DaPeT')
        formData.append('file', fs.createReadStream(file.path))

        const upload = await uploadPdf(formData)


        if(upload[1] !== null || !upload[0]){
            throw new CustomError(httpCode.badRequest, responseStatus.error, "Upload Gagal")
        }

        const create = await Kantor.create({
            kode_vendor : kode_vendor,
            alamat : request.alamat,
            kode_kepemilikan : parseInt(request.kode_kepemilikan),
            is_foto_selamanya : request.is_foto_selamanya === "true" ? true : false,
            foto_berlaku_awal : request.foto_berlaku_awal ? moment.utc(request.foto_berlaku_awal, "YYYY-MM-DD").toDate() : undefined,
            foto_berlaku_akhir : request.foto_berlaku_akhir ? moment.utc(request.foto_berlaku_akhir, "YYYY-MM-DD").toDate() : undefined,
            file_foto : upload[0].file_name,
            encrypt_key : upload[0].keypass,

        })

        const result = {
            kode_vendor : kode_vendor,
            alamat : request.alamat,
            kode_kepemilikan : request.kode_kepemilikan,
            is_foto_selamanya : request.is_foto_selamanya,
            foto_berlaku_awal : request.foto_berlaku_awal,
            foto_berlaku_akhir : request.foto_berlaku_akhir,
            file_foto : upload[0].file_name,
        }

        if(!create) {
            await deleteFile(upload[0].file_name)
            throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Upload Gagal")
        }

        if(create) {
            fs.unlinkSync(file.path)
        }

        return result
    } catch (error) {
        fs.unlinkSync(file.path)
        debugLogger.debug(error)
        if(error instanceof CustomError) {
            throw new CustomError(error.code,error.status, error.message)
        } 
        else {
            debugLogger.debug(error)
            throw new CustomError(500, responseStatus.error, "Internal server error.")
        }
    }
}

const hapusKantor = async (id:ParameterSchema["params"]["id"]) : Promise<Kantor> => {
    try {
        const exKantor = await Kantor.findOne({
            where : {
                kode_kantor : id
            },
            attributes : {exclude : ["encrypt_key"]}
        })

        if(!exKantor) throw new CustomError(httpCode.notFound, responseStatus.success, "Data Saham Perusahaan Tidak Ada")
            

        const hapusFile = await deleteFile(exKantor.file_foto as string)

        if(hapusFile[1] !== null) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Gagal Hapus File")

        const hapusData = await Kantor.destroy({
            where : {
                kode_kantor : id
            }
        })

        if(hapusData === 0 ) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Gagal Hapus Data")

        return exKantor
    } catch (error) {
        debugLogger.debug(error)
        if(error instanceof CustomError) {
            throw new CustomError(error.code,error.status, error.message)
        } 
        else {
            debugLogger.debug(error)
            throw new CustomError(500, responseStatus.error, "Internal server error.")
        }
    }
}

const getPdfUploadKantor = async (id:ParameterSchema["params"]["id"], kode_vendor:number) : Promise<any> => {
    try {
        const getKantor = await Kantor.findOne({
            where : {
                kode_vendor : kode_vendor,
                kode_kantor : id,
                encrypt_key : {
                    [Op.not] : null
                }
            }
        })


        if(!getKantor) throw new CustomError(httpCode.notFound, responseStatus.error, "Data Tidak Tersedia / Data Bukan Format PDF")

        const data = {
            nama_file : getKantor?.file_foto as string, 
            keypass : getKantor.encrypt_key as string
        }


        const tampilGambar = await showFile(data)

        return tampilGambar[0]

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

const updateKantor = async (id:PayloadKantorUpdateSchema["params"]["id"], 
    request:PayloadKantorUpdateSchema["body"],
     file : Express.Multer.File) : Promise<any> => {
    try {
        const exKantor = await Kantor.findByPk(id)

        if(!exKantor) throw new CustomError(httpCode.notFound, responseStatus.success, "Saham Perusahaan Tidak Tersedia")

        let kantor

        if(!file) {
            exKantor.alamat = request.alamat,
            exKantor.kode_kepemilikan = parseInt(request.kode_kepemilikan),
            exKantor.is_foto_selamanya = request.is_foto_selamanya === "true" ? true : false,
            exKantor.foto_berlaku_awal = request.foto_berlaku_awal ? moment.utc(request.foto_berlaku_awal, "YYYY-MM-DD").toDate() : undefined,
            exKantor.foto_berlaku_akhir = request.foto_berlaku_akhir ? moment.utc(request.foto_berlaku_akhir, "YYYY-MM-DD").toDate() : undefined,


            await exKantor.save()

            kantor = {
                alamat : request.alamat,
                kode_kepemilikan : request.kode_kepemilikan,
                is_foto_selamanya : request.is_foto_selamanya,
                foto_berlaku_awal : request.foto_berlaku_awal,
                foto_berlaku_akhir : request.foto_berlaku_akhir,
            }
        }

        else {
            await deleteFile(exKantor.file_foto as string)

            const formData = new FormData()

            formData.append('nama_aplikasi','SI-DaPeT')
            formData.append('file', fs.createReadStream(file.path))
    
            const upload : any = await uploadPdf(formData)
    
            console.log(upload)

            if(upload[1] !== null || !upload[0]){
                throw new CustomError(httpCode.badRequest, responseStatus.error, "Upload Gagal")
            }

            let kantorUpd = await Kantor.update({
                alamat : request.alamat,
                kode_kepemilikan : parseInt(request.kode_kepemilikan),
                is_foto_selamanya : request.is_foto_selamanya === "true" ? true : false,
                foto_berlaku_awal : request.foto_berlaku_awal ? moment.utc(request.foto_berlaku_awal, "YYYY-MM-DD").toDate() : undefined,
                foto_berlaku_akhir : request.foto_berlaku_akhir ? moment.utc(request.foto_berlaku_akhir, "YYYY-MM-DD").toDate() : undefined,
                file_foto         : upload[0].file_name,
                encrypt_key        : upload[0].keypass
            },{
                where : {
                    kode_kantor : id
                },
                returning : true,
            })

            if(kantorUpd[0] === 0) throw new CustomError(httpCode.unprocessableEntity,responseStatus.error,"Gagal Update Saham")

                kantor = {
                    alamat : kantorUpd[1][0].alamat,
                    kode_kepemilikan : kantorUpd[1][0].kode_kepemilikan,
                    is_foto_selamanya : kantorUpd[1][0].is_foto_selamanya,
                    foto_berlaku_awal : kantorUpd[1][0].foto_berlaku_awal,
                    foto_berlaku_akhir : kantorUpd[1][0].foto_berlaku_akhir,
                    file_foto : kantorUpd[1][0].file_foto,
                }
        }

        return kantor
    } catch (error) {
        console.log(error)
        debugLogger.debug(error)
        if(error instanceof CustomError) {
            throw new CustomError(error.code,error.status, error.message)
        } 
        else {
            debugLogger.debug(error)
            throw new CustomError(500, responseStatus.error, "Internal server error.")
        }
    }
}


//#####################################################################




//#################### Pengalaman #####################################
const getPengalaman = async (kode_vendor:number) : Promise<Pengalaman[]> => {
    try {
        const getPengalaman : Pengalaman[] = await Pengalaman.findAll({
            where : {
                kode_vendor : kode_vendor
            },
            attributes : {exclude : ["encrypt_key"]}
        })

        return getPengalaman
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

const storePengalaman = async (request:PayloadPengalamanSchema["body"], kode_vendor : number, file_kontrak : Express.Multer.File, file_bast : Express.Multer.File) : Promise<any> => {
    try {        

        const formData = new FormData()

        formData.append('nama_aplikasi','SI-DaPeT')
        formData.append('file1', fs.createReadStream(file_kontrak.path))
        formData.append('file2', fs.createReadStream(file_bast.path))
        

        const upload = await uploadPdfMany(formData)



        if(upload[1] !== null || !upload[0]){
            throw new CustomError(httpCode.badRequest, responseStatus.error, "Upload Gagal")
        }

        const create = await Pengalaman.create({
            kode_vendor : kode_vendor,
            nama_pekerjaan : request.nama_pekerjaan,
            tahun_pekerjaan : parseInt(request.tahun_pekerjaan),
            pemberi_kerja : request.pemberi_kerja,
            nilai_pekerjaan : parseInt(request.nilai_pekerjaan),
            jangka_waktu : request.jangka_waktu,
            no_kontrak : request.no_kontrak,
            is_kontrak_selamanya : request.is_kontrak_selamanya === "true" ? true : false,
            kontrak_berlaku_awal : request.kontrak_berlaku_awal ? moment.utc(request.kontrak_berlaku_awal, "YYYY-MM-DD").toDate() : undefined,
            kontrak_berlaku_akhir : request.kontrak_berlaku_akhir ? moment.utc(request.kontrak_berlaku_akhir, "YYYY-MM-DD").toDate() : undefined,
            is_bast_selamanya : request.is_bast_selamanya === "true" ? true : false,
            bast_berlaku_awal : request.bast_berlaku_awal ? moment.utc( request.bast_berlaku_awal, "YYYY-MM-DD").toDate() : undefined,
            bast_berlaku_akhir : request.bast_berlaku_akhir ? moment.utc( request.bast_berlaku_akhir, "YYYY-MM-DD").toDate() : undefined,
            file_kontrak : upload[0][0].file_name,
            encrypt_key_kontrak : upload[0][0].keypass ,
            file_bast : upload[0][1].file_name,
            encrypt_key_bast : upload[0][1].keypass
        })

        const result = {
            nama_pekerjaan : request.nama_pekerjaan,
            tahun_pekerjaan : request.tahun_pekerjaan,
            pemberi_kerja : request.pemberi_kerja,
            nilai_pekerjaan : request.nilai_pekerjaan,
            jangka_waktu : request.jangka_waktu,
            no_kontrak : request.no_kontrak,
            is_kontrak_selamanya : request.is_kontrak_selamanya,
            kontrak_berlaku_awal : request.kontrak_berlaku_awal,
            kontrak_berlaku_akhir : request.kontrak_berlaku_akhir,
            is_bast_selamanya : request.is_bast_selamanya,
            bast_berlaku_awal : request.bast_berlaku_awal,
            bast_berlaku_akhir : request.bast_berlaku_akhir,
            file_kontrak : upload[0][0].file_name,
            file_bast : upload[0][1].file_name,
        }

        if(!create) {
            await deleteFile(upload[0][0].file_name)
            await deleteFile(upload[0][1].file_name)
            throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Store Data Gagal")
        }

        if(create) {
            fs.unlinkSync(file_kontrak.path)
            fs.unlinkSync(file_bast.path)
        }

        return result


    } catch (error) {
        debugLogger.debug(error)
        fs.unlinkSync(file_kontrak.path)
        fs.unlinkSync(file_bast.path)
        if(error instanceof CustomError) {
            throw new CustomError(error.code,error.status, error.message)
        } 
        else {
            debugLogger.debug(error)
            throw new CustomError(500, responseStatus.error, "Internal server error.")
        }
    }
}

const hapusPengalamanBadanUsaha = async (id:ParameterSchema["params"]["id"]) : Promise<Pengalaman> => {
    try {
        const exPengalaman = await Pengalaman.findOne({
            where : {
                kode_pengalaman_perusahaan : id
            },
            attributes : {exclude : ["encrypt_key"]}
        })

        if(!exPengalaman) throw new CustomError(httpCode.notFound, responseStatus.success, "Data Pengalaman Perusahaan Tidak Ada")
            

        if(exPengalaman.file_kontrak) {
            const hapusFile = await deleteFile(exPengalaman.file_kontrak as string)
            if(hapusFile[1] !== null) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Gagal Hapus File")

        }

        if(exPengalaman.file_bast) {
            const hapusFile2 = await deleteFile(exPengalaman.file_bast as string)
            if(hapusFile2[1] !== null) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Gagal Hapus File")
        }

        const hapusData = await Pengalaman.destroy({
            where : {
                kode_pengalaman_perusahaan : id
            }
        })

        if(hapusData === 0 ) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Gagal Hapus Data")

        return exPengalaman
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

const getPdfUploadPengalamanKontrak = async (id:ParameterSchema["params"]["id"], kode_vendor:number) : Promise<any> => {
    try {
        const getPengalaman : Pengalaman | null = await Pengalaman.findOne({
            where : {
                kode_vendor : kode_vendor,
                kode_pengalaman_perusahaan : id,       
            }
        })


        if(!getPengalaman) throw new CustomError(httpCode.notFound, responseStatus.error, "Data Tidak Tersedia / Data Bukan Format PDF")

        const data = {
            nama_file : getPengalaman?.file_kontrak as string, 
            keypass : getPengalaman.encrypt_key_kontrak as string
        }


        const tampilGambar = await showFile(data)

        return tampilGambar[0]

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

const getPdfUploadPengalamanBast = async (id:ParameterSchema["params"]["id"], kode_vendor:number) : Promise<any> => {
    try {
        const getPengalaman : Pengalaman | null = await Pengalaman.findOne({
            where : {
                kode_vendor : kode_vendor,
                kode_pengalaman_perusahaan : id,       
            }
        })


        if(!getPengalaman) throw new CustomError(httpCode.notFound, responseStatus.error, "Data Tidak Tersedia / Data Bukan Format PDF")

        const data = {
            nama_file : getPengalaman?.file_bast as string, 
            keypass : getPengalaman.encrypt_key_bast as string
        }


        const tampilGambar = await showFile(data)

        return tampilGambar[0]

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

const updatePengalaman = async (id:PayloadPengalamanUpdateSchema["params"]["id"], 
    request:PayloadPengalamanUpdateSchema["body"],
     file_kontrak : Express.Multer.File, file_bast : Express.Multer.File) : Promise<any> => {
    try {
        const exPengalaman = await Pengalaman.findByPk(id)

        if(!exPengalaman) throw new CustomError(httpCode.notFound, responseStatus.success, "Pengalaman Tidak Tersedia")

        let pengalaman

        if(!file_kontrak || !file_bast) {
            exPengalaman.nama_pekerjaan = request.nama_pekerjaan
            exPengalaman.tahun_pekerjaan = parseInt(request.tahun_pekerjaan)
            exPengalaman.pemberi_kerja = request.pemberi_kerja
            exPengalaman.nilai_pekerjaan = parseInt(request.nilai_pekerjaan)
            exPengalaman.jangka_waktu = request.jangka_waktu
            exPengalaman.no_kontrak = request.no_kontrak
            exPengalaman.is_kontrak_selamanya = request.is_kontrak_selamanya === "true" ? true : false
            exPengalaman.kontrak_berlaku_awal = request.kontrak_berlaku_awal ? moment.utc(request.kontrak_berlaku_awal, "YYYY-MM-DD").toDate() : undefined
            exPengalaman.kontrak_berlaku_akhir = request.kontrak_berlaku_akhir ? moment.utc(request.kontrak_berlaku_akhir, "YYYY-MM-DD").toDate() : undefined
            exPengalaman.is_bast_selamanya = request.is_bast_selamanya === "true" ? true : false
            exPengalaman.bast_berlaku_awal = request.bast_berlaku_awal ? moment.utc(request.bast_berlaku_awal, "YYYY-MM-DD").toDate() : undefined
            exPengalaman.bast_berlaku_akhir = request.bast_berlaku_akhir ? moment.utc(request.bast_berlaku_akhir, "YYYY-MM-DD").toDate() : undefined

            await exPengalaman.save()

            pengalaman = {
                nama_pekerjaan : request.nama_pekerjaan,
                tahun_pekerjaan : request.tahun_pekerjaan,
                pemberi_kerja : request.pemberi_kerja,
                nilai_pekerjaan : request.nilai_pekerjaan,
                jangka_waktu : request.jangka_waktu,
                no_kontrak : request.no_kontrak,
                is_kontrak_selamanya : request.is_kontrak_selamanya,
                kontrak_berlaku_awal : request.kontrak_berlaku_awal,
                kontrak_berlaku_akhir : request.kontrak_berlaku_akhir,
                is_bast_selamanya : request.is_bast_selamanya,
                bast_berlaku_awal : request.bast_berlaku_awal,
                bast_berlaku_akhir : request.bast_berlaku_akhir,
            }
        }

        else {
            await deleteFile(exPengalaman.file_bast as string)
            await deleteFile(exPengalaman.file_kontrak as string)

            const formData = new FormData()

            formData.append('nama_aplikasi','SI-DaPeT')
            formData.append('file1', fs.createReadStream(file_kontrak.path))
            formData.append('file2', fs.createReadStream(file_bast.path))
    
            const upload : any = await uploadPdfMany(formData)
    

            if(upload[1] !== null || !upload[0]){
                throw new CustomError(httpCode.badRequest, responseStatus.error, "Upload Gagal")
            }

            let pengalamanUpd = await Pengalaman.update({
                nama_pekerjaan : request.nama_pekerjaan,
                tahun_pekerjaan : parseInt(request.tahun_pekerjaan),
                pemberi_kerja : request.pemberi_kerja,
                nilai_pekerjaan : parseInt(request.nilai_pekerjaan),
                jangka_waktu : request.jangka_waktu,
                no_kontrak : request.no_kontrak,
                is_kontrak_selamanya : request.is_kontrak_selamanya === "true" ? true : false,
                kontrak_berlaku_awal : request.kontrak_berlaku_awal ? moment.utc(request.kontrak_berlaku_awal, "YYYY-MM-DD").toDate() : undefined,
                kontrak_berlaku_akhir : request.kontrak_berlaku_akhir ? moment.utc(request.kontrak_berlaku_akhir, "YYYY-MM-DD").toDate() : undefined,
                is_bast_selamanya : request.is_bast_selamanya === "true" ? true : false,
                bast_berlaku_awal : request.bast_berlaku_awal ? moment.utc(request.bast_berlaku_awal, "YYYY-MM-DD").toDate() : undefined,
                bast_berlaku_akhir : request.bast_berlaku_akhir ? moment.utc(request.bast_berlaku_akhir, "YYYY-MM-DD").toDate() : undefined,
                file_kontrak   : upload[0][0].file_name,
                encrypt_key_kontrak : upload[0][0].keypass,
                file_bast : upload[0][1].file_name,
                encrypt_key_bast : upload[0][1].keypass
            },{
                where : {
                    kode_pengalaman_perusahaan : id
                },
                returning : true,
            })

            if(pengalamanUpd[0] === 0) throw new CustomError(httpCode.unprocessableEntity,responseStatus.error,"Gagal Update Pengalaman")

                pengalaman = {
                    nama_pekerjaan : pengalamanUpd[1][0].nama_pekerjaan,
                    tahun_pekerjaan : pengalamanUpd[1][0].tahun_pekerjaan,
                    pemberi_kerja : pengalamanUpd[1][0].pemberi_kerja,
                    nilai_pekerjaan : pengalamanUpd[1][0].nilai_pekerjaan,
                    jangka_waktu : pengalamanUpd[1][0].jangka_waktu,
                    no_kontrak : pengalamanUpd[1][0].no_kontrak,
                    is_kontrak_selamanya : pengalamanUpd[1][0].is_kontrak_selamanya,
                    kontrak_berlaku_awal : pengalamanUpd[1][0].kontrak_berlaku_awal,
                    kontrak_berlaku_akhir : pengalamanUpd[1][0].kontrak_berlaku_akhir,
                    is_bast_selamanya : pengalamanUpd[1][0].is_bast_selamanya,
                    bast_berlaku_awal : pengalamanUpd[1][0].bast_berlaku_awal,
                    bast_berlaku_akhir : pengalamanUpd[1][0].bast_berlaku_akhir,
                    file_kontrak : pengalamanUpd[1][0].file_kontrak,
                    file_bast : pengalamanUpd[1][0].file_bast,
                }
        }

        return pengalaman

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



// ################################# PENGALAMAN #########################################

// ################################ PENGALAMAN SEKARANG #################################
const getPengalamanSekarang = async (kode_vendor:number) : Promise<PengalamanSekarang[]> => {
    try {
        const getPengalamanSekarang : PengalamanSekarang[] = await PengalamanSekarang.findAll({
            where : {
                kode_vendor : kode_vendor
            },
            attributes : {exclude : ["encrypt_key"]}
        })

        return getPengalamanSekarang
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

const storePengalamanSekarang = async (request:PayloadPengalamanSekarangSchema["body"], kode_vendor : number, file : Express.Multer.File) : Promise<any> => {
    try {
        const formData = new FormData()

        formData.append('nama_aplikasi','SI-DaPeT')
        formData.append('file', fs.createReadStream(file.path))

        const upload = await uploadPdf(formData)


        if(upload[1] !== null || !upload[0]){
            throw new CustomError(httpCode.badRequest, responseStatus.error, "Upload Gagal")
        }

        const create = await PengalamanSekarang.create({
            kode_vendor : kode_vendor,
            nm_pnglmn_sekarang : request.nm_pnglmn_sekarang,
            div_pnglmn_sekarang : request.div_pnglmn_sekarang,
            ringkas_pnglmn_sekarang : request.ringkas_pnglmn_sekarang,
            lok_pnglmn_sekarang : request.lok_pnglmn_sekarang,
            pemberi_pnglmn_sekarang : request.pemberi_pnglmn_sekarang,
            alamat_pnglmn_sekarang : request.alamat_pnglmn_sekarang,
            tgl_pnglmn_sekarang : request.tgl_pnglmn_sekarang,
            nilai_pnglmn_sekarang : request.nilai_pnglmn_sekarang,
            status_pnglmn_sekarang : request.status_pnglmn_sekarang,
            kontrak_pnglmn_sekarang : request.kontrak_pnglmn_sekarang,
            prestasi_pnglmn_sekarang : request.prestasi_pnglmn_sekarang,
            path_pnglmn_skrg : upload[0].file_name,
            encrypt_key : upload[0].keypass 
        })

        const result = {
            kode_vendor : kode_vendor,
            nm_pnglmn_sekarang : request.nm_pnglmn_sekarang,
            div_pnglmn_sekarang : request.div_pnglmn_sekarang,
            ringkas_pnglmn_sekarang : request.ringkas_pnglmn_sekarang,
            lok_pnglmn_sekarang : request.lok_pnglmn_sekarang,
            pemberi_pnglmn_sekarang : request.pemberi_pnglmn_sekarang,
            alamat_pnglmn_sekarang : request.alamat_pnglmn_sekarang,
            tgl_pnglmn_sekarang : request.tgl_pnglmn_sekarang,
            nilai_pnglmn_sekarang : request.nilai_pnglmn_sekarang,
            status_pnglmn_sekarang : request.status_pnglmn_sekarang,
            kontrak_pnglmn_sekarang : request.kontrak_pnglmn_sekarang,
            prestasi_pnglmn_sekarang : request.prestasi_pnglmn_sekarang,
            path_pnglmn_skrg : upload[0].file_name,
            path_pnglmn : upload[0].file_name,
        }

        if(!create) {
            await deleteFile(upload[0].file_name)
            throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Store Data Gagal")
        }

        if(create) {
            fs.unlinkSync(file.path)
        }

        return result


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

const hapusPengalamanSekarangBadanUsaha = async (id:ParameterSchema["params"]["id"]) : Promise<PengalamanSekarang> => {
    try {
        const exPengalamanSekarang = await PengalamanSekarang.findOne({
            where : {
                kode_pengalaman_sekarang : id
            },
            attributes : {exclude : ["encrypt_key"]}
        })

        if(!exPengalamanSekarang) throw new CustomError(httpCode.notFound, responseStatus.success, "Data Pengalaman Sekarang Perusahaan Tidak Ada")
            

        const hapusFile = await deleteFile(exPengalamanSekarang.path_pnglmn_skrg as string)

        if(hapusFile[1] !== null) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Gagal Hapus File")

        const hapusData = await PengalamanSekarang.destroy({
            where : {
                kode_pengalaman_sekarang : id
            }
        })

        if(hapusData === 0 ) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Gagal Hapus Data")

        return exPengalamanSekarang
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

const getPdfUploadPengalamanSekarang = async (id:ParameterSchema["params"]["id"], kode_vendor:number) : Promise<any> => {
    try {
        const getPengalamanSekarang = await PengalamanSekarang.findOne({
            where : {
                kode_vendor : kode_vendor,
                kode_pengalaman_sekarang : id,
                encrypt_key : {
                    [Op.not] : null
                }
            }
        })


        if(!getPengalamanSekarang) throw new CustomError(httpCode.notFound, responseStatus.error, "Data Tidak Tersedia / Data Bukan Format PDF")

        const data = {
            nama_file : getPengalamanSekarang?.path_pnglmn_skrg as string, 
            keypass : getPengalamanSekarang.encrypt_key as string
        }


        const tampilGambar = await showFile(data)

        return tampilGambar[0]

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

const updatePengalamanSekarang = async (id:PayloadPengalamanSekarangUpdateSchema["params"]["id"], 
    request:PayloadPengalamanSekarangUpdateSchema["body"],
     file : Express.Multer.File) : Promise<any> => {
    try {
        const exPengalamanSekarang = await PengalamanSekarang.findByPk(id)

        if(!exPengalamanSekarang) throw new CustomError(httpCode.notFound, responseStatus.success, "Pengalaman Sekarang Tidak Tersedia")

        let pengalamanSekarang

        if(!file) {
            exPengalamanSekarang.nm_pnglmn_sekarang       = request.nm_pnglmn_sekarang,
            exPengalamanSekarang.div_pnglmn_sekarang      = request.div_pnglmn_sekarang,
            exPengalamanSekarang.ringkas_pnglmn_sekarang  = request.ringkas_pnglmn_sekarang,
            exPengalamanSekarang.lok_pnglmn_sekarang      = request.lok_pnglmn_sekarang,
            exPengalamanSekarang.pemberi_pnglmn_sekarang  = request.pemberi_pnglmn_sekarang,
            exPengalamanSekarang.alamat_pnglmn_sekarang   = request.alamat_pnglmn_sekarang,
            exPengalamanSekarang.tgl_pnglmn_sekarang      = request.tgl_pnglmn_sekarang,
            exPengalamanSekarang.nilai_pnglmn_sekarang    = request.nilai_pnglmn_sekarang,
            exPengalamanSekarang.status_pnglmn_sekarang   = request.status_pnglmn_sekarang,
            exPengalamanSekarang.kontrak_pnglmn_sekarang  = request.kontrak_pnglmn_sekarang,
            exPengalamanSekarang.prestasi_pnglmn_sekarang = request.prestasi_pnglmn_sekarang,

            await exPengalamanSekarang.save()

            pengalamanSekarang = {
                nm_pnglmn_sekarang      : request.nm_pnglmn_sekarang,
                div_pnglmn_sekarang     : request.div_pnglmn_sekarang,
                ringkas_pnglmn_sekarang : request.ringkas_pnglmn_sekarang,
                lok_pnglmn_sekarang     : request.lok_pnglmn_sekarang,
                pemberi_pnglmn_sekarang : request.pemberi_pnglmn_sekarang,
                alamat_pnglmn_sekarang  : request.alamat_pnglmn_sekarang,
                tgl_pnglmn_sekarang     : request.tgl_pnglmn_sekarang,
                nilai_pnglmn_sekarang   : request.nilai_pnglmn_sekarang,
                status_pnglmn_sekarang  : request.status_pnglmn_sekarang,
                kontrak_pnglmn_sekarang : request.kontrak_pnglmn_sekarang,
                prestasi_pnglmn_sekarang: request.prestasi_pnglmn_sekarang,
            }
        }

        else {
            await deleteFile(exPengalamanSekarang.path_pnglmn_skrg as string)

            const formData = new FormData()

            formData.append('nama_aplikasi','SI-DaPeT')
            formData.append('file', fs.createReadStream(file.path))
    
            const upload : any = await uploadPdf(formData)
    

            if(upload[1] !== null || !upload[0]){
                throw new CustomError(httpCode.badRequest, responseStatus.error, "Upload Gagal")
            }

            let pengalamanSekarangUpd = await PengalamanSekarang.update({
                nm_pnglmn_sekarang : request.nm_pnglmn_sekarang,
                div_pnglmn_sekarang : request.div_pnglmn_sekarang,
                ringkas_pnglmn_sekarang : request.ringkas_pnglmn_sekarang,
                lok_pnglmn_sekarang : request.lok_pnglmn_sekarang,
                pemberi_pnglmn_sekarang : request.pemberi_pnglmn_sekarang,
                alamat_pnglmn_sekarang : request.alamat_pnglmn_sekarang,
                tgl_pnglmn_sekarang : request.tgl_pnglmn_sekarang,
                nilai_pnglmn_sekarang : request.nilai_pnglmn_sekarang,
                status_pnglmn_sekarang : request.status_pnglmn_sekarang,
                kontrak_pnglmn_sekarang : request.kontrak_pnglmn_sekarang,
                prestasi_pnglmn_sekarang : request.prestasi_pnglmn_sekarang,
                path_pnglmn_skrg   : upload[0].file_name,
                encrypt_key      : upload[0].keypass
            },{
                where : {
                    kode_pengalaman_sekarang : id
                },
                returning : true,
            })

            if(pengalamanSekarangUpd[0] === 0) throw new CustomError(httpCode.unprocessableEntity,responseStatus.error,"Gagal Update Pengalaman Sekarang")

                pengalamanSekarang = {
                    nm_pnglmn_sekarang :pengalamanSekarangUpd[1][0].nm_pnglmn_sekarang,
                    div_pnglmn_sekarang :pengalamanSekarangUpd[1][0].div_pnglmn_sekarang,
                    ringkas_pnglmn_sekarang :pengalamanSekarangUpd[1][0].ringkas_pnglmn_sekarang,
                    lok_pnglmn_sekarang :pengalamanSekarangUpd[1][0].lok_pnglmn_sekarang,
                    pemberi_pnglmn_sekarang :pengalamanSekarangUpd[1][0].pemberi_pnglmn_sekarang,
                    alamat_pnglmn_sekarang :pengalamanSekarangUpd[1][0].alamat_pnglmn_sekarang,
                    tgl_pnglmn_sekarang :pengalamanSekarangUpd[1][0].tgl_pnglmn_sekarang,
                    nilai_pnglmn_sekarang :pengalamanSekarangUpd[1][0].nilai_pnglmn_sekarang,
                    status_pnglmn_sekarang :pengalamanSekarangUpd[1][0].status_pnglmn_sekarang,
                    kontrak_pnglmn_sekarang :pengalamanSekarangUpd[1][0].kontrak_pnglmn_sekarang,
                    prestasi_pnglmn_sekarang :pengalamanSekarangUpd[1][0].prestasi_pnglmn_sekarang,
                    path_pnglmn_skrg   : pengalamanSekarangUpd[1][0].path_pnglmn_skrg,
                }
        }

        return pengalamanSekarang

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

// ############################## PENGALAMAN SEKARANG ###################################

// ############################## TENAGA AHLI ###########################################
const getTenagaAhli = async (kode_vendor:number) : Promise<TenagaAhli[]> => {
    try {
        const getTenaga : TenagaAhli[] = await TenagaAhli.findAll({
            where : {
                kode_vendor : kode_vendor
            },
            attributes : {exclude : ["encrypt_key_ktp", "encrypt_key_cv","encrypt_key_ijazah"]}
        })

        return getTenaga
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

const storeTenagaAhli = async (request:PayloadTenagaAhliSchema["body"], kode_vendor : number, file_ktp : Express.Multer.File, file_ijazah : Express.Multer.File, file_cv : Express.Multer.File) : Promise<any> => {
    try {        

        const formData = new FormData()

        formData.append('nama_aplikasi','SI-DaPeT')
        formData.append('file1', fs.createReadStream(file_ktp.path))
        formData.append('file2', fs.createReadStream(file_ijazah.path))
        formData.append('file3', fs.createReadStream(file_cv.path))

        

        const upload = await uploadPdfManyPersonalia(formData)



        if(upload[1] !== null || !upload[0]){
            throw new CustomError(httpCode.badRequest, responseStatus.error, "Upload Gagal")
        }

        const create = await TenagaAhli.create({
            kode_vendor : kode_vendor,
            nama : request.nama,
            no_ktp : request.no_ktp,
            is_ktp_selamanya : request.is_ktp_selamanya === "true" ? true : false,
            ktp_berlaku_awal : request.ktp_berlaku_awal ? moment.utc(request.ktp_berlaku_awal, "YYYY-MM-DD").toDate() : undefined,
            ktp_berlaku_akhir : request.ktp_berlaku_akhir ? moment.utc(request.ktp_berlaku_akhir, "YYYY-MM-DD").toDate() : undefined,
            file_ktp : upload[0][0].file_name,
            encrypt_key_ktp : upload[0][0].keypass,
            tempat_lahir : request.tempat_lahir,
            tgl_lahir : request.tgl_lahir ? moment.utc(request.tgl_lahir, "YYYY-MM-DD").toDate() : undefined,
            posisi : request.posisi,
            kode_jenjang_pendidikan : parseInt(request.kode_jenjang_pendidikan),
            program_studi : request.program_studi,
            is_ijazah_selamanya : request.is_ijazah_selamanya === "true" ? true : false,
            ijazah_berlaku_awal : request.ijazah_berlaku_awal ? moment.utc(request.ijazah_berlaku_awal, "YYYY-MM-DD").toDate() : undefined,
            ijazah_berlaku_akhir : request.ijazah_berlaku_akhir ? moment.utc(request.ijazah_berlaku_akhir, "YYYY-MM-DD").toDate() : undefined,
            file_ijazah : upload[0][1].file_name,
            encrypt_key_ijazah : upload[0][1].keypass,
            is_cv_selamanya : request.is_cv_selamanya === "true" ? true : false,
            cv_berlaku_awal : request.cv_berlaku_awal ? moment.utc(request.cv_berlaku_awal, "YYYY-MM-DD").toDate() : undefined,
            cv_berlaku_akhir : request.cv_berlaku_akhir ? moment.utc(request.cv_berlaku_akhir, "YYYY-MM-DD").toDate() : undefined,
            file_cv : upload[0][2].file_name,
            encrypt_key_cv : upload[0][2].keypass,
        })

        const result = {
            nama : request.nama,
            no_ktp : request.no_ktp,
            is_ktp_selamanya : request.is_ktp_selamanya,
            ktp_berlaku_awal : request.ktp_berlaku_awal,
            ktp_berlaku_akhir : request.ktp_berlaku_akhir,
            tempat_lahir : request.tempat_lahir,
            tgl_lahir : request.tgl_lahir,
            posisi : request.posisi,
            kode_jenjang_pendidikan : request.kode_jenjang_pendidikan,
            program_studi : request.program_studi,
            is_ijazah_selamanya : request.is_ijazah_selamanya,
            ijazah_berlaku_awal : request.ijazah_berlaku_awal,
            ijazah_berlaku_akhir : request.ijazah_berlaku_akhir,
            is_cv_selamanya : request.is_cv_selamanya,
            cv_berlaku_awal : request.cv_berlaku_awal,
            cv_berlaku_akhir : request.cv_berlaku_akhir,
            file_ktp : upload[0][0].file_name,
            file_ijazah : upload[0][1].file_name,
            file_cv : upload[0][2].file_name,
        }

        if(!create) {
            await deleteFile(upload[0][0].file_name)
            await deleteFile(upload[0][1].file_name)
            await deleteFile(upload[0][2].file_name)
            throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Store Data Gagal")
        }

        if(create) {            
            fs.unlinkSync(file_ktp.path)
            fs.unlinkSync(file_cv.path)
            fs.unlinkSync(file_ijazah.path)
        }

        return result


    } catch (error) {
        debugLogger.debug(error)
        if(file_ktp.path) {
            fs.unlinkSync(file_ktp.path)
        }
        if(file_cv.path) {
            fs.unlinkSync(file_cv.path)
        }
        if(file_ijazah.path)  fs.unlinkSync(file_ijazah.path)
        if(error instanceof CustomError) {
            throw new CustomError(error.code,error.status, error.message)
        } 
        else {
            debugLogger.debug(error)
            throw new CustomError(500, responseStatus.error, "Internal server error.")
        }
    }
}

const hapusTenagaAhli = async (id:ParameterSchema["params"]["id"]) : Promise<TenagaAhli> => {
    const t = await db.transaction()
    try {
        const exTenagaAhli = await TenagaAhli.findOne({
            where : {
                kode_tenaga_ahli : id
            },
            attributes : {exclude : ["encrypt_key"]},
            transaction : t
        })

        if(!exTenagaAhli) throw new CustomError(httpCode.notFound, responseStatus.success, "Data Tenaga Ahli Tidak Ada")

        const exPengalamanTa = await PengalamanTa.findAll({
            where : {
                kode_tenaga_ahli : id
            },
            transaction : t
        })



        if(exPengalamanTa.length > 0) {
            for(const pengalamanTa of exPengalamanTa) {
                if(pengalamanTa.file_bukti) {
                    const hapusFile = await deleteFile(pengalamanTa.file_bukti as string)
                    if(hapusFile[1] !== null) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Gagal Hapus File Pengalaman TA")
                    console.log(hapusFile);

                }
            }
            const deleteTa = await PengalamanTa.destroy({
                where : {
                    kode_tenaga_ahli : id
                },
                transaction : t
            })
            if(deleteTa === 0) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Terjadi Kesalahan pada Hapus Pengalaman TA")
        }

        const exSertifTa = await SertifTA.findAll({
            where : {
                kode_tenaga_ahli : id
            }
        })
            
        if(exSertifTa.length > 0) {
            for(const sertifTa of exSertifTa) {
                console.log("TES SERTIF TA")
                if(sertifTa.file_bukti) {
                    const hapusFile = await deleteFile(sertifTa.file_bukti as string)
                    console.log(hapusFile);
                    
                    if(hapusFile[1] !== null) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Gagal Hapus File Pengalaman TP")
                }
            }
            const deleteTa = await SertifTA.destroy({
                where : {
                    kode_tenaga_ahli : id
                },
                transaction : t
            })
            if(deleteTa === 0) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Terjadi Kesalahan pada Hapus Sertifikat TA")
        }

        if(exTenagaAhli.file_ktp) {
            const hapusFile3 = await deleteFile(exTenagaAhli.file_ktp as string)
            if(hapusFile3[1] !== null) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Gagal Hapus File KTP")
        }

        if(exTenagaAhli.file_cv) {
            const hapusFile2 = await deleteFile(exTenagaAhli.file_cv as string)            
            if(hapusFile2[1] !== null) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Gagal Hapus File CV")
        }

        if(exTenagaAhli.file_ijazah) {
            const hapusFile3 = await deleteFile(exTenagaAhli.file_ijazah as string)
            if(hapusFile3[1] !== null) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Gagal Hapus File IJAZAH")
        }

   

        const hapusData = await TenagaAhli.destroy({
            where : {
                kode_tenaga_ahli : id
            },
            transaction : t
        })

        if(hapusData === 0 ) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Gagal Hapus Data")

        await t.commit()

        return exTenagaAhli
    } catch (error) {
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

const updateTenagaAhli = async (id:PayloadTenagaAhliUpdateSchema["params"]["id"], 
    request:PayloadTenagaAhliUpdateSchema["body"],
    file_ktp:Express.Multer.File, file_cv:Express.Multer.File ,file_ijazah:Express.Multer.File)  : Promise<any> => {
    try {
        const exTenagaAhli = await TenagaAhli.findByPk(id)

        if(!exTenagaAhli) throw new CustomError(httpCode.notFound, responseStatus.success, "Pengalaman Tidak Tersedia")

        let tenagaAhli

        if(!file_ktp || !file_cv || !file_ijazah ) {
            exTenagaAhli.nama = request.nama
            exTenagaAhli.no_ktp = request.no_ktp
            exTenagaAhli.is_ktp_selamanya = request.is_ktp_selamanya === "true" ? true : false
            exTenagaAhli.ktp_berlaku_awal = request.ktp_berlaku_awal ? moment.utc(request.ktp_berlaku_awal, "YYYY-MM-DD").toDate() : undefined
            exTenagaAhli.ktp_berlaku_akhir = request.ktp_berlaku_akhir ? moment.utc(request.ktp_berlaku_akhir, "YYYY-MM-DD").toDate() : undefined
            exTenagaAhli.tempat_lahir = request.tempat_lahir
            exTenagaAhli.tgl_lahir = request.tgl_lahir ? moment.utc(request.tgl_lahir, "YYYY-MM-DD").toDate() : undefined
            exTenagaAhli.posisi = request.posisi
            exTenagaAhli.kode_jenjang_pendidikan = parseInt(request.kode_jenjang_pendidikan )
            exTenagaAhli.program_studi = request.program_studi
            exTenagaAhli.is_ijazah_selamanya = request.is_ijazah_selamanya === "true" ? true : false
            exTenagaAhli.ijazah_berlaku_awal = request.ijazah_berlaku_awal ? moment.utc(request.ijazah_berlaku_awal, "YYYY-MM-DD").toDate() : undefined
            exTenagaAhli.ijazah_berlaku_akhir = request.ijazah_berlaku_akhir ? moment.utc(request.ijazah_berlaku_akhir, "YYYY-MM-DD").toDate() : undefined
            exTenagaAhli.is_cv_selamanya = request.is_cv_selamanya === "true" ? true : false
            exTenagaAhli.cv_berlaku_awal = request.cv_berlaku_awal ? moment.utc(request.cv_berlaku_awal, "YYYY-MM-DD").toDate() : undefined
            exTenagaAhli.cv_berlaku_akhir = request.cv_berlaku_akhir ? moment.utc(request.cv_berlaku_akhir, "YYYY-MM-DD").toDate() : undefined

            await exTenagaAhli.save()

            tenagaAhli = {
                nama : request.nama ,
                no_ktp : request.no_ktp ,
                is_ktp_selamanya : request.is_ktp_selamanya ,
                ktp_berlaku_awal : request.ktp_berlaku_awal ,
                ktp_berlaku_akhir : request.ktp_berlaku_akhir ,
                tempat_lahir : request.tempat_lahir ,
                tgl_lahir : request.tgl_lahir ,
                posisi : request.posisi ,
                kode_jenjang_pendidikan : request.kode_jenjang_pendidikan ,
                program_studi : request.program_studi ,
                is_ijazah_selamanya : request.is_ijazah_selamanya ,
                ijazah_berlaku_awal : request.ijazah_berlaku_awal ,
                ijazah_berlaku_akhir : request.ijazah_berlaku_akhir ,
                is_cv_selamanya : request.is_cv_selamanya ,
                cv_berlaku_awal : request.cv_berlaku_awal ,
                cv_berlaku_akhir : request.cv_berlaku_akhir ,
    
            }
        }

        else {
            await deleteFile(exTenagaAhli.file_ktp as string)
            await deleteFile(exTenagaAhli.file_cv as string)
            await deleteFile(exTenagaAhli.file_ijazah as string)


            const formData = new FormData()

            formData.append('nama_aplikasi','SI-DaPeT')
            formData.append('file1', fs.createReadStream(file_ktp.path))
            formData.append('file2', fs.createReadStream(file_cv.path))
            formData.append('file3', fs.createReadStream(file_ijazah.path))

            
    
            const upload : any = await uploadPdfManyPersonalia(formData)
    

            if(upload[1] !== null || !upload[0]){
                throw new CustomError(httpCode.badRequest, responseStatus.error, "Upload Gagal")
            }

            let tenagaAhliUpd = await TenagaAhli.update({
                nama : request.nama,
                no_ktp : request.no_ktp,
                is_ktp_selamanya : request.is_ktp_selamanya === "true" ? true : false,
                ktp_berlaku_awal : request.ktp_berlaku_awal ? moment.utc(request.ktp_berlaku_awal, "YYYY-MM-DD").toDate() : undefined,
                ktp_berlaku_akhir : request.ktp_berlaku_akhir ? moment.utc(request.ktp_berlaku_akhir, "YYYY-MM-DD").toDate() : undefined,
                tempat_lahir : request.tempat_lahir,
                tgl_lahir : request.tgl_lahir ? moment.utc(request.tgl_lahir, "YYYY-MM-DD").toDate() : undefined,
                posisi : request.posisi,
                kode_jenjang_pendidikan : parseInt(request.kode_jenjang_pendidikan ),
                program_studi : request.program_studi,
                is_ijazah_selamanya : request.is_ijazah_selamanya === "true" ? true : false,
                ijazah_berlaku_awal : request.ijazah_berlaku_awal ? moment.utc(request.ijazah_berlaku_awal, "YYYY-MM-DD").toDate() : undefined,
                ijazah_berlaku_akhir : request.ijazah_berlaku_akhir ? moment.utc(request.ijazah_berlaku_akhir, "YYYY-MM-DD").toDate() : undefined,
                is_cv_selamanya : request.is_cv_selamanya === "true" ? true : false,
                cv_berlaku_awal : request.cv_berlaku_awal ? moment.utc(request.cv_berlaku_awal, "YYYY-MM-DD").toDate() : undefined,
                cv_berlaku_akhir : request.cv_berlaku_akhir ? moment.utc(request.cv_berlaku_akhir, "YYYY-MM-DD").toDate() : undefined,
                file_ktp : upload[0][0].file_name,
                file_cv : upload[0][1].file_name,
                file_ijazah : upload[0][2].file_name,
                encrypt_key_ktp : upload[0][0].keypass,
                encrypt_key_cv : upload[0][1].keypass,
                encrypt_key_ijazah : upload[0][2].keypass

            },{
                where : {
                    kode_tenaga_ahli : id
                },
                returning : true,
            })

            if(tenagaAhliUpd[0] === 0) throw new CustomError(httpCode.unprocessableEntity,responseStatus.error,"Gagal Update Tenaga Ahli")

            
            tenagaAhli = {
                nama : tenagaAhliUpd[1][0].nama,
                no_ktp : tenagaAhliUpd[1][0].no_ktp,
                is_ktp_selamanya : tenagaAhliUpd[1][0].is_ktp_selamanya,
                ktp_berlaku_awal : tenagaAhliUpd[1][0].ktp_berlaku_awal,
                ktp_berlaku_akhir : tenagaAhliUpd[1][0].ktp_berlaku_akhir,
                tempat_lahir : tenagaAhliUpd[1][0].tempat_lahir,
                tgl_lahir : tenagaAhliUpd[1][0].tgl_lahir,
                posisi : tenagaAhliUpd[1][0].posisi,
                kode_jenjang_pendidikan : tenagaAhliUpd[1][0].kode_jenjang_pendidikan,
                program_studi : tenagaAhliUpd[1][0].program_studi,
                is_ijazah_selamanya : tenagaAhliUpd[1][0].is_ijazah_selamanya,
                ijazah_berlaku_awal : tenagaAhliUpd[1][0].ijazah_berlaku_awal,
                ijazah_berlaku_akhir : tenagaAhliUpd[1][0].ijazah_berlaku_akhir,
                is_cv_selamanya : tenagaAhliUpd[1][0].is_cv_selamanya,
                cv_berlaku_awal : tenagaAhliUpd[1][0].cv_berlaku_awal,
                cv_berlaku_akhir : tenagaAhliUpd[1][0].cv_berlaku_akhir,
                file_ktp : tenagaAhliUpd[1][0].file_ktp,
                file_cv : tenagaAhliUpd[1][0].file_cv,
                file_ijazah : tenagaAhliUpd[1][0].file_ijazah,
            }
            
        }

        return tenagaAhli

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

const getPdfUploadTenagaAhliKtp = async (id:ParameterSchema["params"]["id"], kode_vendor:number) : Promise<any> => {
    try {
        const getTenaga : TenagaAhli | null = await TenagaAhli.findOne({
            where : {
                kode_vendor : kode_vendor,
                kode_tenaga_ahli : id,       
            }
        })


        if(!getTenaga) throw new CustomError(httpCode.notFound, responseStatus.error, "Data Tidak Tersedia / Data Bukan Format PDF")
        
        const data = {
            nama_file : getTenaga?.file_ktp as string, 
            keypass : getTenaga.encrypt_key_ktp as string
        }
        


        const tampilGambar = await showFile(data)

        return tampilGambar[0]

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

const getPdfUploadTenagaAhliCv = async (id:ParameterSchema["params"]["id"], kode_vendor:number) : Promise<any> => {
    try {
        const getTenaga : TenagaAhli | null = await TenagaAhli.findOne({
            where : {
                kode_vendor : kode_vendor,
                kode_tenaga_ahli : id,       
            }
        })


        if(!getTenaga) throw new CustomError(httpCode.notFound, responseStatus.error, "Data Tidak Tersedia / Data Bukan Format PDF")

        const data = {
            nama_file : getTenaga?.file_cv as string, 
            keypass : getTenaga.encrypt_key_cv as string
        }


        const tampilGambar = await showFile(data)

        return tampilGambar[0]

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

const getPdfUploadTenagaAhliIjazah = async (id:ParameterSchema["params"]["id"], kode_vendor:number) : Promise<any> => {
    try {
        const getTenaga : TenagaAhli | null = await TenagaAhli.findOne({
            where : {
                kode_vendor : kode_vendor,
                kode_tenaga_ahli : id,       
            }
        })


        if(!getTenaga) throw new CustomError(httpCode.notFound, responseStatus.error, "Data Tidak Tersedia / Data Bukan Format PDF")

        const data = {
            nama_file : getTenaga?.file_ijazah as string, 
            keypass : getTenaga.encrypt_key_ijazah as string
        }


        const tampilGambar = await showFile(data)

        return tampilGambar[0]

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

// ######################################################################################

// ############################## TENAGA PENDUKUNG ######################################
const getTenagaPendukung = async (kode_vendor:number) : Promise<TenagaPendukung[]> => {
    try {
        const getTenaga : TenagaPendukung[] = await TenagaPendukung.findAll({
            where : {
                kode_vendor : kode_vendor
            },
            attributes : {exclude : ["encrypt_key"]}
        })

        return getTenaga
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

const storeTenagaPendukung = async (request:PayloadTenagaPendukungSchema["body"], kode_vendor : number, file_ktp : Express.Multer.File, file_ijazah : Express.Multer.File, file_cv : Express.Multer.File) : Promise<any> => {
    try {        

        const formData = new FormData()

        formData.append('nama_aplikasi','SI-DaPeT')
        formData.append('file1', fs.createReadStream(file_ktp.path))
        formData.append('file2', fs.createReadStream(file_ijazah.path))
        formData.append('file3', fs.createReadStream(file_cv.path))

        

        const upload = await uploadPdfManyPersonalia(formData)



        if(upload[1] !== null || !upload[0]){
            throw new CustomError(httpCode.badRequest, responseStatus.error, "Upload Gagal")
        }

        const create = await TenagaPendukung.create({
            kode_vendor : kode_vendor,
            nama : request.nama,
            no_ktp : request.no_ktp,
            is_ktp_selamanya : request.is_ktp_selamanya === "true" ? true : false,
            ktp_berlaku_awal : request.ktp_berlaku_awal ? moment.utc(request.ktp_berlaku_awal, "YYYY-MM-DD").toDate() : undefined,
            ktp_berlaku_akhir : request.ktp_berlaku_akhir ? moment.utc(request.ktp_berlaku_akhir, "YYYY-MM-DD").toDate() : undefined,
            file_ktp : upload[0][0].file_name,
            encrypt_key_ktp : upload[0][0].keypass,
            tempat_lahir : request.tempat_lahir,
            tgl_lahir : request.tgl_lahir ? moment.utc(request.tgl_lahir, "YYYY-MM-DD").toDate() : undefined,
            posisi : request.posisi,
            kode_jenjang_pendidikan : parseInt(request.kode_jenjang_pendidikan),
            program_studi : request.program_studi,
            is_ijazah_selamanya : request.is_ijazah_selamanya === "true" ? true : false,
            ijazah_berlaku_awal : request.ijazah_berlaku_awal ? moment.utc(request.ijazah_berlaku_awal, "YYYY-MM-DD").toDate() : undefined,
            ijazah_berlaku_akhir : request.ijazah_berlaku_akhir ? moment.utc(request.ijazah_berlaku_akhir, "YYYY-MM-DD").toDate() : undefined,
            file_ijazah : upload[0][1].file_name,
            encrypt_key_ijazah : upload[0][1].keypass,
            is_cv_selamanya : request.is_cv_selamanya === "true" ? true : false,
            cv_berlaku_awal : request.cv_berlaku_awal ? moment.utc(request.cv_berlaku_awal, "YYYY-MM-DD").toDate() : undefined,
            cv_berlaku_akhir : request.cv_berlaku_akhir ? moment.utc(request.cv_berlaku_akhir, "YYYY-MM-DD").toDate() : undefined,
            file_cv : upload[0][2].file_name,
            encrypt_key_cv : upload[0][2].keypass,
        })

        const result = {
            nama : request.nama,
            no_ktp : request.no_ktp,
            is_ktp_selamanya : request.is_ktp_selamanya,
            ktp_berlaku_awal : request.ktp_berlaku_awal,
            ktp_berlaku_akhir : request.ktp_berlaku_akhir,
            tempat_lahir : request.tempat_lahir,
            tgl_lahir : request.tgl_lahir,
            posisi : request.posisi,
            kode_jenjang_pendidikan : request.kode_jenjang_pendidikan,
            program_studi : request.program_studi,
            is_ijazah_selamanya : request.is_ijazah_selamanya,
            ijazah_berlaku_awal : request.ijazah_berlaku_awal,
            ijazah_berlaku_akhir : request.ijazah_berlaku_akhir,
            is_cv_selamanya : request.is_cv_selamanya,
            cv_berlaku_awal : request.cv_berlaku_awal,
            cv_berlaku_akhir : request.cv_berlaku_akhir,
            file_ktp : upload[0][0].file_name,
            file_ijazah : upload[0][1].file_name,
            file_cv : upload[0][2].file_name,
        }

        if(!create) {
            await deleteFile(upload[0][0].file_name)
            await deleteFile(upload[0][1].file_name)
            await deleteFile(upload[0][2].file_name)
            throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Store Data Gagal")
        }

        if(create) {
            console.log("TES")
            if(file_ktp.path) fs.unlinkSync(file_ktp.path)
            else if(file_cv.path) fs.unlinkSync(file_cv.path)
            else fs.unlinkSync(file_ijazah.path)
        }

        return result


    } catch (error) {
        console.log(error)
        debugLogger.debug(error)
        if(file_ktp.path) {
            fs.unlinkSync(file_ktp.path)
        }
        else if(file_cv.path) {
            fs.unlinkSync(file_cv.path)
        }
        else fs.unlinkSync(file_ijazah.path)


        if(error instanceof CustomError) {
            throw new CustomError(error.code,error.status, error.message)
        } 
        else {
            debugLogger.debug(error)
            throw new CustomError(500, responseStatus.error, "Internal server error.")
        }
    }
}

const hapusTenagaPendukung = async (id:ParameterSchema["params"]["id"]) : Promise<TenagaPendukung> => {
    const t = await db.transaction()
    try {
        const exTenagaPendukung = await TenagaPendukung.findOne({
            where : {
                kode_tenaga_pendukung : id
            },
            attributes : {exclude : ["encrypt_key"]},
            transaction : t
        })

        if(!exTenagaPendukung) throw new CustomError(httpCode.notFound, responseStatus.success, "Data Tenaga Ahli Tidak Ada")

        const exPengalamanTp = await PengalamanTp.findAll({
            where : {
                kode_tenaga_pendukung : id
            },
            transaction : t
        })



        if(exPengalamanTp.length > 0) {
            for(const pengalamanTp of exPengalamanTp) {
                if(pengalamanTp.file_bukti) {
                    const hapusFile = await deleteFile(pengalamanTp.file_bukti as string)
                    if(hapusFile[1] !== null) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Gagal Hapus File Pengalaman TA")
                    console.log(hapusFile);

                }
            }
            const deleteTp = await PengalamanTp.destroy({
                where : {
                    kode_tenaga_pendukung : id
                },
                transaction : t
            })
            if(deleteTp === 0) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Terjadi Kesalahan pada Hapus Pengalaman TA")
        }

        const exSertifTp = await SertifTP.findAll({
            where : {
                kode_sertif_tp : id
            }
        })
            
        if(exSertifTp.length > 0) {
            for(const sertifTp of exSertifTp) {
                console.log("TES SERTIF TA")
                if(sertifTp.file_bukti) {
                    const hapusFile = await deleteFile(sertifTp.file_bukti as string)
                    console.log(hapusFile);
                    
                    if(hapusFile[1] !== null) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Gagal Hapus File Pengalaman TP")
                }
            }
            const deleteTa = await SertifTP.destroy({
                where : {
                    kode_tenaga_pendukung : id
                },
                transaction : t
            })
            if(deleteTa === 0) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Terjadi Kesalahan pada Hapus Sertifikat TA")
        }


        if(exTenagaPendukung.file_ktp) {
            const hapusFile3 = await deleteFile(exTenagaPendukung.file_ktp as string)
            if(hapusFile3[1] !== null) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Gagal Hapus File KTP")
        }

        if(exTenagaPendukung.file_cv) {
            const hapusFile2 = await deleteFile(exTenagaPendukung.file_cv as string)            
            if(hapusFile2[1] !== null) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Gagal Hapus File CV")
        }

        if(exTenagaPendukung.file_ijazah) {
            const hapusFile3 = await deleteFile(exTenagaPendukung.file_ijazah as string)
            if(hapusFile3[1] !== null) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Gagal Hapus File IJAZAH")
        }

   

        const hapusData = await TenagaAhli.destroy({
            where : {
                kode_tenaga_ahli : id
            },
            transaction : t
        })

        if(hapusData === 0 ) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Gagal Hapus Data")

        await t.commit()

        return exTenagaPendukung
    } catch (error) {
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

const updateTenagaPendukung = async (id:PayloadTenagaPendukungUpdateSchema["params"]["id"], 
    request:PayloadTenagaPendukungUpdateSchema["body"],
    file_ktp:Express.Multer.File, file_cv:Express.Multer.File ,file_ijazah:Express.Multer.File)  : Promise<any> => {
    try {
        const exTenagaPendukung = await TenagaPendukung.findByPk(id)

        if(!exTenagaPendukung) throw new CustomError(httpCode.notFound, responseStatus.success, "Pengalaman Tidak Tersedia")

        let tenagaPendukung

        if(!file_ktp || !file_cv || !file_ijazah ) {
            exTenagaPendukung.nama = request.nama
            exTenagaPendukung.no_ktp = request.no_ktp
            exTenagaPendukung.is_ktp_selamanya = request.is_ktp_selamanya === "true" ? true : false
            exTenagaPendukung.ktp_berlaku_awal = request.ktp_berlaku_awal ? moment.utc(request.ktp_berlaku_awal, "YYYY-MM-DD").toDate() : undefined
            exTenagaPendukung.ktp_berlaku_akhir = request.ktp_berlaku_akhir ? moment.utc(request.ktp_berlaku_akhir, "YYYY-MM-DD").toDate() : undefined
            exTenagaPendukung.tempat_lahir = request.tempat_lahir
            exTenagaPendukung.tgl_lahir = request.tgl_lahir ? moment.utc(request.tgl_lahir, "YYYY-MM-DD").toDate() : undefined
            exTenagaPendukung.posisi = request.posisi
            exTenagaPendukung.kode_jenjang_pendidikan = parseInt(request.kode_jenjang_pendidikan )
            exTenagaPendukung.program_studi = request.program_studi
            exTenagaPendukung.is_ijazah_selamanya = request.is_ijazah_selamanya === "true" ? true : false
            exTenagaPendukung.ijazah_berlaku_awal = request.ijazah_berlaku_awal ? moment.utc(request.ijazah_berlaku_awal, "YYYY-MM-DD").toDate() : undefined
            exTenagaPendukung.ijazah_berlaku_akhir = request.ijazah_berlaku_akhir ? moment.utc(request.ijazah_berlaku_akhir, "YYYY-MM-DD").toDate() : undefined
            exTenagaPendukung.is_cv_selamanya = request.is_cv_selamanya === "true" ? true : false
            exTenagaPendukung.cv_berlaku_awal = request.cv_berlaku_awal ? moment.utc(request.cv_berlaku_awal, "YYYY-MM-DD").toDate() : undefined
            exTenagaPendukung.cv_berlaku_akhir = request.cv_berlaku_akhir ? moment.utc(request.cv_berlaku_akhir, "YYYY-MM-DD").toDate() : undefined

            await exTenagaPendukung.save()

            tenagaPendukung = {
                nama : request.nama ,
                no_ktp : request.no_ktp ,
                is_ktp_selamanya : request.is_ktp_selamanya ,
                ktp_berlaku_awal : request.ktp_berlaku_awal ,
                ktp_berlaku_akhir : request.ktp_berlaku_akhir ,
                tempat_lahir : request.tempat_lahir ,
                tgl_lahir : request.tgl_lahir ,
                posisi : request.posisi ,
                kode_jenjang_pendidikan : request.kode_jenjang_pendidikan ,
                program_studi : request.program_studi ,
                is_ijazah_selamanya : request.is_ijazah_selamanya ,
                ijazah_berlaku_awal : request.ijazah_berlaku_awal ,
                ijazah_berlaku_akhir : request.ijazah_berlaku_akhir ,
                is_cv_selamanya : request.is_cv_selamanya ,
                cv_berlaku_awal : request.cv_berlaku_awal ,
                cv_berlaku_akhir : request.cv_berlaku_akhir ,
    
            }
        }

        else {
            await deleteFile(exTenagaPendukung.file_ktp as string)
            await deleteFile(exTenagaPendukung.file_cv as string)
            await deleteFile(exTenagaPendukung.file_ijazah as string)


            const formData = new FormData()

            formData.append('nama_aplikasi','SI-DaPeT')
            formData.append('file1', fs.createReadStream(file_ktp.path))
            formData.append('file2', fs.createReadStream(file_cv.path))
            formData.append('file3', fs.createReadStream(file_ijazah.path))

            
    
            const upload : any = await uploadPdfManyPersonalia(formData)
    

            if(upload[1] !== null || !upload[0]){
                throw new CustomError(httpCode.badRequest, responseStatus.error, "Upload Gagal")
            }

            let tenagaPendukungUpd = await TenagaPendukung.update({
                nama : request.nama,
                no_ktp : request.no_ktp,
                is_ktp_selamanya : request.is_ktp_selamanya === "true" ? true : false,
                ktp_berlaku_awal : request.ktp_berlaku_awal ? moment.utc(request.ktp_berlaku_awal, "YYYY-MM-DD").toDate() : undefined,
                ktp_berlaku_akhir : request.ktp_berlaku_akhir ? moment.utc(request.ktp_berlaku_akhir, "YYYY-MM-DD").toDate() : undefined,
                tempat_lahir : request.tempat_lahir,
                tgl_lahir : request.tgl_lahir ? moment.utc(request.tgl_lahir, "YYYY-MM-DD").toDate() : undefined,
                posisi : request.posisi,
                kode_jenjang_pendidikan : parseInt(request.kode_jenjang_pendidikan ),
                program_studi : request.program_studi,
                is_ijazah_selamanya : request.is_ijazah_selamanya === "true" ? true : false,
                ijazah_berlaku_awal : request.ijazah_berlaku_awal ? moment.utc(request.ijazah_berlaku_awal, "YYYY-MM-DD").toDate() : undefined,
                ijazah_berlaku_akhir : request.ijazah_berlaku_akhir ? moment.utc(request.ijazah_berlaku_akhir, "YYYY-MM-DD").toDate() : undefined,
                is_cv_selamanya : request.is_cv_selamanya === "true" ? true : false,
                cv_berlaku_awal : request.cv_berlaku_awal ? moment.utc(request.cv_berlaku_awal, "YYYY-MM-DD").toDate() : undefined,
                cv_berlaku_akhir : request.cv_berlaku_akhir ? moment.utc(request.cv_berlaku_akhir, "YYYY-MM-DD").toDate() : undefined,
                file_ktp : upload[0][0].file_name,
                file_cv : upload[0][1].file_name,
                file_ijazah : upload[0][2].file_name,
                encrypt_key_ktp : upload[0][0].keypass,
                encrypt_key_cv : upload[0][0].keypass,
                encrypt_key_ijazah : upload[0][0].keypass

            },{
                where : {
                    kode_tenaga_pendukung : id
                },
                returning : true,
            })

            if(tenagaPendukungUpd[0] === 0) throw new CustomError(httpCode.unprocessableEntity,responseStatus.error,"Gagal Update Tenaga Ahli")

            
            tenagaPendukung = {
                nama : tenagaPendukungUpd[1][0].nama,
                no_ktp : tenagaPendukungUpd[1][0].no_ktp,
                is_ktp_selamanya : tenagaPendukungUpd[1][0].is_ktp_selamanya,
                ktp_berlaku_awal : tenagaPendukungUpd[1][0].ktp_berlaku_awal,
                ktp_berlaku_akhir : tenagaPendukungUpd[1][0].ktp_berlaku_akhir,
                tempat_lahir : tenagaPendukungUpd[1][0].tempat_lahir,
                tgl_lahir : tenagaPendukungUpd[1][0].tgl_lahir,
                posisi : tenagaPendukungUpd[1][0].posisi,
                kode_jenjang_pendidikan : tenagaPendukungUpd[1][0].kode_jenjang_pendidikan,
                program_studi : tenagaPendukungUpd[1][0].program_studi,
                is_ijazah_selamanya : tenagaPendukungUpd[1][0].is_ijazah_selamanya,
                ijazah_berlaku_awal : tenagaPendukungUpd[1][0].ijazah_berlaku_awal,
                ijazah_berlaku_akhir : tenagaPendukungUpd[1][0].ijazah_berlaku_akhir,
                is_cv_selamanya : tenagaPendukungUpd[1][0].is_cv_selamanya,
                cv_berlaku_awal : tenagaPendukungUpd[1][0].cv_berlaku_awal,
                cv_berlaku_akhir : tenagaPendukungUpd[1][0].cv_berlaku_akhir,
                file_ktp : tenagaPendukungUpd[1][0].file_ktp,
                file_cv : tenagaPendukungUpd[1][0].file_cv,
                file_ijazah : tenagaPendukungUpd[1][0].file_ijazah,
            }
            
        }

        return tenagaPendukung

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

const getPdfUploadTenagaPendukungKtp = async (id:ParameterSchema["params"]["id"], kode_vendor:number) : Promise<any> => {
    try {
        const getPendukung : TenagaPendukung | null = await TenagaPendukung.findOne({
            where : {
                kode_vendor : kode_vendor,
                kode_tenaga_pendukung : id,       
            }
        })


        if(!getPendukung) throw new CustomError(httpCode.notFound, responseStatus.error, "Data Tidak Tersedia / Data Bukan Format PDF")

        const data = {
            nama_file : getPendukung?.file_ktp as string, 
            keypass : getPendukung.encrypt_key_ktp as string
        }


        const tampilGambar = await showFile(data)

        return tampilGambar[0]

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

const getPdfUploadTenagaPendukungCv = async (id:ParameterSchema["params"]["id"], kode_vendor:number) : Promise<any> => {
    try {
        const getPendukung : TenagaPendukung | null = await TenagaPendukung.findOne({
            where : {
                kode_vendor : kode_vendor,
                kode_tenaga_pendukung : id,       
            }
        })


        if(!getPendukung) throw new CustomError(httpCode.notFound, responseStatus.error, "Data Tidak Tersedia / Data Bukan Format PDF")

        const data = {
            nama_file : getPendukung?.file_cv as string, 
            keypass : getPendukung.encrypt_key_cv as string
        }


        const tampilGambar = await showFile(data)

        return tampilGambar[0]

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

const getPdfUploadTenagaPendukungIjazah = async (id:ParameterSchema["params"]["id"], kode_vendor:number) : Promise<any> => {
    try {
        const getPedukung : TenagaPendukung | null = await TenagaPendukung.findOne({
            where : {
                kode_vendor : kode_vendor,
                kode_tenaga_pendukung : id,       
            }
        })


        if(!getPedukung) throw new CustomError(httpCode.notFound, responseStatus.error, "Data Tidak Tersedia / Data Bukan Format PDF")

        const data = {
            nama_file : getPedukung?.file_ijazah as string, 
            keypass : getPedukung.encrypt_key_ijazah as string
        }


        const tampilGambar = await showFile(data)

        return tampilGambar[0]

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
// #####################################################################################

// ############################### Pengalaman TA ########################
const getAllPengalamanTa = async (id:ParameterSchema["params"]["id"]) : Promise<PengalamanTa[]> => {
    try {
        const getPengalaman : PengalamanTa[] = await PengalamanTa.findAll({
            where : {
                kode_tenaga_ahli : id
            },
            attributes : {exclude : ["encrypt_key"]}
        })

        return getPengalaman
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

const storePengalamanTA = async (request:PayloadPengalamanTaSchema["body"], file : Express.Multer.File[]) : Promise<any> => {
    try {
        const arr_pengalaman = []

        const exTenagaAhli = await TenagaAhli.findOne({
            where : {
                kode_tenaga_ahli : request.kode_tenaga_ahli
            }
        })

        if(!exTenagaAhli) throw new CustomError(httpCode.notFound, responseStatus.error, "Data Tenaga Ahli Tidak Ditemukan")

        const formData = new FormData()

        formData.append('nama_aplikasi','SI-DaPeT')
        file.map(files => formData.append('file', fs.createReadStream(files.path))) 
        const upload = await uploadPdfArray(formData)

        console.log("TES UPLOAD : ", upload)

        const panjangArray = request.pengalaman_data.length

        console.log(panjangArray)

        if(upload[1] !== null || !upload[0]){
            throw new CustomError(httpCode.badRequest, responseStatus.error, "Upload Gagal")
        }

        for(const [index, pengalaman_dat] of request.pengalaman_data.entries()) {
                

            const createPenglamanTA = await PengalamanTa.create({
                kode_tenaga_ahli : parseInt(request.kode_tenaga_ahli),
                pengalaman : pengalaman_dat.pengalaman,
                file_bukti : upload[0][index].file_name,
                encrypt_key : upload[0][index].keypass
            })


            if(!createPenglamanTA) {
            await deleteFile(upload[0].file_name)
            throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Terjadi Kesalahan Saat Store Data")
            }


            // if(createPenglamanTA) {
            //     // fs.unlinkSync(file.path)
            // }


            arr_pengalaman.push({
                "kode_tenaga_ahli" : createPenglamanTA.kode_tenaga_ahli,
                "pengalaman" : createPenglamanTA.pengalaman,
                "file_bukti" : createPenglamanTA.file_bukti
            })
        }

        if(arr_pengalaman.length > 0) {
            file.forEach(item => fs.unlinkSync(item.path))
        }

        return arr_pengalaman

    } catch (error) {
        debugLogger.debug(error)
        if(file.length > 0)
            file.forEach((files) => {
                if(files.path) fs.unlinkSync(files.path)
            })
        if(error instanceof CustomError) {
            throw new CustomError(error.code,error.status, error.message)
        } 
        else {
            debugLogger.debug(error)
            throw new CustomError(500, responseStatus.error, "Internal server error.")
        }
    }
}

const storePengalamanTASatuan = async (request:PayloadPengalamanTaSatuanSchema["body"], file : Express.Multer.File) => {
    try {
        const formData = new FormData()

        formData.append('nama_aplikasi','SI-DaPeT')
        formData.append('file', fs.createReadStream(file.path))

        const upload = await uploadPdf(formData)


        if(upload[1] !== null || !upload[0]){
            throw new CustomError(httpCode.badRequest, responseStatus.error, "Upload Gagal")
        }

        const create = await PengalamanTa.create({
            kode_tenaga_ahli : parseInt(request.kode_tenaga_ahli),
            pengalaman : request.pengalaman,
            file_bukti : upload[0].file_name,
            encrypt_key : upload[0].keypass
        })

        const result = {
            kode_tenaga_ahli : create.kode_tenaga_ahli,
            pengalaman : create.pengalaman,
            file_bukti : create.file_bukti,
        }

        if(!create) {
            await deleteFile(upload[0].file_name)
            throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Upload Gagal")
        }

        if(create) {
            fs.unlinkSync(file.path)
        }

        return result
    } catch (error) {
        debugLogger.debug(error)
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

const getPdfUploadPengalamanTa = async (id:ParameterSchema["params"]["id"], kode_vendor:number) : Promise<any> => {
    try {
        const getPengalaman : PengalamanTa | null = await PengalamanTa.findOne({
            where : {
                kode_pengalaman_ta : id,       
            }
        })


        if(!getPengalaman) throw new CustomError(httpCode.notFound, responseStatus.error, "Data Tidak Tersedia / Data Bukan Format PDF")

        const data = {
            nama_file : getPengalaman?.file_bukti as string, 
            keypass : getPengalaman.encrypt_key as string
        }


        const tampilGambar = await showFile(data)

        return tampilGambar[0]

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


// ######################################################################

// ############################### Pengalaman TP #######################
const getAllPengalamanTp = async (id:ParameterSchema["params"]["id"]) : Promise<PengalamanTp[]> => {
    try {
        const getPengalaman : PengalamanTp[] = await PengalamanTp.findAll({
            where : {
                kode_tenaga_pendukung : id
            },
            attributes : {exclude : ["encrypt_key"]}
        })

        return getPengalaman
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

const storePengalamanTP = async (request:PayloadPengalamanTpSchema["body"], file : Express.Multer.File[]) : Promise<any> => {
    try {
        const arr_pengalaman = []

        const exPengalamanTenagaPendukung = await TenagaPendukung.findOne({
            where : {
                kode_tenaga_pendukung : request.kode_tenaga_pendukung
            }
        })

        if(!exPengalamanTenagaPendukung) throw new CustomError(httpCode.notFound, responseStatus.error, "Data Tenaga Pendukung Tidak Ditemukan")

        const formData = new FormData()

        formData.append('nama_aplikasi','SI-DaPeT')
        file.map(files => formData.append('file', fs.createReadStream(files.path))) 
        const upload = await uploadPdfArray(formData)

        console.log("TES : ", file)

        if(upload[1] !== null || !upload[0]){
            throw new CustomError(httpCode.badRequest, responseStatus.error, "Upload Gagal")
        }

        for(const [index, pengalaman_dat] of request.pengalaman_data.entries()) {
                

            const createPenglamanTA = await PengalamanTp.create({
                kode_tenaga_pendukung : parseInt(request.kode_tenaga_pendukung),
                pengalaman : pengalaman_dat.pengalaman,
                file_bukti : upload[0][index].file_name,
                encrypt_key : upload[0][index].keypass
            })


            if(!createPenglamanTA) {
            await deleteFile(upload[0].file_name)
            throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Terjadi Kesalahan Saat Store Data")
            }


            // if(createPenglamanTA) {
            //     console.log("gagal hapus")
            //     if(file.length > 0)
            //     file.map((files) => {
            //         console.log(files)
            //         if(files.path) fs.unlinkSync(files.path)
            //     })
            // }


            arr_pengalaman.push({
                "kode_tenaga_pendukung" : createPenglamanTA.kode_tenaga_pendukung,
                "pengalaman" : createPenglamanTA.pengalaman,
                "file_bukti" : createPenglamanTA.file_bukti
            })
        }

        if(arr_pengalaman.length > 0) {
            file.forEach(item => fs.unlinkSync(item.path))
        }

        return arr_pengalaman

    } catch (error) {
        debugLogger.debug(error)
        if(file.length > 0)
            file.map((files) => {
                if(files.path) fs.unlinkSync(files.path)
            })
        // file.map(files => fs.unlinkSync(files.path))
        if(error instanceof CustomError) {
            throw new CustomError(error.code,error.status, error.message)
        } 
        else {
            debugLogger.debug(error)
            throw new CustomError(500, responseStatus.error, "Internal server error.")
        }
    }
}

const storePengalamanTPSatuan = async (request:PayloadPengalamaTpSatuanSchema["body"], file : Express.Multer.File) => {
    try {
        const formData = new FormData()

        formData.append('nama_aplikasi','SI-DaPeT')
        formData.append('file', fs.createReadStream(file.path))

        const upload = await uploadPdf(formData)


        if(upload[1] !== null || !upload[0]){
            throw new CustomError(httpCode.badRequest, responseStatus.error, "Upload Gagal")
        }

        const create = await PengalamanTp.create({
            kode_tenaga_pendukung : parseInt(request.kode_tenaga_pendukung),
            pengalaman : request.pengalaman,
            file_bukti : upload[0].file_name,
            encrypt_key : upload[0].keypass
        })

        const result = {
            kode_tenaga_pendukung : create.kode_tenaga_pendukung,
            pengalaman : create.pengalaman,
            file_bukti : create.file_bukti,
        }

        if(!create) {
            await deleteFile(upload[0].file_name)
            throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Upload Gagal")
        }

        if(create) {
            fs.unlinkSync(file.path)
        }

        return result
    } catch (error) {
        debugLogger.debug(error)
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

const getPdfUploadPengalamanTp = async (id:ParameterSchema["params"]["id"], kode_vendor:number) : Promise<any> => {
    try {
        const getPengalaman : PengalamanTp | null = await PengalamanTp.findOne({
            where : {
                kode_pengalaman_tp : id,       
            }
        })


        if(!getPengalaman) throw new CustomError(httpCode.notFound, responseStatus.error, "Data Tidak Tersedia / Data Bukan Format PDF")

        const data = {
            nama_file : getPengalaman?.file_bukti as string, 
            keypass : getPengalaman.encrypt_key as string
        }


        const tampilGambar = await showFile(data)

        return tampilGambar[0]

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

// #####################################################################

// ################################# SERTIFIKAT TA ########################
const getAllSertifikatTa = async (id:ParameterSchema["params"]["id"]) : Promise<SertifTA[]> => {
    try {
        const getSertifikat : SertifTA[] = await SertifTA.findAll({
            where : {
                kode_tenaga_ahli : id
            },
            attributes : {exclude : ["encrypt_key"]}
        })

        return getSertifikat
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

const storeSertifTa = async (request:PayloadSertifikatTASchema["body"], file : Express.Multer.File[]) : Promise<any> => {
    try {
        const arr_sertifikat = []

        const exTenagaAhli = await TenagaAhli.findOne({
            where : {
                kode_tenaga_ahli : request.kode_tenaga_ahli
            }
        })

        if(!exTenagaAhli) throw new CustomError(httpCode.notFound, responseStatus.error, "Data Tenaga Ahli Tidak Ditemukan")

        const formData = new FormData()

        formData.append('nama_aplikasi','SI-DaPeT')
        file.map(files => formData.append('file', fs.createReadStream(files.path))) 
        const upload = await uploadPdfArray(formData)

        const panjangArray = request.sertifikat_data.length

        console.log(panjangArray)

        if(upload[1] !== null || !upload[0]){
            throw new CustomError(httpCode.badRequest, responseStatus.error, "Upload Gagal")
        }

        for(const [index, sertifikat_dat] of request.sertifikat_data.entries()) {
                

            const createSertifTA = await SertifTA.create({
                kode_tenaga_ahli : parseInt(request.kode_tenaga_ahli),
                sertifikat : sertifikat_dat.sertifikat,
                file_bukti : upload[0][index].file_name,
                encrypt_key : upload[0][index].keypass
            })


            if(!createSertifTA) {
            await deleteFile(upload[0].file_name)
            throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Terjadi Kesalahan Saat Store Data")
            }


            arr_sertifikat.push({
                "kode_tenaga_ahli" : createSertifTA.kode_tenaga_ahli,
                "pengalaman" : createSertifTA.sertifikat,
                "file_bukti" : createSertifTA.file_bukti
            })
        }

        if(arr_sertifikat.length > 0) {
            file.forEach(item => fs.unlinkSync(item.path))
        }

        return arr_sertifikat

    } catch (error) {
        debugLogger.debug(error)
        if(file.length > 0)
            console.log("TES KAH")
            file.map((files) => {
                if(files.path) fs.unlinkSync(files.path)
            })
        if(error instanceof CustomError) {
            throw new CustomError(error.code,error.status, error.message)
        } 
        else {
            debugLogger.debug(error)
            throw new CustomError(500, responseStatus.error, "Internal server error.")
        }
    }
}

const storeSertifikatTASatuan = async (request:PayloadSertifikatTASatuanSchema["body"], file : Express.Multer.File) => {
    try {
        const formData = new FormData()

        formData.append('nama_aplikasi','SI-DaPeT')
        formData.append('file', fs.createReadStream(file.path))

        const upload = await uploadPdf(formData)


        if(upload[1] !== null || !upload[0]){
            throw new CustomError(httpCode.badRequest, responseStatus.error, "Upload Gagal")
        }

        const create = await SertifTA.create({
            kode_tenaga_ahli : parseInt(request.kode_tenaga_ahli),
            sertifikat : request.sertifikat,
            file_bukti : upload[0].file_name,
            encrypt_key : upload[0].keypass
        })

        const result = {
            kode_tenaga_ahli : create.kode_tenaga_ahli,
            sertifikat : create.sertifikat,
            file_bukti : create.file_bukti,
        }

        if(!create) {
            await deleteFile(upload[0].file_name)
            throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Upload Gagal")
        }

        if(create) {
            fs.unlinkSync(file.path)
        }

        return result
    } catch (error) {
        debugLogger.debug(error)
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

const getPdfUploadSertifikatTa = async (id:ParameterSchema["params"]["id"], kode_vendor:number) : Promise<any> => {
    try {
        const getSertifikat : SertifTA | null = await SertifTA.findOne({
            where : {
                kode_sertif_ta : id,       
            }
        })


        if(!getSertifikat) throw new CustomError(httpCode.notFound, responseStatus.error, "Data Tidak Tersedia / Data Bukan Format PDF")

        const data = {
            nama_file : getSertifikat?.file_bukti as string, 
            keypass : getSertifikat.encrypt_key as string
        }


        const tampilGambar = await showFile(data)

        return tampilGambar[0]

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

// ########################################################################


// ################################# Sertifikat TP #########################
const getAllSertifikatTp = async (id:ParameterSchema["params"]["id"]) : Promise<SertifTP[]> => {
    try {
        const getSertifikat : SertifTP[] = await SertifTP.findAll({
            where : {
                kode_tenaga_pendukung : id
            },
            attributes : {exclude : ["encrypt_key"]}
        })

        return getSertifikat
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

const storeSertifTP = async (request:PayloadSertifikatTPSchema["body"], file : Express.Multer.File[]) : Promise<any> => {
    try {
        const arr_sertifikat = []

        const exTenagaPendukung = await TenagaPendukung.findOne({
            where : {
                kode_tenaga_pendukung : request.kode_tenaga_pendukung
            }
        })

        if(!exTenagaPendukung) throw new CustomError(httpCode.notFound, responseStatus.error, "Data Tenaga Pendukung Tidak Ditemukan")

        const formData = new FormData()

        formData.append('nama_aplikasi','SI-DaPeT')
        file.map(files => formData.append('file', fs.createReadStream(files.path))) 
        const upload = await uploadPdfArray(formData)

        const panjangArray = request.sertifikat_data.length

        console.log(panjangArray)

        if(upload[1] !== null || !upload[0]){
            throw new CustomError(httpCode.badRequest, responseStatus.error, "Upload Gagal")
        }

        for(const [index, sertifikat_dat] of request.sertifikat_data.entries()) {
                

            const createSertifTP = await SertifTP.create({
                kode_tenaga_pendukung : parseInt(request.kode_tenaga_pendukung),
                sertifikat : sertifikat_dat.sertifikat,
                file_bukti : upload[0][index].file_name,
                encrypt_key : upload[0][index].keypass
            })


            if(!createSertifTP) {
            await deleteFile(upload[0].file_name)
            throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Terjadi Kesalahan Saat Store Data")
            }


            // if(createSertifTA) {
            //     // fs.unlinkSync(file.path)
            // }


            arr_sertifikat.push({
                "kode_tenaga_pendukung" : createSertifTP.kode_tenaga_pendukung,
                "pengalaman" : createSertifTP.sertifikat,
                "file_bukti" : createSertifTP.file_bukti
            })
        }

        if(arr_sertifikat.length > 0) {
            file.forEach(item => fs.unlinkSync(item.path))
        }

        return arr_sertifikat

    } catch (error) {
        debugLogger.debug(error)
        file.map(files => fs.unlinkSync(files.path))
        if(error instanceof CustomError) {
            throw new CustomError(error.code,error.status, error.message)
        } 
        else {
            debugLogger.debug(error)
            throw new CustomError(500, responseStatus.error, "Internal server error.")
        }
    }
}

const storeSertifikatTPSatuan = async (request:PayloadSertifikatTPSatuanSchema["body"], file : Express.Multer.File) => {
    try {
        const formData = new FormData()

        formData.append('nama_aplikasi','SI-DaPeT')
        formData.append('file', fs.createReadStream(file.path))

        const upload = await uploadPdf(formData)


        if(upload[1] !== null || !upload[0]){
            throw new CustomError(httpCode.badRequest, responseStatus.error, "Upload Gagal")
        }

        const create = await SertifTP.create({
            kode_tenaga_pendukung : parseInt(request.kode_tenaga_pendukung),
            sertifikat : request.sertifikat,
            file_bukti : upload[0].file_name,
            encrypt_key : upload[0].keypass
        })

        const result = {
            kode_tenaga_pendukung : create.kode_tenaga_pendukung,
            sertifikat : create.sertifikat,
            file_bukti : create.file_bukti,
        }

        if(!create) {
            await deleteFile(upload[0].file_name)
            throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Upload Gagal")
        }

        if(create) {
            fs.unlinkSync(file.path)
        }

        return result
    } catch (error) {
        debugLogger.debug(error)
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

const getPdfUploadSertifikatTp = async (id:ParameterSchema["params"]["id"], kode_vendor:number) : Promise<any> => {
    try {
        const getSertifikat : SertifTP | null = await SertifTP.findOne({
            where : {
                kode_sertif_tp : id,       
            }
        })


        if(!getSertifikat) throw new CustomError(httpCode.notFound, responseStatus.error, "Data Tidak Tersedia / Data Bukan Format PDF")

        const data = {
            nama_file : getSertifikat?.file_bukti as string, 
            keypass : getSertifikat.encrypt_key as string
        }


        const tampilGambar = await showFile(data)

        return tampilGambar[0]

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

// #######################################################################

// ################################ Badan Usaha ##########################



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
    hapusProfil,
    tesDomisili,
    getProfilVendor,
    domisili,
    storeUploadSertifikat,
    uploadPengalamanOrang,
    getMenuStatus,
    hapusSertifikat,
    hapusPengalaman,
    hapusUploadProfil,
    getPengalamanVendor,
    getSertifikat,
    getPdfUpload,
    getPdfUploadSertifikat,
    getPdfUploadPengalamanPerorangan,

    //BADAN USAHA
        //Komisaris 
    getKomisarisVendor,
    listPertanyaanBadanUsaha,
    storeUploadKomisaris,
    hapusKomisaris,
    getPdfUploadKomisaris,
    updateKomisaris,
        //Direksi 
    getDireksiVendor,
    storeUploadDireksi,
    hapusDireksi,
    getPdfUploadDireksi,
    updateDireksi,

    //Ijin Usaha
    getIjinUsaha,
    storeIjinUsaha,
    hapusIjinUsaha,
    getPdfUploadIjinUsaha,
    updateIjinUsaha,

    //SahamPerusahaan 
    getSahamPerusahaan,
    storeSahamPerusahaan,
    hapusSahamPerusahaan,
    getPdfUploadSahamPerusahaan,
    updateSahamPerusahaan,

    //Personalia 
    getPersonalia,
    storePersonalia,
    hapusPersonalia,
    getPdfUploadPersonalia,
    updatePersonalia,

    //Fasilitas 
    getFasilitas,
    storeFasilitas,
    hapusFasilitas,
    getPdfUploadFasilitasKepemilikan,
    getPdfUploadFasilitasFoto,
    updateFasilitas,

    //Pengalaman
    getPengalaman,
    storePengalaman,
    hapusPengalamanBadanUsaha,
    getPdfUploadPengalamanKontrak,
    getPdfUploadPengalamanBast,
    updatePengalaman,

    //Pengalaman Sekarang
    getPengalamanSekarang,
    storePengalamanSekarang,
    hapusPengalamanSekarangBadanUsaha,
    getPdfUploadPengalamanSekarang,
    updatePengalamanSekarang,
    
    //Kantor 
    getKantor,
    storeKantor,
    hapusKantor,
    getPdfUploadKantor,
    updateKantor,

    //Tenaga Ahli 
    getTenagaAhli,
    storeTenagaAhli,
    hapusTenagaAhli,
    updateTenagaAhli,
    getPdfUploadTenagaAhliKtp,
    getPdfUploadTenagaAhliCv,
    getPdfUploadTenagaAhliIjazah,

    //TenagaPendukung
    getTenagaPendukung,
    storeTenagaPendukung,
    hapusTenagaPendukung,
    updateTenagaPendukung,
    getPdfUploadTenagaPendukungKtp,
    getPdfUploadTenagaPendukungCv,
    getPdfUploadTenagaPendukungIjazah,

    //Pengalaman TA
    storePengalamanTA,
    storePengalamanTASatuan,
    getPdfUploadPengalamanTa,
    getAllPengalamanTa,

    //Pengalaman TP
    getAllPengalamanTp,
    storePengalamanTPSatuan,
    storePengalamanTP,
    getPdfUploadPengalamanTp,

    //Sertifikat TA
    getAllSertifikatTa,
    storeSertifikatTASatuan,
    storeSertifTa,
    getPdfUploadSertifikatTa,

    //Sertifikat TP
    getAllSertifikatTp,
    storeSertifTP,
    getPdfUploadSertifikatTp,
    storeSertifikatTPSatuan


}