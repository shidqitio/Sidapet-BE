import CustomError from "@middleware/error-handler";
import { debugLogger } from "@config/logger";
import db from "@config/database";
import { responseStatus, httpCode } from "@utils/prefix";

//IMPORT MODEL
import TrxPenjaringan, {status_persetujuan} from "@models/trxPenjaringan-model";
import TrxUndanganPenjr from "@models/trxUndanganPenjr-model";

//IMPORT SCHEMA
import {
    PayloadTrxPenjaringanSchema
} from "@schema/api/trxPenjaringan-schema"
import TrxKategori from "@models/trxKategori-model";

import validate from "deep-email-validator";

import {sendMail} from '@utils/sendmail'
import crypto from "crypto"

import template from "@public/template/template-email"
import templateEmail from "@public/template/template-email";




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

        const storeTahapData = await TrxPenjaringan.create({
            kode_trx_kategori : request.kode_trx_kategori,
            metode : request.metode,
            nama_penjaringan : request.nama_penjaringan,
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
                // const {valid, reason, validators} = await validate(undangan.email)
                // if(valid === false) {
                //     await t.rollback()
                //     throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Email Tidak Valid")
                // }

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

        for(const ar_und of arr_undangan) {
            await sendMail(ar_und.email as string, "Undangan Vendor", templateEmail.templateHtmlUndangan("https://google.com", ar_und.token))
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

export default {
    storeTahap
}