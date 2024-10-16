import db from "@config/database";
import { DataTypes, Optional, Model } from "sequelize";
import JenisVendor from "./jenisVendor-model";
import KatItemTanya from "./katItemTanya-model";



interface IDomisiliAttributes {
    kode_domisili : number,
    nama_domisili : string
}

export type DomisiliOutput = Required<IDomisiliAttributes>

export type DomisiliInput = Optional<
IDomisiliAttributes, 
"kode_domisili" | 
"nama_domisili"
>

class Domisili 
    extends Model<IDomisiliAttributes, DomisiliInput>
    implements IDomisiliAttributes
{
    declare kode_domisili : number ;
    declare nama_domisili : string ;
}

Domisili.init(
    {
        kode_domisili : {
            type : DataTypes.INTEGER, 
            allowNull : false,
            primaryKey : true,
            autoIncrement : true
        },
        nama_domisili : {
            type : DataTypes.STRING, 
            allowNull : false
        },
    },
    {
        sequelize : db, 
        schema : "public",
        tableName : "ref_domisili",
        modelName : "Domisili",
        timestamps : false
    }
)




export default Domisili