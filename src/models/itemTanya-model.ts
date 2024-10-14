import db from "@config/database";
import { DataTypes, Optional, Model } from "sequelize";
import JenisVendor from "./jenisVendor-model";
import KatItemTanya from "./katItemTanya-model";

export enum tipe_input {
    text = "text",
    textarea = "textarea",
    select = "select",
    checkbox = "checkbox",
    file = "file",
    table = "table"
}

export enum jenis_item {
    default = "default",
    custom = "custom"
}

interface IItemTanya {
    kode_item : number
	kode_jenis_vendor : number | undefined | null
	kode_kat_item_tanya : number | undefined | null
	urutan : number | undefined | null
	nama_item : string | undefined | null
	keterangan : string | undefined | null
	tipe_input : tipe_input
	metadata : string | undefined | null
	jenis_item : jenis_item
	ucr : string | undefined | null
	uch : string | undefined | null
	udcr : Date | undefined
	udch : Date | undefined
}

export type ItemTanyaOutput = Required<IItemTanya>

export type ItemTanyaInput = Optional<
IItemTanya, 
"kode_item" |
"kode_jenis_vendor" |
"kode_kat_item_tanya" | 
"urutan" |
"tipe_input" |
"jenis_item" |
"ucr" |
"uch" |
"udcr" |
"udch"
>

class ItemTanya 
    extends Model<IItemTanya, ItemTanyaInput>
    implements IItemTanya
{
    declare kode_item : number ;
    declare kode_jenis_vendor : number | undefined | null ;
    declare kode_kat_item_tanya : number | undefined | null ;
    declare urutan : number | undefined | null ;
    declare nama_item : string | undefined | null ;
    declare keterangan : string | undefined | null ;
    declare tipe_input : tipe_input ;
    declare metadata : string | undefined | null ;
    declare jenis_item : jenis_item ;
    declare ucr : string | undefined | null ;
    declare uch : string | undefined | null ;
    declare udcr : Date | undefined ;
    declare udch : Date | undefined ;
}

ItemTanya.init(
    {
        kode_item : {
            type : DataTypes.INTEGER, 
            allowNull : false,
            primaryKey : true,
            autoIncrement : true
        },
        kode_jenis_vendor : {
            type : DataTypes.INTEGER, 
            allowNull : false
        },
        kode_kat_item_tanya : {
            type : DataTypes.INTEGER, 
            allowNull : false
        },
        urutan : {
            type : DataTypes.INTEGER, 
            allowNull : true
        },
        nama_item : {
            type : DataTypes.STRING, 
            allowNull : false
        },
        keterangan : {
            type : DataTypes.STRING, 
            allowNull : true
        },
        tipe_input : {
            type : DataTypes.ENUM("text", "textarea", "select", "checkbox", "file", "table"), 
            allowNull : true
        },
        metadata : {
            type : DataTypes.STRING, 
            allowNull : true
        },
        jenis_item : {
            type : DataTypes.ENUM("default", "custom"), 
            allowNull : true
        },
        ucr : {
            type : DataTypes.STRING, 
            allowNull : true
        },
        uch : {
            type : DataTypes.STRING, 
            allowNull : true
        },
        udcr : {
            type : DataTypes.DATE, 
            allowNull : true
        },
        udch : {
            type : DataTypes.DATE, 
            allowNull : true
        },
    },
    {
        sequelize : db, 
        schema : "public",
        tableName : "ref_item_tanya",
        modelName : "ItemTanya",
        createdAt : "udcr",
        updatedAt : "udch"
    }
)

ItemTanya.belongsTo(JenisVendor, {
    foreignKey : "kode_jenis_vendor",
    as : "JenisVendor"
})

JenisVendor.hasMany(ItemTanya, {
    foreignKey : "kode_jenis_vendor",
    as : "ItemTanya"
})

ItemTanya.belongsTo(KatItemTanya, {
    foreignKey : "kode_kat_item_tanya",
    as : "KatItemTanya"
})

KatItemTanya.hasMany(ItemTanya, {
    foreignKey : "kode_kat_item_tanya",
    as : "ItemTanya"
})


export default ItemTanya