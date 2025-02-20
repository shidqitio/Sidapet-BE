import db from "@config/database"
import { DataTypes, Optional, Model } from "sequelize"


interface IKbliAttributes {
    kode_kbli : number | undefined | null
	kategori : string | undefined | null
	gol_pokok : number | undefined | null
	gol : number | undefined | null
	sub_gol : number | undefined | null
	kelompok : number | undefined | null
	judul : string | undefined | null
}

export type KbliOutput = Required<IKbliAttributes>

export type KbliInput = Optional<
IKbliAttributes,
"kategori" |
"gol_pokok" |
"gol" |
"sub_gol" |
"kelompok" |
"judul" 
>

class Kbli
    extends Model<IKbliAttributes, KbliInput>
    implements IKbliAttributes
{
    declare kode_kbli : number | undefined | null ;
	declare kategori : string | undefined | null ;
	declare gol_pokok : number | undefined | null ;
	declare gol : number | undefined | null ;
	declare sub_gol : number | undefined | null ;
	declare kelompok : number | undefined | null ;
	declare judul : string | undefined | null ;
}

Kbli.init(
    {
        kode_kbli : {
            type : DataTypes.INTEGER,
            allowNull : false,
            primaryKey : true,
            autoIncrement : true
        },
        kategori : {
            type : DataTypes.INTEGER,
            allowNull : true
        },
        gol_pokok : {
            type : DataTypes.INTEGER,
            allowNull : true
        },
        gol : {
            type : DataTypes.INTEGER,
            allowNull : true
        },
        sub_gol : {
            type : DataTypes.INTEGER,
            allowNull : true
        },
        kelompok : {
            type : DataTypes.INTEGER,
            allowNull : true
        },
        judul : {
            type : DataTypes.INTEGER,
            allowNull : true
        },
    },
    {
        sequelize : db,
        schema : "public",
        tableName : "ref_kbli",
        modelName : "Kbli",
        timestamps : false
    }
)

export default Kbli