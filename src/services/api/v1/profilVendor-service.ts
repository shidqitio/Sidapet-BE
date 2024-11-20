import getConfig from "@config/dotenv";
import CustomError from "@middleware/error-handler";
import logger, { errorLogger, debugLogger } from "@config/logger";
import { httpCode, responseStatus } from "@utils/prefix";
import db from "@config/database";
import {uploadPdf, deleteFile} from "@services/pdf_upload"
import { showFile } from "@services/pdf_show";

//Import Model
import JenisVendor from "@models/jenisVendor-model";
import KatDokumenVendor from "@models/katDokumenVendor-model";
import KatItemTanya from "@models/katItemTanya-model";
import ItemTanya from "@models/itemTanya-model";
import Domisili from "@models/domisili-model";
import TrxKatDokKomplit from "@models/trxKatDokKomplit-model";
import SertifPerorangan from "@models/sertifPerorangan-model";
import PengalamanPerorangan from "@models/pengalamanPerorangan-model";
import RegisterVendor from "@models/registerVendor-model";
import KomisarisPerusahaan from "@models/komisarisPerusahaan-model";
import DireksiPerusahaan from "@models/direksiPerusahaan-model";
import IjinUsahaPerusahaan from "@models/ijinUsahaPerusahaan-model";
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
    PayloadPengalamanSekarangUpdateSchema
} from "@schema/api/profilVendor-schema"

import { QueryTypes, Sequelize } from "sequelize";
import sequelize from "sequelize";
import TrxJawabProfil, { TrxJawabProfilOutput } from "@models/trxJawabProfil-model";
import { Op } from "sequelize";
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

                    console.log("COBA DATA ", callNamaTabel[0].tabel)

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
                        console.log(cekDataquery)
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

        console.log("TES ARRAY :", arrBerhasil);
        


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

        console.log(unsansweredItems)

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
        console.log(error);
        console.log("TES : ", file.path)
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
                            attributes : ["kode_item", "kode_kat_item_tanya", "urutan", "nama_item", "tipe_input", "keterangan", "nama_unik", "jenis_item", "is_required"],
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
        console.log(kode_vendor)
        
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

