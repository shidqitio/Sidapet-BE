import db from "@config/database";
import { DataTypes, Optional, Model } from "sequelize";
import TrxKategori from "./trxKategori-model";

export enum metode_penjaringan {
    undangan = "undangan",
    pengumuman = "pengumuman",
}

export enum status_persetujuan {
    belum_diproses = "belum_diproses",
    proses = "proses",
    terima = "terima",
    tolak = "tolak"
}

interface ITrxPenjaringanAttributes {
    kode_penjaringan : number
	kode_trx_kategori : number | null
	nama_penjaringan : string | undefined | null
	metode : metode_penjaringan
	status_persetujuan : status_persetujuan
	user_persetujuan : string | undefined | null
	alasan_ditolak : string | undefined | null
	tgl_daftar_awal : Date | undefined
	tgl_daftar_akhir :  Date | undefined
	tgl_evaluasi_awal :  Date | undefined
	tgl_evaluasi_akhir :  Date | undefined
	tgl_pengumuman :  Date | undefined
	s_tugas_dibuat : boolean
    file_s_tugas : string | undefined | null
    is_kualifikasi_k : boolean,
    is_kualifikasi_m : boolean,
    is_kualifikasi_b : boolean
 	udcr : Date | undefined
    udch : Date | undefined
}

export type TrxPenjaringanOutput = Required<ITrxPenjaringanAttributes>

export type TrxPenjaringanInput = Optional<
ITrxPenjaringanAttributes,
"kode_penjaringan" | 
"kode_trx_kategori" |
"metode" | 
"alasan_ditolak" |
"status_persetujuan" | 
"tgl_daftar_akhir" | 
"tgl_daftar_awal" | 
"tgl_evaluasi_akhir" | 
"tgl_evaluasi_awal" | 
"tgl_pengumuman" | 
"s_tugas_dibuat" | 
"file_s_tugas" | 
"is_kualifikasi_b" | 
"is_kualifikasi_k" | 
"is_kualifikasi_m" |
"udcr" | 
"udch"
>

class TrxPenjaringan 
    extends Model<ITrxPenjaringanAttributes, TrxPenjaringanInput>
    implements ITrxPenjaringanAttributes
{
    declare kode_penjaringan : number ;
    declare kode_trx_kategori : number | null ;
    declare nama_penjaringan : string | undefined | null ;
    declare metode : metode_penjaringan ;
    declare status_persetujuan : status_persetujuan ;
    declare user_persetujuan : string | undefined | null ;
    declare alasan_ditolak : string | undefined | null ;
    declare tgl_daftar_awal : Date | undefined ;
    declare tgl_daftar_akhir :  Date | undefined ;
    declare tgl_evaluasi_awal :  Date | undefined ;
    declare tgl_evaluasi_akhir :  Date | undefined ;
    declare tgl_pengumuman :  Date | undefined ;
    declare s_tugas_dibuat : boolean ;
    declare udcr : Date | undefined ;
    declare file_s_tugas : string | undefined | null ;
    declare is_kualifikasi_k: boolean;
    declare is_kualifikasi_m: boolean;
    declare is_kualifikasi_b: boolean;
    declare udch: Date | undefined;
}


TrxPenjaringan.init(
    {
        kode_penjaringan : {
            type : DataTypes.INTEGER,
            allowNull : false,
            primaryKey : true,
            autoIncrement : true
        },
        kode_trx_kategori : {
            type : DataTypes.INTEGER,
            allowNull : true,
            primaryKey : true
        },
        nama_penjaringan : {
            type : DataTypes.STRING,
            allowNull : true,
        },
        metode : {
            type : DataTypes.ENUM("undangan" , "pengumuman"),
            allowNull : true
        },
        status_persetujuan : {
            type : DataTypes.ENUM("belum_diproses", "proses", "terima"," tolak"),
            allowNull : true
        },
        user_persetujuan : {
            type : DataTypes.STRING,
            allowNull : true
        },
        alasan_ditolak : {
            type : DataTypes.STRING,
            allowNull : true
        },
        tgl_daftar_awal : {
            type : DataTypes.DATE(),
            allowNull : true
        },
        tgl_daftar_akhir : {
            type : DataTypes.DATE(),
            allowNull : true
        },
        tgl_evaluasi_awal : {
            type : DataTypes.DATE(),
            allowNull : true
        },
        tgl_evaluasi_akhir : {
            type : DataTypes.DATE(),
            allowNull : true
        },
        tgl_pengumuman : {
            type : DataTypes.DATE(),
            allowNull : true
        },
        s_tugas_dibuat : {
            type : DataTypes.STRING,
            allowNull : true
        },
        is_kualifikasi_m : {
            type : DataTypes.BOOLEAN,
            allowNull : true
        },
        is_kualifikasi_k : {
            type : DataTypes.BOOLEAN,
            allowNull : true
        },
        is_kualifikasi_b : {
            type : DataTypes.BOOLEAN,
            allowNull : true
        },
        udcr : {
            type : DataTypes.DATE,
            allowNull : true
        },
        udch : {
            type : DataTypes.DATE,
            allowNull : true
        },
        file_s_tugas : {
            type : DataTypes.STRING,
            allowNull : true
        },
    },
    {
        sequelize : db,
        schema : "public",
        tableName : "trx_penjaringan",
        modelName : "TrxPenjaringan",
        createdAt : "udcr",
        updatedAt : "udch"
    }
)

TrxPenjaringan.belongsTo(TrxKategori, {
    foreignKey : "kode_trx_kategori",
    as : "TrxKategori"
})

TrxKategori.hasMany(TrxPenjaringan, {
    foreignKey : "kode_trx_kategori",
    as : "TrxPenjaringan"
})


export default TrxPenjaringan