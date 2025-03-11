import CustomError from "@middleware/error-handler";
import { debugLogger } from "@config/logger";
import db from "@config/database";
import { responseStatus, httpCode } from "@utils/prefix";

//IMPORT MODEL
import TrxPenjaringan, {status_persetujuan} from "@models/trxPenjaringan-model";
import TrxUndanganPenjr from "@models/trxUndanganPenjr-model";
import Kategori from "@models/kategori-model";


//IMPORT SCHEMA
import {
    PayloadTrxPenjaringanSchema,
    ParameterSchema, 
    QuerySchema
} from "@schema/api/trxPenjaringan-schema"
import TrxKategori from "@models/trxKategori-model";

import validate from "deep-email-validator";

import {sendMail} from '@utils/sendmail'
import crypto from "crypto"

import template from "@public/template/template-email"
import templateEmail from "@public/template/template-email";
import { getCache, setCache, delCache } from "@cache/cache";
import { Sequelize } from "sequelize";

const getPenjaringan = async (
    page : QuerySchema["query"]["page"],
    limit : QuerySchema["query"]["limit"],
    id:ParameterSchema["params"]["id"]) : Promise<any> => {
    try {
        let pages: number = parseInt(page);
        let limits: number = parseInt(limit);
        let offset = 0;
        if (pages > 1) {
            offset = (pages - 1) * limits;
          }

          const {rows, count} = await TrxPenjaringan.findAndCountAll({
            where : {
                kode_trx_kategori : id
            },
            attributes : [
                "kode_penjaringan",
                "kode_trx_kategori",
                "nama_penjaringan",
                "metode",
                "status_persetujuan",
                [Sequelize.fn('TO_CHAR', Sequelize.col('udcr'), 'DD Month YYYY HH24:MI:SS'), 'udcr']
            ],
            limit : limits,
            offset : offset
        })

        

        const result = {
            trx_penjaringan : rows, 
            count : count
        }
        

        return result
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

const getDetailPenjaringan = async (
    id:ParameterSchema["params"]["id"]) : Promise<TrxPenjaringan> => {
    try {
        const exPenjaringan : TrxPenjaringan | null = await TrxPenjaringan.findOne({
            where : {
                kode_penjaringan : id
            },
            attributes : [
                "kode_penjaringan",
                "nama_penjaringan",
                [Sequelize.literal('"TrxKategori->Kategori"."nama_kategori"'), 'nama_kategori'],
                "metode",
                "is_kualifikasi_k",
                "is_kualifikasi_m",
                "is_kualifikasi_b",
                // "udcr",
                [Sequelize.fn('TO_CHAR', Sequelize.col('"TrxKategori.udcr"'), 'DD Month YYYY HH24:MI:SS'), 'udcr_data'] // Correctly format udcr
            ],
            include : [
                {
                    model : TrxKategori, 
                    as : "TrxKategori",
                    attributes : [],
                    include : [
                        {
                            model : Kategori,
                            as : "Kategori",
                            attributes : []
                        }
                    ]
                },
                {
                    model : TrxUndanganPenjr,
                    as : "TrxUndanganPenjr",
                }
            ],
            // raw : true,
            // nest : true
        })


        if(!exPenjaringan) throw new CustomError(httpCode.notFound,responseStatus.error ,"Data Tidak Tersedia" )

        return exPenjaringan
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

const storeTahap = async (request:PayloadTrxPenjaringanSchema["body"]) : Promise<any> => {
    const t = await db.transaction()
    try {
        const getKategoriById = await TrxKategori.findOne({
            where : {
                kode_trx_kategori : request.kode_trx_kategori
            },
            transaction : t
        })
        

        if(!getKategoriById) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Data Kategori Tidak Tersedia")

        const getCountData : number = await TrxPenjaringan.count({
            where : {
                kode_trx_kategori : request.kode_trx_kategori
            },
            transaction : t
        })        

        let nama

        if(getCountData === 0)  {
            nama = `penjaringan ${getCountData + 1}`
        }       

        else {
            const findMax = await TrxPenjaringan.max("kode_penjaringan", {
                transaction : t
            })

            if (findMax === null) {
                console.log('The table is empty.');
                return []; // Return an empty array or handle as needed
              }

            const dataMax = await TrxPenjaringan.findOne({
                where : {
                    kode_penjaringan : findMax
                },
                attributes : [
                    "nama_penjaringan"
                ],
                transaction : t
            })

            const numberMatch = dataMax?.nama_penjaringan?.match(/\d+/)
            let number
            if(numberMatch) {
                number = parseInt(numberMatch[0], 10)
            }

            if(number === 0 ) {
                throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Terjadi Kesalahan Penamaan")
            }

            nama = `penjaringan ${number as number + 1}`
        }

        console.log(nama)

        const storeTahapData = await TrxPenjaringan.create({
            kode_trx_kategori : request.kode_trx_kategori,
            metode : request.metode,
            nama_penjaringan : nama,
            is_kualifikasi_b : request.is_kualifikasi_b,
            is_kualifikasi_k : request.is_kualifikasi_k,
            is_kualifikasi_m : request.is_kualifikasi_m,
            status_persetujuan : status_persetujuan.belum_diproses
        }, {
            transaction : t,
            attributes : [
                "kode_trx_kategori",
                "metode",
                "nama_penjaringan",
                "is_kualifikasi_b",
                "is_kualifikasi_k",
                "is_kualifikasi_m",
                "status_persetujuan"
            ]
        })

        if(!storeTahapData) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Gagal Store Data")

            const arr_undangan = []

        if(request.metode === "undangan") {
            if(request.undangan === null || request.undangan === undefined) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "harap isi daftar undangan")
            for(const undangan of request.undangan) {
                const {valid, reason, validators} = await validate(undangan.email)
                if(valid === false) {
                    throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Email Tidak Valid")
                }

                const rand_crypto = crypto.randomBytes(32).toString("hex")

                const storeUndangan = await TrxUndanganPenjr.create({
                    kode_penjaringan : storeTahapData.kode_penjaringan,
                    nama : undangan.nama,
                    email : undangan.email,
                    alamat : undangan.alamat,
                    nama_pic : undangan.nama_pic,
                    no_hp_wa : undangan.no_hp_wa,
                    token : rand_crypto
                }, {
                    transaction : t
                })
                if(!storeUndangan) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error,"Terjadi Kesalahan Pada Create Data")

                

                arr_undangan.push(storeUndangan) 
            }
        }


        
        let object = {
            ...storeTahapData.dataValues,
            arr_undangan
        }        

        await t.commit()

        return object
    } catch (error) {
        debugLogger.debug(error)
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

const ajukanPenjaringan = async (
    id:ParameterSchema["params"]["id"]) : Promise<any> => {
    try {
        const exTrxPenjaringan = await TrxPenjaringan.findByPk(id)

        if(!exTrxPenjaringan) throw new CustomError(httpCode.notFound, responseStatus.error, "Data Penjaringan Tidak Tersedia")

        exTrxPenjaringan.status_persetujuan = status_persetujuan.proses

        const update = await exTrxPenjaringan.save()

        const result = {
            kode_penjaringan : exTrxPenjaringan.kode_penjaringan,
            kode_trx_kategori : exTrxPenjaringan.kode_trx_kategori,
            nama_penjaringan : exTrxPenjaringan.nama_penjaringan,
            metode : exTrxPenjaringan.metode,
            status_persetujuan : update.status_persetujuan
        }

        if(!update) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Gagal Mengubah Status")

        return result

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

const deleteTrxPenjaringan = async (id:ParameterSchema["params"]["id"]) : Promise<any> => {
    const t = await db.transaction()
    try {
        const exTrxPenjaringan = await TrxPenjaringan.findByPk(id, {transaction : t})

        if(!exTrxPenjaringan) throw new CustomError(httpCode.notFound, responseStatus.error, "Data Penjaringan Tidak Tersedia")

        if(exTrxPenjaringan.metode === "undangan") {
            
                    const deleteUndangan = await TrxUndanganPenjr.destroy({
                        where : {
                            kode_penjaringan : id
                        },
                        transaction : t
                    })
            
                    if(deleteUndangan === 0) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Undangan Gagal Dihapus")
                 }
            
        const deletePenjaringan = await TrxPenjaringan.destroy({
            where : {
                kode_penjaringan : id
            },
            transaction : t
        })

        if(deletePenjaringan === 0) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Penjaringan Gagal Dihapus")

        await t.commit()

        return exTrxPenjaringan


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

export default {
    storeTahap,
    getPenjaringan,
    getDetailPenjaringan,
    ajukanPenjaringan,
    deleteTrxPenjaringan
}