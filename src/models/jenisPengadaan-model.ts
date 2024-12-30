import db from "@config/database";
import { DataTypes, Optional, Model } from "sequelize";

interface IJenisPengadaanAttributes {
    kode_jenis_pengadaan : number
    jenis_pengadaan : string 
}

export type JenisPengadaanOutput = Required<IJenisPengadaanAttributes>

export type JenisPengadaanInput = Optional<
IJenisPengadaanAttributes,
"kode_jenis_pengadaan"
>

class JenisPengadaan
    extends Model<IJenisPengadaanAttributes, JenisPengadaanInput>
    implements IJenisPengadaanAttributes
{
    declare kode_jenis_pengadaan: number;
    declare jenis_pengadaan: string;
}

JenisPengadaan.init(
    {
        kode_jenis_pengadaan : {
            type : DataTypes.INTEGER(),
            allowNull : false, 
            primaryKey : true
        },
        jenis_pengadaan : {
            type : DataTypes.STRING,
            allowNull : true
        }
    },
    {
        sequelize : db, 
        schema : "public",
        tableName : "ref_jenis_pengadaan",
        modelName : "JenisPengadaan",
        timestamps : false
    }
)

export default JenisPengadaan