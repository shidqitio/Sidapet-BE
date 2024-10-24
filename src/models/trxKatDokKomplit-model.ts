import db from "@config/database";
import { DataTypes, Optional, Model } from "sequelize";
import Vendor from "./vendor-model";
import KatDokumenVendor from "./katDokumenVendor-model";




interface ITrxKatDokKomplitAttributes {
    kode_dok_komplit : number
	kode_vendor : number | undefined | null ;
	kode_kat_dokumen_vendor : number | undefined | null ;
	is_komplit : boolean | undefined | null ;
}

export type TrxKatDokKomplitOutput = Required<ITrxKatDokKomplitAttributes>

export type TrxKatDokKomplitInput = Optional<
ITrxKatDokKomplitAttributes, 
"kode_dok_komplit"|
"kode_vendor"|
"kode_kat_dokumen_vendor"|
"is_komplit"
>

class TrxKatDokKomplit 
    extends Model<ITrxKatDokKomplitAttributes, TrxKatDokKomplitInput>
    implements ITrxKatDokKomplitAttributes
{
    declare kode_dok_komplit : number;
	declare kode_vendor : number | undefined | null ;
	declare kode_kat_dokumen_vendor : number | undefined | null ;
	declare is_komplit : boolean | undefined | null ;
}

TrxKatDokKomplit.init(
    {
        kode_dok_komplit : {
            type : DataTypes.INTEGER(),
            allowNull : false,
            primaryKey : true,
            autoIncrement : true 
        },
        kode_vendor : {
            type : DataTypes.INTEGER(),
            allowNull : true, 
        },
        kode_kat_dokumen_vendor : {
            type : DataTypes.INTEGER(),
            allowNull : true, 
        },
        is_komplit : {
            type : DataTypes.INTEGER(),
            allowNull : true, 
        },
    },
    {
        sequelize : db, 
        schema : "public",
        tableName : "trx_kat_dok_komplit",
        modelName : "TrxKatDokKomplit",
        timestamps : false
    }
)

TrxKatDokKomplit.belongsTo(Vendor, {
    foreignKey : "kode_vendor",
    as : "Vendor"
})

Vendor.hasMany(TrxKatDokKomplit, {
    foreignKey : "kode_vendor",
    as : "TrxKatDokKomplit"
})

TrxKatDokKomplit.belongsTo(KatDokumenVendor, {
    foreignKey : "kode_kat_dokumen_vendor",
    as : "KatDokumenVendor"
})

KatDokumenVendor.hasMany(TrxKatDokKomplit, {
    foreignKey : "kode_kat_dokumen_vendor",
    as : "TrxKatDokKomplit"
})


export default TrxKatDokKomplit