//Upload Sertifikat
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
        },
        {
            returning : ["kode_vendor", "nm_sertif_orang", "path_sertif","kode_sertif"]
        })

        const result = {
            kode_vendor : kode_vendor,
            nm_sertif_orang : create.nm_sertif_orang,
            path_sertif : create.path_sertif
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
        }, 
        {
            returning : ["kode_vendor", "nm_pnglmn_org","path_pnglmn","kode_pengalaman"]
        })

        const result = {
            kode_vendor : kode_vendor, 
            nm_pengalaman_org : create.nm_pnglmn_org,
            path_pnglmn : create.path_pnglmn, 
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


        if(hapusFile[1] !== null) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Gagal Hapus File")

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


        if(hapusFile[1] !== null) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Gagal Hapus File")

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

//Get PDF SERTIFIKAT
const getPdfUploadSertifikat = async (id:ParameterSchema["params"]["id"], kode_vendor:number) : Promise<any> => {
    try {
        const getSertifikat = await SertifPerorangan.findOne({
            where : {
                kode_vendor : kode_vendor,
                kode_sertif : id,
                encrypt_key : {
                    [Op.not] : null
                }
            }
        })

        if(!getSertifikat) throw new CustomError(httpCode.notFound, responseStatus.error, "Data Tidak Tersedia / Data Bukan Format PDF")

        const data = {
            nama_file : getSertifikat.path_sertif as string, 
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


//Get PDF SERTIFIKAT
const getPdfUploadPengalamanPerorangan = async (id:ParameterSchema["params"]["id"], kode_vendor:number) : Promise<any> => {
    try {
        const getPengalaman = await PengalamanPerorangan.findOne({
            where : {
                kode_vendor : kode_vendor,
                kode_pengalaman : id,
                encrypt_key : {
                    [Op.not] : null
                }
            }
        })        

        if(!getPengalaman) throw new CustomError(httpCode.notFound, responseStatus.error, "Data Tidak Tersedia / Data Bukan Format PDF")

        const data = {
            nama_file : getPengalaman.path_pnglmn as string, 
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
                            attributes : ["kode_item", "kode_kat_item_tanya", "urutan", "nama_item", "tipe_input", "keterangan", "nama_unik", "jenis_item", "is_required"],
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
            throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Upload Gagal")
        }

        const create = await KomisarisPerusahaan.create({
            kode_vendor : kode_vendor,
            nm_komisaris : request.nm_komisaris,
            jbtn_komisaris : request.jbtn_komisaris,
            hp_komisaris : request.hp_komisaris,
            no_ktp_komisaris : request.no_ktp_komisaris,
            path_ktp_komisaris : upload[0].file_name,
            encrypt_key : upload[0].keypass
        })

        const result = {
            kode_vendor : kode_vendor,
            nm_komisaris : request.nm_komisaris,
            jbtn_komisaris : request.jbtn_komisaris,
            hp_komisaris : request.hp_komisaris,
            no_ktp_komisaris : request.no_ktp_komisaris,
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

           await exKomisaris.save()
           komisarisUpdate = {
            nm_komisaris    : request.nm_komisaris,
            jbtn_komisaris  : request.jbtn_komisaris,
            hp_komisaris    : request.hp_komisaris,
            no_ktp_komisaris: request.no_ktp_komisaris,
        }
        }

        else {
            await deleteFile(exKomisaris.path_ktp_komisaris as string)

            const formData = new FormData()

            formData.append('nama_aplikasi','SI-DaPeT')
            formData.append('file', fs.createReadStream(file.path))
    
            const upload = await uploadPdf(formData)
    
    
            if(upload[1] !== null || !upload[0]){
                throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Upload Gagal")
            }

            let komisarisUpd = await KomisarisPerusahaan.update({
                nm_komisaris      : request.nm_komisaris,
                jbtn_komisaris    : request.jbtn_komisaris,
                hp_komisaris      : request.hp_komisaris,
                no_ktp_komisaris  : request.no_ktp_komisaris,
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
            throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Upload Gagal")
        }

        const create = await DireksiPerusahaan.create({
            kode_vendor : kode_vendor,
            nm_direksi : request.nm_direksi,
            jbtn_direksi : request.jbtn_direksi,
            hp_direksi : request.hp_direksi,
            no_ktp_direksi : request.no_ktp_direksi,
            path_ktp_direksi : upload[0].file_name,
            encrypt_key : upload[0].keypass
        })

        const result = {
            kode_vendor : kode_vendor,
            nm_direksi : request.nm_direksi,
            jbtn_direksi : request.jbtn_direksi,
            hp_direksi : request.hp_direksi,
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

            await exDireksi.save()

            direksiUpdate = {
                nm_direksi : request.nm_direksi,
                jbtn_direksi :  request.jbtn_direksi,
                hp_direksi :  request.hp_direksi,
                no_ktp_direksi :  request.no_ktp_direksi,
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
                throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Upload Gagal")
            }

            let direksiUpd = await DireksiPerusahaan.update({
                nm_direksi : request.nm_direksi,
                jbtn_direksi : request.jbtn_direksi,
                hp_direksi : request.hp_direksi,
                no_ktp_direksi : request.no_ktp_direksi,
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
            throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Upload Gagal")
        }

        const create = await IjinUsahaPerusahaan.create({
            kode_vendor : kode_vendor,
            nama_izin : request.nama_izin,
            no_izin : request.no_izin,
            masa_izin : request.masa_izin,
            pemberi_izin : request.pemberi_izin,
            kualifikasi_usaha : request.kualifikasi_usaha, 
            klasifikasi_usaha : request.klasifikasi_usaha, 
            tdp : request.tdp, 
            path_izin : upload[0].file_name,
            encrypt_key : upload[0].keypass 
        })

        const result = {
            kode_vendor : kode_vendor,
            nama_izin : request.nama_izin,
            no_izin : request.no_izin,
            masa_izin : request.masa_izin,
            pemberi_izin : request.pemberi_izin,
            kualifikasi_usaha : request.kualifikasi_usaha, 
            klasifikasi_usaha : request.klasifikasi_usaha, 
            tdp : request.tdp, 
            path_izin : upload[0].file_name,
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
                kode_ijin_usaha : id
            },
            attributes : {exclude : ["encrypt_key"]}
        })

        if(!exIjinUsaha) throw new CustomError(httpCode.notFound, responseStatus.success, "Data Ijin Usaha Tidak Ada")
            

        const hapusFile = await deleteFile(exIjinUsaha.path_izin as string)

        if(hapusFile[1] !== null) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Gagal Hapus File")

        const hapusData = await IjinUsahaPerusahaan.destroy({
            where : {
                kode_ijin_usaha : id
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
                kode_ijin_usaha : id,
                encrypt_key : {
                    [Op.not] : null
                }
            }
        })


        if(!getIjinUsaha) throw new CustomError(httpCode.notFound, responseStatus.error, "Data Tidak Tersedia / Data Bukan Format PDF")

        const data = {
            nama_file : getIjinUsaha.path_izin as string, 
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

        let direksiIjinUsaha

        if(!file) {
           exIjinUsaha.nama_izin         = request.nama_izin,
           exIjinUsaha.no_izin           = request.no_izin,
           exIjinUsaha.masa_izin         = request.masa_izin,
           exIjinUsaha.pemberi_izin      = request.pemberi_izin,
           exIjinUsaha.kualifikasi_usaha = request.kualifikasi_usaha,
           exIjinUsaha.klasifikasi_usaha = request.klasifikasi_usaha,
           exIjinUsaha.tdp               = request.tdp,

            await exIjinUsaha.save()

            direksiIjinUsaha = {
                nama_izin        : request.nama_izin,
                no_izin          : request.no_izin,
                masa_izin        : request.masa_izin,
                pemberi_izin     : request.pemberi_izin,
                kualifikasi_usaha: request.kualifikasi_usaha,
                klasifikasi_usaha: request.klasifikasi_usaha,
                tdp              : request.tdp,
            }
        }

        else {
            await deleteFile(exIjinUsaha.path_izin as string)

            const formData = new FormData()

            formData.append('nama_aplikasi','SI-DaPeT')
            formData.append('file', fs.createReadStream(file.path))
    
            const upload = await uploadPdf(formData)
    
            console.log(upload)

            if(upload[1] !== null || !upload[0]){
                throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Upload Gagal")
            }

            let ijinUsahaUpd = await IjinUsahaPerusahaan.update({
                nama_izin        : request.nama_izin,
                no_izin          : request.no_izin,
                masa_izin        : request.masa_izin,
                pemberi_izin     : request.pemberi_izin,
                kualifikasi_usaha: request.kualifikasi_usaha,
                klasifikasi_usaha: request.klasifikasi_usaha,
                tdp              : request.tdp,
                path_izin        : upload[0].file_name,
                encrypt_key      : upload[0].keypass
            },{
                where : {
                    kode_ijin_usaha : id
                },
                returning : true,
            })

            console.log(ijinUsahaUpd)

            if(ijinUsahaUpd[0] === 0) throw new CustomError(httpCode.unprocessableEntity,responseStatus.error,"Gagal Update Ijin Usaha")

                direksiIjinUsaha = {
                    nama_izin        : ijinUsahaUpd[1][0].nama_izin,
                    no_izin          : ijinUsahaUpd[1][0].no_izin,
                    masa_izin        : ijinUsahaUpd[1][0].masa_izin,
                    pemberi_izin     : ijinUsahaUpd[1][0].pemberi_izin,
                    kualifikasi_usaha: ijinUsahaUpd[1][0].kualifikasi_usaha,
                    klasifikasi_usaha: ijinUsahaUpd[1][0].klasifikasi_usaha,
                    tdp              : ijinUsahaUpd[1][0].tdp,
                    path_izin        : ijinUsahaUpd[1][0].path_izin,
                }
        }

        return direksiIjinUsaha
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
            throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Upload Gagal")
        }

        const create = await SahamPerusahaan.create({
            kode_vendor : kode_vendor,
            nm_saham : request.nm_saham,
            no_ktp_saham : request.no_ktp_saham,
            alamat_saham : request.alamat_saham,
            persentase_saham : request.persentase_saham,
            path_saham : upload[0].file_name,
            encrypt_key : upload[0].keypass 
        })

        const result = {
            kode_vendor : kode_vendor,
            nm_saham : request.nm_saham,
            no_ktp_saham : request.no_ktp_saham,
            alamat_saham : request.alamat_saham,
            persentase_saham : request.persentase_saham,
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

            await exSahamPerusahaan.save()

            sahamPerusahaan = {
                nm_saham        : request.nm_saham,
                no_ktp_saham    : request.no_ktp_saham,
                alamat_saham    : request.alamat_saham,
                persentase_saham: request.persentase_saham,
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
                throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Upload Gagal")
            }

            let sahamPerusahaanUpd = await SahamPerusahaan.update({
                nm_saham        : request.nm_saham,
                no_ktp_saham    : request.no_ktp_saham,
                alamat_saham    : request.alamat_saham,
                persentase_saham: request.persentase_saham,
                path_saham      : upload[0].file_name,
                encrypt_key     : upload[0].keypass
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
            throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Upload Gagal")
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
                throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Upload Gagal")
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
            attributes : {exclude : ["encrypt_key"]}
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

const storeFasilitas = async (request:PayloadFasilitasSchema["body"], kode_vendor : number, file : Express.Multer.File) : Promise<any> => {
    try {
        const formData = new FormData()

        formData.append('nama_aplikasi','SI-DaPeT')
        formData.append('file', fs.createReadStream(file.path))

        const upload = await uploadPdf(formData)


        if(upload[1] !== null || !upload[0]){
            throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Upload Gagal")
        }

        const create = await FasilitasPerusahaan.create({
            kode_vendor : kode_vendor,
            nm_fasilitas : request.nm_fasilitas,
            jumlah_fasilitas : request.jumlah_fasilitas,
            fasilitas_now : request.fasilitas_now,
            merk_fasilitas : request.merk_fasilitas,
            tahun_fasilitas : request.tahun_fasilitas,
            kondisi_fasilitas : request.kondisi_fasilitas,
            lokasi_fasilitas : request.lokasi_fasilitas,
            path_fasilitas : upload[0].file_name,
            encrypt_key : upload[0].keypass 
        })

        const result = {
            kode_vendor : kode_vendor,
            nm_fasilitas : request.nm_fasilitas,
            jumlah_fasilitas : request.jumlah_fasilitas,
            fasilitas_now : request.fasilitas_now,
            merk_fasilitas : request.merk_fasilitas,
            tahun_fasilitas : request.tahun_fasilitas,
            kondisi_fasilitas : request.kondisi_fasilitas,
            lokasi_fasilitas : request.lokasi_fasilitas,
            path_fasilitas : upload[0].file_name,
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

const hapusFasilitas = async (id:ParameterSchema["params"]["id"]) : Promise<FasilitasPerusahaan> => {
    try {
        const exFasilitas = await FasilitasPerusahaan.findOne({
            where : {
                kode_peralatan : id
            },
            attributes : {exclude : ["encrypt_key"]}
        })

        if(!exFasilitas) throw new CustomError(httpCode.notFound, responseStatus.success, "Data Fasilitas Perusahaan Tidak Ada")
            

        const hapusFile = await deleteFile(exFasilitas.path_fasilitas as string)

        if(hapusFile[1] !== null) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Gagal Hapus File")

        const hapusData = await FasilitasPerusahaan.destroy({
            where : {
                kode_peralatan : id
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

const getPdfUploadFasilitas = async (id:ParameterSchema["params"]["id"], kode_vendor:number) : Promise<any> => {
    try {
        const getFasilitas = await FasilitasPerusahaan.findOne({
            where : {
                kode_vendor : kode_vendor,
                kode_peralatan : id,
                encrypt_key : {
                    [Op.not] : null
                }
            }
        })


        if(!getFasilitas) throw new CustomError(httpCode.notFound, responseStatus.error, "Data Tidak Tersedia / Data Bukan Format PDF")

        const data = {
            nama_file : getFasilitas?.path_fasilitas as string, 
            keypass : getFasilitas.encrypt_key as string
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
     file : Express.Multer.File) : Promise<any> => {
    try {
        const exFasilitas = await FasilitasPerusahaan.findByPk(id)

        if(!exFasilitas) throw new CustomError(httpCode.notFound, responseStatus.success, "Fasilitas Tidak Tersedia")

        let fasilitas

        if(!file) {
           exFasilitas.nm_fasilitas      = request.nm_fasilitas,
           exFasilitas.jumlah_fasilitas  = request.jumlah_fasilitas,
           exFasilitas.fasilitas_now     = request.fasilitas_now,
           exFasilitas.merk_fasilitas    = request.merk_fasilitas,
           exFasilitas.tahun_fasilitas   = request.tahun_fasilitas,
           exFasilitas.kondisi_fasilitas = request.kondisi_fasilitas,
           exFasilitas.lokasi_fasilitas  = request.lokasi_fasilitas

            await exFasilitas.save()

            fasilitas = {
                nm_fasilitas     : request.nm_fasilitas,
                jumlah_fasilitas : request.jumlah_fasilitas,
                fasilitas_now    : request.fasilitas_now,
                merk_fasilitas   : request.merk_fasilitas,
                tahun_fasilitas  : request.tahun_fasilitas,
                kondisi_fasilitas: request.kondisi_fasilitas,
                lokasi_fasilitas : request.lokasi_fasilitas
            }
        }

        else {
            await deleteFile(exFasilitas.path_fasilitas as string)

            const formData = new FormData()

            formData.append('nama_aplikasi','SI-DaPeT')
            formData.append('file', fs.createReadStream(file.path))
    
            const upload : any = await uploadPdf(formData)
    
            console.log(upload)

            if(upload[1] !== null || !upload[0]){
                throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Upload Gagal")
            }

            let fasilitasUpd = await FasilitasPerusahaan.update({
                nm_fasilitas     : request.nm_fasilitas,
                jumlah_fasilitas : request.jumlah_fasilitas,
                fasilitas_now    : request.fasilitas_now,
                merk_fasilitas   : request.merk_fasilitas,
                tahun_fasilitas  : request.tahun_fasilitas,
                kondisi_fasilitas: request.kondisi_fasilitas,
                lokasi_fasilitas : request.lokasi_fasilitas,
                path_fasilitas   : upload[0].file_name,
                encrypt_key      : upload[0].keypass
            },{
                where : {
                    kode_peralatan : id
                },
                returning : true,
            })

            console.log(fasilitasUpd)

            if(fasilitasUpd[0] === 0) throw new CustomError(httpCode.unprocessableEntity,responseStatus.error,"Gagal Update Fasilitas")

                fasilitas = {
                 nm_fasilitas    :fasilitasUpd[1][0].nm_fasilitas,
                 jumlah_fasilitas    :fasilitasUpd[1][0].jumlah_fasilitas,
                 fasilitas_now    :fasilitasUpd[1][0].fasilitas_now,
                 merk_fasilitas    :fasilitasUpd[1][0].merk_fasilitas,
                 tahun_fasilitas    :fasilitasUpd[1][0].tahun_fasilitas,
                 kondisi_fasilitas    :fasilitasUpd[1][0].kondisi_fasilitas,
                 lokasi_fasilitas    :fasilitasUpd[1][0].lokasi_fasilitas,
                 path_fasilitas    :fasilitasUpd[1][0].path_fasilitas,
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

const storePengalaman = async (request:PayloadPengalamanSchema["body"], kode_vendor : number, file : Express.Multer.File) : Promise<any> => {
    try {
        const formData = new FormData()

        formData.append('nama_aplikasi','SI-DaPeT')
        formData.append('file', fs.createReadStream(file.path))

        const upload = await uploadPdf(formData)


        if(upload[1] !== null || !upload[0]){
            throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Upload Gagal")
        }

        const create = await Pengalaman.create({
            kode_vendor : kode_vendor,
            nm_pnglmn : request.nm_pnglmn,
            div_pnglmn : request.div_pnglmn,
            ringkas_pnglmn : request.ringkas_pnglmn,
            lok_pnglmn : request.lok_pnglmn,
            pemberi_pnglmn : request.pemberi_pnglmn,
            alamat_pnglmn : request.alamat_pnglmn,
            tgl_pnglmn : request.tgl_pnglmn,
            nilai_pnglmn : request.nilai_pnglmn,
            status_pnglmn : request.status_pnglmn,
            tgl_selesai_pnglmn : request.tgl_selesai_pnglmn,
            ba_pnglmn : request.ba_pnglmn,
            path_pnglmn : upload[0].file_name,
            encrypt_key : upload[0].keypass 
        })

        const result = {
            kode_vendor : kode_vendor,
            nm_pnglmn : request.nm_pnglmn,
            div_pnglmn : request.div_pnglmn,
            ringkas_pnglmn : request.ringkas_pnglmn,
            lok_pnglmn : request.lok_pnglmn,
            pemberi_pnglmn : request.pemberi_pnglmn,
            alamat_pnglmn : request.alamat_pnglmn,
            tgl_pnglmn : request.tgl_pnglmn,
            nilai_pnglmn : request.nilai_pnglmn,
            status_pnglmn : request.status_pnglmn,
            tgl_selesai_pnglmn : request.tgl_selesai_pnglmn,
            ba_pnglmn : request.ba_pnglmn,
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

const hapusPengalamanBadanUsaha = async (id:ParameterSchema["params"]["id"]) : Promise<Pengalaman> => {
    try {
        const exPengalaman = await Pengalaman.findOne({
            where : {
                kode_pengalaman : id
            },
            attributes : {exclude : ["encrypt_key"]}
        })

        if(!exPengalaman) throw new CustomError(httpCode.notFound, responseStatus.success, "Data Pengalaman Perusahaan Tidak Ada")
            

        const hapusFile = await deleteFile(exPengalaman.path_pnglmn as string)

        if(hapusFile[1] !== null) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Gagal Hapus File")

        const hapusData = await Pengalaman.destroy({
            where : {
                kode_pengalaman : id
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

const getPdfUploadPengalaman = async (id:ParameterSchema["params"]["id"], kode_vendor:number) : Promise<any> => {
    try {
        const getPengalaman : Pengalaman | null = await Pengalaman.findOne({
            where : {
                kode_vendor : kode_vendor,
                kode_pengalaman : id,
                encrypt_key : {
                    [Op.not] : null
                }
            }
        })


        if(!getPengalaman) throw new CustomError(httpCode.notFound, responseStatus.error, "Data Tidak Tersedia / Data Bukan Format PDF")

        const data = {
            nama_file : getPengalaman?.path_pnglmn as string, 
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

const updatePengalaman = async (id:PayloadPengalamanUpdateSchema["params"]["id"], 
    request:PayloadPengalamanUpdateSchema["body"],
     file : Express.Multer.File) : Promise<any> => {
    try {
        const exPengalaman = await Pengalaman.findByPk(id)

        if(!exPengalaman) throw new CustomError(httpCode.notFound, responseStatus.success, "Pengalaman Tidak Tersedia")

        let pengalaman

        if(!file) {
            exPengalaman.nm_pnglmn          = request.nm_pnglmn,
            exPengalaman.div_pnglmn         = request.div_pnglmn,
            exPengalaman.ringkas_pnglmn     = request.ringkas_pnglmn,
            exPengalaman.lok_pnglmn         = request.lok_pnglmn,
            exPengalaman.pemberi_pnglmn     = request.pemberi_pnglmn,
            exPengalaman.alamat_pnglmn      = request.alamat_pnglmn,
            exPengalaman.tgl_pnglmn         = request.tgl_pnglmn,
            exPengalaman.nilai_pnglmn       = request.nilai_pnglmn,
            exPengalaman.status_pnglmn      = request.status_pnglmn,
            exPengalaman.tgl_selesai_pnglmn = request.tgl_selesai_pnglmn,
            exPengalaman.ba_pnglmn          = request.ba_pnglmn,

            await exPengalaman.save()

            pengalaman = {
                nm_pnglmn         : request.nm_pnglmn,
                div_pnglmn        : request.div_pnglmn,
                ringkas_pnglmn    : request.ringkas_pnglmn,
                lok_pnglmn        : request.lok_pnglmn,
                pemberi_pnglmn    : request.pemberi_pnglmn,
                alamat_pnglmn     : request.alamat_pnglmn,
                tgl_pnglmn        : request.tgl_pnglmn,
                nilai_pnglmn      : request.nilai_pnglmn,
                status_pnglmn     : request.status_pnglmn,
                tgl_selesai_pnglmn: request.tgl_selesai_pnglmn,
                ba_pnglmn         : request.ba_pnglmn,
            }
        }

        else {
            await deleteFile(exPengalaman.path_pnglmn as string)

            const formData = new FormData()

            formData.append('nama_aplikasi','SI-DaPeT')
            formData.append('file', fs.createReadStream(file.path))
    
            const upload : any = await uploadPdf(formData)
    
            console.log(upload)

            if(upload[1] !== null || !upload[0]){
                throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Upload Gagal")
            }

            let pengalamanUpd = await Pengalaman.update({
                nm_pnglmn         : request.nm_pnglmn,
                div_pnglmn        : request.div_pnglmn,
                ringkas_pnglmn    : request.ringkas_pnglmn,
                lok_pnglmn        : request.lok_pnglmn,
                pemberi_pnglmn    : request.pemberi_pnglmn,
                alamat_pnglmn     : request.alamat_pnglmn,
                tgl_pnglmn        : request.tgl_pnglmn,
                nilai_pnglmn      : request.nilai_pnglmn,
                status_pnglmn     : request.status_pnglmn,
                tgl_selesai_pnglmn: request.tgl_selesai_pnglmn,
                ba_pnglmn         : request.ba_pnglmn,
                path_pnglmn   : upload[0].file_name,
                encrypt_key      : upload[0].keypass
            },{
                where : {
                    kode_pengalaman : id
                },
                returning : true,
            })

            if(pengalamanUpd[0] === 0) throw new CustomError(httpCode.unprocessableEntity,responseStatus.error,"Gagal Update Pengalaman")

                pengalaman = {
                    nm_pnglmn         : pengalamanUpd[1][0].nm_pnglmn,
                    div_pnglmn        : pengalamanUpd[1][0].div_pnglmn,
                    ringkas_pnglmn    : pengalamanUpd[1][0].ringkas_pnglmn,
                    lok_pnglmn        : pengalamanUpd[1][0].lok_pnglmn,
                    pemberi_pnglmn    : pengalamanUpd[1][0].pemberi_pnglmn,
                    alamat_pnglmn     : pengalamanUpd[1][0].alamat_pnglmn,
                    tgl_pnglmn        : pengalamanUpd[1][0].tgl_pnglmn,
                    nilai_pnglmn      : pengalamanUpd[1][0].nilai_pnglmn,
                    status_pnglmn     : pengalamanUpd[1][0].status_pnglmn,
                    tgl_selesai_pnglmn: pengalamanUpd[1][0].tgl_selesai_pnglmn,
                    ba_pnglmn         : pengalamanUpd[1][0].ba_pnglmn,
                    path_pnglmn       : pengalamanUpd[1][0].path_pnglmn,
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
            throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Upload Gagal")
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
    
            console.log(upload)

            if(upload[1] !== null || !upload[0]){
                throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Upload Gagal")
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
    getPdfUploadFasilitas,
    updateFasilitas,

    //Pengalaman
    getPengalaman,
    storePengalaman,
    hapusPengalamanBadanUsaha,
    getPdfUploadPengalaman,
    updatePengalaman,

    //Pengalaman Sekarang
    getPengalamanSekarang,
    storePengalamanSekarang,
    hapusPengalamanSekarangBadanUsaha,
    getPdfUploadPengalamanSekarang,
    updatePengalamanSekarang,
}