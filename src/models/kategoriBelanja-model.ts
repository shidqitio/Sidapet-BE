import db from "@config/database";
import { DataTypes, Optional, Model } from "sequelize";

export enum status_persetujuan  {
    belum_proses = "belum_proses",
    proses = "proses",
    terima = "terima",
    tolak = "tolak"
}

interface IKategoriBelanjaAttributes {
	kode_kategori_belanja: number
	nama_kategori_belanja: string | undefined | null
	status_persetujuan   : string | undefined | null
	email_verif          : string | undefined | null
	waktu                : Date | undefined
	udcr                 : Date | undefined
}

export type KategoriBelanjaOutput = Required<IKategoriBelanjaAttributes>

export type KategoriBelanjaInput = Optional<
IKategoriBelanjaAttributes, 
"kode_kategori_belanja" |
"status_persetujuan" |
"waktu" |
"udcr" 
>

class KategoriBelanja 
    extends Model<IKategoriBelanjaAttributes, KategoriBelanjaInput>
    implements IKategoriBelanjaAttributes
{
    declare kode_kategori_belanja: number;
	declare nama_kategori_belanja: string | undefined | null;
	declare status_persetujuan   : string | undefined | null;
	declare email_verif          : string | undefined | null;
	declare waktu                : Date | undefined;
	declare udcr                 : Date | undefined;
}

KategoriBelanja.init(
    {
        kode_kategori_belanja : {
            type : DataTypes.INTEGER(),
            allowNull : false,
            primaryKey : true,
            autoIncrement : true
        },
        nama_kategori_belanja : {
            type : DataTypes.STRING,
            allowNull : true,
        },
        status_persetujuan : {
            type : DataTypes.ENUM("belum_proses", "proses", "terima", "terima"),
            allowNull : false,
        },
        email_verif : {
            type : DataTypes.STRING,
            allowNull : true,
        },
        waktu : {
            type : DataTypes.DATE,
            allowNull : true,
        },
        udcr : {
            type : DataTypes.STRING,
            allowNull : true,
        },
    },
    {
        sequelize : db, 
        schema : "public",
        tableName : "ref_kategori_belanja",
        modelName : "KategoriBelanja",
        timestamps : false
    }
)




export default KategoriBelanja