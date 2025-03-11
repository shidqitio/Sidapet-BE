import db from "@config/database";
import { DataTypes, Optional, Model } from "sequelize";
import TenagaAhli from "./tenagaAhli-model";

interface IPengalamanTAAttributes {
	kode_pengalaman_ta : number 
	kode_tenaga_ahli : number | undefined | null
	pengalaman : string | undefined | null
	file_bukti : string | undefined | null
	encrypt_key : string | undefined | null
}

export type  PengalamanTAOutput= Required<IPengalamanTAAttributes>

export type PengalamanTAInput = Optional<
IPengalamanTAAttributes, 
"kode_pengalaman_ta" |
"kode_tenaga_ahli" |
"pengalaman" |
"file_bukti" |
"encrypt_key" 
>

class PengalamanTa 
    extends Model<IPengalamanTAAttributes, PengalamanTAInput>
    implements IPengalamanTAAttributes
{
	declare kode_pengalaman_ta : number 
	declare kode_tenaga_ahli : number | undefined | null
	declare pengalaman : string | undefined | null
	declare file_bukti : string | undefined | null
	declare encrypt_key : string | undefined | null
}

PengalamanTa.init(
    {
        kode_pengalaman_ta : {
            type : DataTypes.INTEGER,
            allowNull : false,
            primaryKey : true, 
            autoIncrement : true
        },
        kode_tenaga_ahli : {
            type : DataTypes.STRING,
            allowNull : true
        },
        pengalaman : {
            type : DataTypes.STRING,
            allowNull : true
        },
        file_bukti : {
            type : DataTypes.STRING,
            allowNull : true
        },
        encrypt_key : {
            type : DataTypes.STRING,
            allowNull : true
        },
    },
    {
        sequelize : db, 
        schema : "public",
        tableName : "ref_pengalaman_ta",
        modelName : "PengalamanTa",
        timestamps : false
    }
)

PengalamanTa.belongsTo(TenagaAhli, {
    foreignKey : "kode_tenaga_ahli",
    as : "TenagaAhli"
})

TenagaAhli.hasMany(PengalamanTa, {
    foreignKey : "kode_tenaga_ahli",
    as : "PengalamanTa"
})


export default PengalamanTa