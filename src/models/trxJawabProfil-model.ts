import db from "@config/database";
import { DataTypes, Optional, Model } from "sequelize";
import Vendor from "./vendor-model";
import ItemTanya from "./itemTanya-model";




interface ITrxJawabProfil {
	kode_jawab_profil : number;
	kode_vendor : number;
	kode_item : number;
	isian : string | null | undefined;
    encrypt_key : string | null | undefined
}

export type TrxJawabProfilOutput = Required<ITrxJawabProfil>

export type TrxJawabProfilInput = Optional<
ITrxJawabProfil, 
"kode_jawab_profil" | 
"kode_vendor" | 
"kode_item"  | 
"encrypt_key"
>

class TrxJawabProfil 
    extends Model<ITrxJawabProfil, TrxJawabProfilInput>
    implements ITrxJawabProfil
{
    declare kode_jawab_profil : number;
    declare kode_vendor : number;
    declare kode_item : number;
    declare isian : string | null | undefined;
    declare encrypt_key: string | null | undefined; 
}

TrxJawabProfil.init(
    {
        kode_jawab_profil : {
            type : DataTypes.INTEGER(),
            allowNull : false,
            primaryKey : true,
            autoIncrement : true
        },
        kode_vendor : {
            type : DataTypes.INTEGER(),
            allowNull : true,
        },
        kode_item : {
            type : DataTypes.INTEGER(),
            allowNull : true,
        },
        isian : {
            type : DataTypes.STRING(),
            allowNull : true,
        },
        encrypt_key : {
            type : DataTypes.STRING(), 
            allowNull : true
        }
    },
    {
        sequelize : db, 
        schema : "public",
        tableName : "trx_jawab_profil",
        modelName : "TrxJawabProfil",
        timestamps : false
    }
)

TrxJawabProfil.belongsTo(Vendor, {
    foreignKey : "kode_vendor", 
    as : "Vendor"
})

Vendor.hasMany(TrxJawabProfil, {
    foreignKey : "kode_vendor",
    as : "TrxJawabProfil"
})

TrxJawabProfil.belongsTo(ItemTanya, {
    foreignKey : "kode_item",
    as : "ItemTanya"
})

ItemTanya.hasMany(TrxJawabProfil, {
    foreignKey : "kode_item",
    as : "TrxJawabProfil"
})


export default TrxJawabProfil