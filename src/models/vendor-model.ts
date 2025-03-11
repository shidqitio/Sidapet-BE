import db from "@config/database";
import { DataTypes, Optional, Model } from "sequelize";
import JenisVendor from "./jenisVendor-model";
import RegisterVendor from "./registerVendor-model";


interface IVendorAttributes {
  kode_vendor : number;
  kode_jenis_vendor : number;
  nama_perusahaan : string;
  is_tetap : boolean;
  is_email_verified : boolean;
  udcr : Date | undefined;
  udch : Date | undefined;
}


export type VendorOutput = Required<IVendorAttributes> 

export type VendorInput = Optional<
IVendorAttributes,
"kode_vendor" | 
"nama_perusahaan" |
"udch" | 
"udcr" | 
"is_email_verified" |
"is_tetap">


class Vendor 
    extends Model<IVendorAttributes, VendorInput>
    implements IVendorAttributes
{
    declare kode_vendor : number;
    declare kode_jenis_vendor : number;
    declare nama_perusahaan : string;
    declare is_tetap : boolean;
    declare is_email_verified: boolean;
    declare udcr : Date | undefined;
    declare udch : Date | undefined;
}

Vendor.init(
    {
        kode_vendor : {
            type : DataTypes.STRING, 
            allowNull : false,
            autoIncrement : true,
            primaryKey : true
        },
        kode_jenis_vendor : {
            type : DataTypes.INTEGER, 
            allowNull : true
        },
        nama_perusahaan : {
            type : DataTypes.STRING(100), 
            allowNull : true
        },
        is_tetap : {
            type : DataTypes.BOOLEAN(), 
            allowNull : true,
            defaultValue : false
        },
        is_email_verified : {
            type : DataTypes.BOOLEAN(),
            defaultValue : false,
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
        tableName : "ref_vendor",
        modelName : "Vendor",        
        createdAt : "udcr",
        updatedAt : "udch"
    }
)

Vendor.belongsTo(JenisVendor, {
    foreignKey : "kode_jenis_vendor",
    as : "JenisVendor",
})

JenisVendor.hasMany(Vendor, {
    foreignKey : "kode_jenis_vendor",
    as : "Vendor"
})




export default Vendor;




