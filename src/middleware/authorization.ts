import { Request, Response, NextFunction } from "express";
import { IncomingHttpHeaders } from "http";
import CustomError from "@middleware/error-handler";
import { httpCode, responseStatus } from "@utils/prefix";
import { TokenPromiseuser, checkTokenPromiseuser, userProfile } from "@services/usman";
import RegisterVendor from "@models/registerVendor-model";

interface HeaderAuth extends IncomingHttpHeaders {
  id_user?: string;
  kode_group?: string;
  token?: string;
  api_token?: string;
}

type UserAuth = {
  id: number;
  email: string;
  token: string;
  api_token : string;
  level: number
  is_login: string | null;
};

type UserProfile  = {
  id : number
  username : string,
  email : string, 
  user_photo : string | null | undefined,
  status_user : string | null | undefined
}



export type UserData = {
  id       : number;
  token    : string;
  api_token: string;
  kode_group: string;
  is_login : string | null;
  username : string; 
  email : string;
  status_user : string | null | undefined;
  kode_vendor : number | null | undefined;
};

declare global {
  namespace Express {
    interface Request {
      user: UserData;
    }
  }
}

const authorization = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id_user, kode_group, token, api_token }: HeaderAuth =
      req.headers;


    if (!id_user || !kode_group || !token || !api_token) {
      throw new CustomError(httpCode.unauthorized, responseStatus.error, "Unauthorized[1]");
    }

    let id : number | undefined

    if(typeof id_user === 'string'){
      id = parseInt(id_user, 10) // Parse String To an Integer
    } else {
      id = undefined;
      throw new Error("Invalid id_user")
    }

    if (
      typeof token === "string" &&
      token.split(" ")[0] === "Bearer"
    ) {
      throw new CustomError(httpCode.unauthorized, responseStatus.error, "Unauthorized[2]");
    }

        const route = req.baseUrl;
        const startIndex = route.indexOf("/v1/") + 4;  // Find index right after "/v1/"
        const endIndex = route.indexOf("/", startIndex);  // Find the next '/' after "/v1/"
        const number = route.substring(startIndex, endIndex);  // Extract the substring between these indices
        const level = parseInt(number)
        
  
        

    const data : TokenPromiseuser = {
      id_user: id,
      kodeGroup: kode_group,
      token: api_token,
      level: level
    }

    const [user, errorSipuser] : [UserAuth, string] = await checkTokenPromiseuser(
      data, 
      token
    )

    

    if(errorSipuser) {
      throw new CustomError(httpCode.unauthorized, responseStatus.error,  errorSipuser)
    }


    const [userProf, errorUserProfile] : [UserProfile, string] = await userProfile(data, token)

    

    if(errorUserProfile){
      throw new CustomError(httpCode.unauthorized, responseStatus.error, errorUserProfile)
    }

    let exRegisterVendor = await RegisterVendor.findOne({
      attributes : ["kode_vendor"],
      where : {
        email : userProf.email
      }
    })

    let idVendor

    if(!exRegisterVendor) {
      idVendor = null
    } 
    else {
      idVendor = exRegisterVendor.kode_vendor
    }

    

    const userData : UserData = {
      token: token,
      id: user.id,
      kode_group: kode_group,
      api_token: user.api_token,
      is_login: user.is_login,
      username : userProf ? userProf.username : "",
      email : userProf ? userProf.email : "",
      status_user : userProf ? userProf.status_user : "",
      kode_vendor : idVendor
      };

    req.user = userData;



    next();
  } catch (err) {
    next(err);
  }
};

export default authorization;