import db from "@config/database";
import { DataTypes, Optional, Model } from "sequelize";


interface IKabkotAttributes {
    kode_kab_kota : string,
    kode_provinsi : string,
    kab_kota : string
}

export type KabkotOutput = Required<IKabkotAttributes>

export type KabkotInput = Optional<
IKabkotAttributes, 
"kode_kab_kota" |
"kab_kota" |
"kode_provinsi"
>

class Kabkot 
    extends Model<IKabkotAttributes, KabkotInput>
    implements IKabkotAttributes
{
    declare kode_kab_kota : string
    declare kode_provinsi : string
    declare kab_kota: string;
}

Kabkot.init(
    {
        kode_kab_kota : {
            type : DataTypes.STRING,
            allowNull : false,
            primaryKey : true
        },
        kode_provinsi : {
            type : DataTypes.STRING,
            allowNull : true
        },
        kab_kota : {
            type : DataTypes.STRING,
            allowNull : true
        },
    },
    {
        sequelize : db, 
        schema : "public",
        tableName : "ref_kab_kota",
        modelName : "Kabkota",
        timestamps : false
    }
)




export default Kabkot