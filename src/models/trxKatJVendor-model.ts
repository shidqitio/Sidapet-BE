import db from "@config/database";
import { DataTypes, Optional, Model } from "sequelize";
import TrxKategori from "./trxKategori-model";
import JenisVendor from "./jenisVendor-model";



interface ITrxKatJVendorAttributes {
	kode_kat_j_vendor: number
	kode_trx_kategori: number | null
    kode_jenis_vendor : number | null
}

export type TrxKatJVendorOutput = Required<ITrxKatJVendorAttributes>

export type TrxKatJVendorInput = Optional<
ITrxKatJVendorAttributes, 
"kode_kat_j_vendor" |
"kode_trx_kategori" | 
"kode_jenis_vendor"
>

class TrxKatJVendor 
    extends Model<ITrxKatJVendorAttributes, TrxKatJVendorInput>
    implements ITrxKatJVendorAttributes
{
    declare kode_kat_j_vendor: number;
    declare kode_trx_kategori: number | null;
    declare kode_jenis_vendor: number | null;
}

TrxKatJVendor.init(
    {
        kode_kat_j_vendor : {
            type : DataTypes.INTEGER,
            allowNull : false,
            primaryKey : true, 
            autoIncrement : true
        },
        kode_trx_kategori : {
            type : DataTypes.INTEGER,
            allowNull : true
        },
        kode_jenis_vendor : {
            type : DataTypes.INTEGER,
            allowNull : true
        },
    },
    {
        sequelize : db, 
        schema : "public",
        tableName : "trx_kat_j_vendor",
        modelName : "TrxKatJVendor",
        timestamps : false
    }
)

TrxKatJVendor.belongsTo(TrxKategori, {
    foreignKey : "kode_trx_kategori",
    as : "TrxKategori"
})

TrxKategori.hasMany(TrxKatJVendor, {
    foreignKey : "kode_trx_kategori",
    as : "TrxKatJVendor"
})

TrxKatJVendor.belongsTo(JenisVendor, {
    foreignKey : "kode_jenis_vendor",
    as : "JenisVendor"
})

JenisVendor.hasMany(TrxKatJVendor, {
    foreignKey : "kode_jenis_vendor",
    as : "TrxKatJVendor"
})

export default TrxKatJVendor