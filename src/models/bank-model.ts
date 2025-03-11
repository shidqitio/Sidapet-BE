import db from "@config/database";
import { DataTypes, Optional, Model } from "sequelize";




interface IBankAttributes {
    kode_bank : number,
    sandi_bank : string,
    nama_bank : string
}

export type BankOutput = Required<IBankAttributes>

export type BankInput = Optional<
IBankAttributes, 
"kode_bank" |
"sandi_bank" |
"nama_bank" 
>

class Bank 
    extends Model<IBankAttributes, BankInput>
    implements IBankAttributes
{
    declare kode_bank : number;
    declare sandi_bank : string;
    declare nama_bank : string;
}

Bank.init(
    {
        kode_bank : {
            type : DataTypes.INTEGER,
            allowNull : false,
            primaryKey : true,
            autoIncrement : true
        },
        sandi_bank : {
            type : DataTypes.STRING,
            allowNull : true,
        },
        nama_bank : {
            type : DataTypes.STRING,
            allowNull : true,
        },
    },
    {
        sequelize : db, 
        schema : "public",
        tableName : "ref_bank",
        modelName : "Bank",
        timestamps : false
    }
)




export default Bank