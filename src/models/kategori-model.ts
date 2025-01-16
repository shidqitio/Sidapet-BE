import db from "@config/database";
import { DataTypes, Optional, Model } from "sequelize";



interface IKategoriAttributes {
	kode_kategori: number
	nama_kategori: string | undefined | null
}

export type KategoriOutput = Required<IKategoriAttributes>

export type KategoriInput = Optional<
IKategoriAttributes, 
"kode_kategori" |
"nama_kategori" 
>

class Kategori 
    extends Model<IKategoriAttributes, KategoriInput>
    implements IKategoriAttributes
{
    declare kode_kategori: number;
    declare nama_kategori: string | null | undefined;
}

Kategori.init(
    {
        kode_kategori : {
            type : DataTypes.INTEGER(),
            allowNull : false,
            primaryKey : true,
            autoIncrement : true
        },
        nama_kategori : {
            type : DataTypes.STRING,
            allowNull : true,
        },
    },
    {
        sequelize : db, 
        schema : "public",
        tableName : "ref_kategori",
        modelName : "Kategori",
        timestamps : false
    }
)




export default Kategori