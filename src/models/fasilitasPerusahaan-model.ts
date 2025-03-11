import db from "@config/database";
import { DataTypes, Optional, Model } from "sequelize";
import Vendor from "./vendor-model";

export enum kondisi {
    baik = "baik",
    sedang = "sedang",
    kurang_baik = "kurang_baik"
}

interface IFasilitasPerusahaanAttributes {
	kode_fasilitas_usaha : number
	kode_vendor : number
	nama : string | undefined | null
	jumlah : string | undefined | null
	kondisi : kondisi
	kode_kepemilikan : number
	file_kepemilikan : string | undefined | null
	is_kepemilikan_selamanya : boolean
	kepemilikan_berlaku_awal : Date | undefined
	kepemilikan_berlaku_akhir : Date | undefined
	encrypt_key_kepemilikan : string | undefined | null
	file_foto : string | undefined | null
	is_foto_selamanya : boolean
	foto_berlaku_awal : Date | undefined
	foto_berlaku_akhir : Date | undefined
	encrypt_key_foto : string | undefined | null
	custom : string | undefined | null
}

export type  FasilitasPerusahaanOutput= Required<IFasilitasPerusahaanAttributes>

export type FasilitasPerusahaanInput = Optional<
IFasilitasPerusahaanAttributes,
"kode_fasilitas_usaha" |
"kode_vendor" |
"nama" |
"jumlah" |
"kondisi" |
"kode_kepemilikan" |
"file_kepemilikan" |
"is_kepemilikan_selamanya" |
"kepemilikan_berlaku_awal" |
"kepemilikan_berlaku_akhir" |
"encrypt_key_kepemilikan" |
"file_foto" |
"is_foto_selamanya" |
"foto_berlaku_awal" |
"foto_berlaku_akhir" |
"encrypt_key_foto" |
"custom" 
>

class FasilitasPerusahaan 
    extends Model<IFasilitasPerusahaanAttributes, FasilitasPerusahaanInput>
    implements IFasilitasPerusahaanAttributes
{
    declare kode_fasilitas_usaha : number
    declare kode_vendor : number
    declare nama : string | undefined | null
    declare jumlah : string | undefined | null
    declare kondisi : kondisi
    declare kode_kepemilikan : number
    declare file_kepemilikan : string | undefined | null
    declare is_kepemilikan_selamanya : boolean
    declare kepemilikan_berlaku_awal : Date | undefined
    declare kepemilikan_berlaku_akhir : Date | undefined
    declare encrypt_key_kepemilikan : string | undefined | null
    declare file_foto : string | undefined | null
    declare is_foto_selamanya : boolean
    declare foto_berlaku_awal : Date | undefined
    declare foto_berlaku_akhir : Date | undefined
    declare encrypt_key_foto : string | undefined | null
    declare custom : string | undefined | null
}

FasilitasPerusahaan.init(
    {
        kode_fasilitas_usaha : {
            type : DataTypes.NUMBER(),
            allowNull : false,
            primaryKey : true,
            autoIncrement:true
        },
        kode_vendor : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        nama : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        jumlah : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        kondisi : {
            type : DataTypes.ENUM("baik","sedang","kurang_baik"),
            allowNull : true
        },
        kode_kepemilikan : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        file_kepemilikan : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        is_kepemilikan_selamanya : {
            type : DataTypes.BOOLEAN(),
            allowNull : true
        },
        kepemilikan_berlaku_awal : {
            type : DataTypes.DATE(),
            allowNull : true
        },
        kepemilikan_berlaku_akhir : {
            type : DataTypes.DATE(),
            allowNull : true
        },
        encrypt_key_kepemilikan : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        file_foto : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        is_foto_selamanya : {
            type : DataTypes.BOOLEAN(),
            allowNull : true
        },
        foto_berlaku_awal : {
            type : DataTypes.DATE(),
            allowNull : true
        },
        foto_berlaku_akhir : {
            type : DataTypes.DATE(),
            allowNull : true
        },
        encrypt_key_foto : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        custom : {
            type : DataTypes.STRING(),
            allowNull : true
        },
    },
    {
        sequelize : db, 
        schema : "public",
        tableName : "ref_fasilitas_perusahaan",
        modelName : "FasilitasPerusahaan",
        timestamps : false
    }
)

FasilitasPerusahaan.belongsTo(Vendor, {
    foreignKey : "kode_vendor",
    as : "Vendor"
})

Vendor.hasMany(FasilitasPerusahaan, {
    foreignKey : "kode_vendor",
    as : "FasilitasPerusahaan"
})


export default FasilitasPerusahaan