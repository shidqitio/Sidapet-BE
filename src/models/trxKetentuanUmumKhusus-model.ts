import db from "@config/database";
import { DataTypes, Optional, Model } from "sequelize";
import TrxKategori from "./trxKategori-model";




interface ITrxKetentuanUmumKhususAttributes {
	kode_kuk : number
	kode_trx_kategori : number | undefined | null
	kode_kat_item_tanya : number | undefined | null
	ket_umum : string | undefined | null
	ket_khusus : string | undefined | null
}

export type KetentuanUmumKhususOutput = Required<ITrxKetentuanUmumKhususAttributes>

export type TrxKetentuanUmumKhususInput = Optional<
ITrxKetentuanUmumKhususAttributes, 
"kode_kuk" |
"kode_trx_kategori" |
"kode_kat_item_tanya" |
"ket_umum" |
"ket_khusus" 
>

class TrxKetentuanUmumKhusus 
    extends Model<ITrxKetentuanUmumKhususAttributes, TrxKetentuanUmumKhususInput>
    implements ITrxKetentuanUmumKhususAttributes
{
	declare kode_kuk : number
	declare kode_trx_kategori : number | undefined | null
	declare kode_kat_item_tanya : number | undefined | null
	declare ket_umum : string | undefined | null
	declare ket_khusus : string | undefined | null
}

TrxKetentuanUmumKhusus.init(
    {
        kode_kuk : {
            type : DataTypes.INTEGER,
            allowNull : false,
            primaryKey : true,
            autoIncrement : true
        },
        kode_trx_kategori : {
            type : DataTypes.INTEGER,
            allowNull : true,
        },
        kode_kat_item_tanya : {
            type : DataTypes.INTEGER,
            allowNull : true,
        },
        ket_umum : {
            type : DataTypes.STRING,
            allowNull : true,
        },
        ket_khusus : {
            type : DataTypes.STRING,
            allowNull : true,
        },
    },
    {
        sequelize : db, 
        schema : "public",
        tableName : "trx_ketentuan_umum_khusus",
        modelName : "TrxKetentuanUmumKhusus",
        timestamps : false
    }
)

TrxKetentuanUmumKhusus.belongsTo(TrxKategori, {
    foreignKey : "kode_trx_kategori",
    as : "TrxKategori"
})

TrxKategori.hasMany(TrxKetentuanUmumKhusus, {
    foreignKey : "kode_trx_kategori",
    as : "TrxKetentuanUmumKhusus"
})

export default TrxKetentuanUmumKhusus