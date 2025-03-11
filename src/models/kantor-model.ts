import db from "@config/database";
import { DataTypes, Optional, Model } from "sequelize";
import Vendor from "./vendor-model";



interface IKantorAttributes {
	kode_kantor : number
	kode_vendor : number
	alamat : string | undefined | null
	kode_kepemilikan : number
	file_foto : string | undefined | null
	is_foto_selamanya : boolean
	foto_berlaku_awal : Date | undefined
	foto_berlaku_akhir : Date | undefined
	encrypt_key : string | undefined | null
	custom : string | undefined | null
}

export type  KantorOutput= Required<IKantorAttributes>

export type KantorInput = Optional<
IKantorAttributes, 
"kode_kantor" |
"kode_vendor" |
"alamat" |
"kode_kepemilikan" |
"file_foto" |
"is_foto_selamanya" |
"foto_berlaku_awal" |
"foto_berlaku_akhir" |
"encrypt_key" |
"custom" 
>

class Kantor 
    extends Model<IKantorAttributes, KantorInput>
    implements IKantorAttributes
{
    declare kode_kantor : number
    declare kode_vendor : number
    declare alamat : string | undefined | null
    declare kode_kepemilikan : number
    declare file_foto : string | undefined | null
    declare is_foto_selamanya : boolean
    declare foto_berlaku_awal : Date | undefined
    declare foto_berlaku_akhir : Date | undefined
    declare encrypt_key : string | undefined | null
    declare custom : string | undefined | null
}

Kantor.init(
    {
        kode_kantor : {
            type : DataTypes.INTEGER,
            allowNull : false,
            primaryKey : true,
            autoIncrement : true
        },
        kode_vendor : {
            type : DataTypes.INTEGER,
            allowNull : true
        },
        alamat : {
            type : DataTypes.STRING,
            allowNull : true
        },
        kode_kepemilikan : {
            type : DataTypes.STRING,
            allowNull : true
        },
        file_foto : {
            type : DataTypes.BOOLEAN,
            allowNull : true,
            defaultValue : true
        },
        is_foto_selamanya : {
            type : DataTypes.STRING,
            allowNull : true
        },
        foto_berlaku_awal : {
            type : DataTypes.DATE,
            allowNull : true
        },
        foto_berlaku_akhir : {
            type : DataTypes.DATE,
            allowNull : true
        },
        encrypt_key : {
            type : DataTypes.STRING,
            allowNull : true
        },
        custom : {
            type : DataTypes.JSONB,
            allowNull : true
        },
    },
    {
        sequelize : db, 
        schema : "public",
        tableName : "ref_kantor",
        modelName : "Kantor",
        timestamps : false
    }
)

Kantor.belongsTo(Vendor, {
    foreignKey : "kode_vendor",
    as : "Vendor"
})

Vendor.hasMany(Kantor, {
    foreignKey : "kode_vendor",
    as : "Kantor"
})


export default Kantor