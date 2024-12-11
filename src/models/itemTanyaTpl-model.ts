import db from "@config/database";
import { DataTypes, Optional, Model } from "sequelize";

// export enum tipe_input {
//     text = "text",
//     textarea = "textarea",
//     select = "select",
//     checkbox = "checkbox",
//     file = "file",
//     table = "table"
// }

// export enum jenis_item {
//     default = "default",
//     custom = "custom"
// }

interface IITemTanyaTplAttributes {
	kode_tpl : number
	nama_item : string | undefined | null
	keterangan : string | undefined | null
	tipe_input : string | undefined | null
	metadata : string | undefined | null
}

export type ItemTanyaTplOutput = Required<IITemTanyaTplAttributes>

export type ItemTanyaTplInput = Optional<
IITemTanyaTplAttributes,
"kode_tpl" |
"tipe_input" | 
"metadata"
>

class ItemTanyaTpl
    extends Model<IITemTanyaTplAttributes, ItemTanyaTplInput>
    implements IITemTanyaTplAttributes
{
    declare kode_tpl: number;
    declare nama_item: string | null | undefined;
    declare keterangan: string | null | undefined;
    declare tipe_input: string | null | undefined;
    declare metadata: string | null | undefined;
}

ItemTanyaTpl.init(
    {
        kode_tpl : {
            type : DataTypes.INTEGER(),
            allowNull : false,
            primaryKey : true,
            autoIncrement : true
        },
        nama_item : {
            type : DataTypes. STRING(),
            allowNull : true
        },
        keterangan : {
            type : DataTypes. STRING(),
            allowNull : true
        },
        tipe_input : {
            type : DataTypes. STRING(),
            allowNull : true
        },
        metadata : {
            type : DataTypes. STRING(),
            allowNull : true
        },
    },
    {
        sequelize : db, 
        schema : "public",
        tableName : "ref_item_tanya_tpl",
        modelName : "ItemTanyaTpl",
        timestamps : false
    }
)

export default ItemTanyaTpl