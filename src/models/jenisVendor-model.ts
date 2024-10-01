import db from "@config/database";
import { DataTypes, Optional, Model } from "sequelize";

interface IJenisVendorAttributes {
  kode_jenis_vendor : number;
  jenis_vendor : string;
}


export type JenisVendorOutputu = Required<IJenisVendorAttributes> 

export type JenisVendorInput = Optional<
IJenisVendorAttributes,
"kode_jenis_vendor">


class JenisVendor 
    extends Model<IJenisVendorAttributes, JenisVendorInput>
    implements IJenisVendorAttributes
{
    declare kode_jenis_vendor : number;
    declare jenis_vendor : string;
}

JenisVendor.init(
    {
        kode_jenis_vendor : {
            type : DataTypes.INTEGER,
            primaryKey : true,
            autoIncrement : true,
        },
        jenis_vendor : {
            type : DataTypes.STRING,
            allowNull : false,
        }
    },
    {
        sequelize : db,
        schema : "public",
        tableName : "ref_jenis_vendor",
        modelName : "JenisVendor",        
        timestamps : false,
    }
)

export default JenisVendor;




