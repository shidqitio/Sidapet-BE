import getConfig from "@config/dotenv";
import CustomError from "@middleware/error-handler";
import { errorLogger, debugLogger } from "@config/logger";
import { httpCode, responseStatus } from "@utils/prefix";
import db from "@config/database";
import sequelize from "sequelize";
import { QueryTypes, Sequelize } from "sequelize";
import { setCache, getCache, delCache, flushAllCache } from "@cache/cache";

//Import Model 
import Vendor from "@models/vendor-model";

//Import Schema 
import {
 PayloadGetPenyediaSchema,
 ParameterSchema,
 QuerySchema
} from "@schema/api/vendor-schema"
import { Op } from "sequelize";


const getPenyediaLimitOffset = async (
    page : QuerySchema["query"]["page"],
    limit : QuerySchema["query"]["limit"]
) : Promise<any> => {
    try {
        let pages: number = parseInt(page);
        let limits: number = parseInt(limit);
        let offset = 0;
    
        if (pages > 1) {
          offset = (pages - 1) * limits;
        }
    
        const cacheKey = `all_penyedia_non_tetap_${page}_${limit}`
        const cachedPenyediaNonTetap = getCache(cacheKey)
    
        if(cachedPenyediaNonTetap) {
            return cachedPenyediaNonTetap
        }
    
        const {rows, count} = await Vendor.findAndCountAll({
            where : {
                is_tetap : false
            },
            limit : limits,
            offset : offset
        })
    
        const result = {
            vendor : rows, 
            count : count
        }
    
        console.log(result);
    
    
        
    
        setCache(cacheKey, result)
    
        return result
        
    } catch (error) {
         if(error instanceof CustomError) {
                throw new CustomError(error.code,error.status, error.message)
            } 
            else {
                debugLogger.debug(error)
                throw new CustomError(500, responseStatus.error, "Internal server error.")
            }
    }
}

const getPenyediaAll = async () : Promise<Vendor[]> => {
    try {
        const cacheKey = `all_penyedia_non_tetap`
        const cachedPenyediaNonTetap = getCache(cacheKey)

        if(cachedPenyediaNonTetap) {
            return cachedPenyediaNonTetap
        }

        const penyedia : Vendor[] = await Vendor.findAll({
            where : {
                is_tetap : false
            }
        })

        setCache(cacheKey, cachedPenyediaNonTetap)

        return penyedia
    

    } catch (error) {
        if(error instanceof CustomError) {
            throw new CustomError(error.code,error.status, error.message)
        } 
        else {
            debugLogger.debug(error)
            throw new CustomError(500, responseStatus.error, "Internal server error.")
        }
    }   
}

const getPenyediaByKode = async (request:PayloadGetPenyediaSchema["body"]) : Promise<any> => {
    try {
        const arr = []

        for(const vendor of request.vendor) {
            arr.push(vendor.kode_vendor)
        }

        const penyediaFind = await Vendor.findAll({
            where : {
                kode_vendor : {
                    [Op.in] : arr
                }
            }
        })

        return penyediaFind
    } catch (error) {
        if(error instanceof CustomError) {
            throw new CustomError(error.code,error.status, error.message)
        } 
        else {
            debugLogger.debug(error)
            throw new CustomError(500, responseStatus.error, "Internal server error.")
        }
    }
}

export default {
    getPenyediaLimitOffset,
    getPenyediaAll,
    getPenyediaByKode
}