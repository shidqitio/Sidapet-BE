import db from "@config/database";
import { DataTypes, Optional, Model } from "sequelize";


interface IJenjangPendidikanAttributes {
    kode_jenjang_pendidikan : number,
    jenjang_pendidikan : string,
}

export type JenjangPendidikanOutput = Required<IJenjangPendidikanAttributes>

export type JenjangPendidikanInput = Optional<
IJenjangPendidikanAttributes, 
"kode_jenjang_pendidikan" | 
"jenjang_pendidikan"
>

class JenjangPendidikan 
    extends Model<IJenjangPendidikanAttributes, JenjangPendidikanInput>
    implements IJenjangPendidikanAttributes
{
    declare kode_jenjang_pendidikan : number
    declare jenjang_pendidikan : string
}

JenjangPendidikan.init(
    {
        kode_jenjang_pendidikan : {
            type : DataTypes.INTEGER,
            allowNull : false,
            primaryKey : true,
            autoIncrement : true
        },
        jenjang_pendidikan : {
            type : DataTypes.STRING,
            allowNull : true
        },
    },
    {
        sequelize : db, 
        schema : "public",
        tableName : "ref_jenjang_pendidikan",
        modelName : "JenjangPendidikan",
        timestamps : false
    }
)




export default JenjangPendidikan