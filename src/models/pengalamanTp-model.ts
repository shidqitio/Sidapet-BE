import db from "@config/database";
import { DataTypes, Optional, Model } from "sequelize";
import TenagaPendukung from "./tenagaPendukung-model";

interface IPengalamanTPAttributes {
	kode_pengalaman_tp : number 
	kode_tenaga_pendukung : number | undefined | null
	pengalaman : string | undefined | null
	file_bukti : string | undefined | null
	encrypt_key : string | undefined | null
}

export type  PengalamanTPOutput= Required<IPengalamanTPAttributes>

export type PengalamanTPInput = Optional<
IPengalamanTPAttributes, 
"kode_pengalaman_tp" |
"kode_tenaga_pendukung" |
"pengalaman" |
"file_bukti" |
"encrypt_key" 
>

class PengalamanTp
    extends Model<IPengalamanTPAttributes, PengalamanTPInput>
    implements IPengalamanTPAttributes
{
	declare kode_pengalaman_tp : number 
	declare kode_tenaga_pendukung : number | undefined | null
	declare pengalaman : string | undefined | null
	declare file_bukti : string | undefined | null
	declare encrypt_key : string | undefined | null
}

PengalamanTp.init(
    {
        kode_pengalaman_tp : {
            type : DataTypes.INTEGER,
            allowNull : false,
            primaryKey : true, 
            autoIncrement : true
        },
        kode_tenaga_pendukung : {
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
        tableName : "ref_pengalaman_tp",
        modelName : "PengalamanTp",
        timestamps : false
    }
)

PengalamanTp.belongsTo(TenagaPendukung, {
    foreignKey : "kode_tenaga_pendukung",
    as : "TenagaPendukung"
})

TenagaPendukung.hasMany(PengalamanTp, {
    foreignKey : "kode_tenaga_pendukung",
    as : "PengalamanTp"
})


export default PengalamanTp