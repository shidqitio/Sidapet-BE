import db from "@config/database";
import { DataTypes, Optional, Model } from "sequelize";
import Vendor from "./vendor-model";


interface IPengalamanPeroranganAttributes {
	kode_pengalaman : number
	kode_vendor : number
	nm_pnglmn_org : string | undefined | null
	path_pnglmn : string | undefined | null
	custom : string | undefined | null
	encrypt_key : string | undefined | null
}

export type PengalamanPeroranganOutput = Required<IPengalamanPeroranganAttributes>

export type PengalamanPeroranganInput = Optional<
IPengalamanPeroranganAttributes, 
"kode_pengalaman" |
"kode_vendor" |
"encrypt_key"
>

class PengalamanPerorangan 
    extends Model<PengalamanPeroranganOutput, PengalamanPeroranganInput>
    implements PengalamanPeroranganOutput
{
    declare kode_pengalaman : number;
    declare kode_vendor : number;
    declare nm_pnglmn_org : string | undefined | null;
    declare path_pnglmn : string | undefined | null;
    declare custom : string | undefined | null;
    declare encrypt_key : string | undefined | null;
    
}

PengalamanPerorangan.init(
    {
        kode_pengalaman : {
            type : DataTypes.STRING,
            allowNull : false,
            primaryKey : true, 
            autoIncrement : true
        },
        kode_vendor : {
            type : DataTypes.STRING,
            allowNull : true
        },
        nm_pnglmn_org : {
            type : DataTypes.STRING,
            allowNull : true
        },
        path_pnglmn : {
            type : DataTypes.STRING,
            allowNull : true
        },
        custom : {
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
        tableName : "ref_pengalaman_perorangan",
        modelName : "PengalamanPerorangan",
        timestamps : false
    }
)

PengalamanPerorangan.belongsTo(Vendor, {
    foreignKey : "kode_vendor", 
    as : "Vendor"
})

Vendor.hasMany(PengalamanPerorangan, {
    foreignKey : "kode_vendor",
    as : "PengalamanPerorangan"
})




export default PengalamanPerorangan