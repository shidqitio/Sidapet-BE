import db from "@config/database";
import { DataTypes, Optional, Model } from "sequelize";

interface ITipeInputAttributes {
    tipe_input : string ,
	regex_validation : string ,
}

export type TipeInputOutput = Required<ITipeInputAttributes>

export type TipeInputInput = Optional<
ITipeInputAttributes,
"regex_validation"
>

class TipeInput
    extends Model<ITipeInputAttributes, TipeInputInput>
    implements ITipeInputAttributes
    {
        declare tipe_input: string;
        declare regex_validation: string;
    }

TipeInput.init(
    {
        tipe_input : {
            type : DataTypes.STRING,
            allowNull : false,
            primaryKey : true
        },
        regex_validation : {
            type : DataTypes.STRING,
            allowNull : true
        },
    },
    {
        sequelize : db, 
        schema : "public",
        tableName : "ref_tipe_input",
        modelName : "TipeInput",
        timestamps : false
    }
)

export default TipeInput