import Promiseuser, { PROMISEUSER_PATH } from "./path";

export type TokenPromiseuser = {
  id_user: number;
  kodeGroup: string;
  token: string,
  level: number
}

export type RegisterExternal = {
  id : number; 
  email : string;
  username : string | null | undefined;
  password : string;
  statusPengguna : string;
}


const checkTokenPromiseuser = async (
  data: TokenPromiseuser,
  token: string): Promise<[any | null, any | null]> => {
  try {
    const response = await Promiseuser.post(PROMISEUSER_PATH.TOKEN, {
      id_user: data.id_user,
      kode_group: data.kodeGroup,
      token: data.token,
      level: data.level
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    const result = response.data;


    if (result.status === "success") {
      return [result.data, null]
    }
    return [null, result.message]
  } catch (error : any) {
    return [null, error?.response?.data?.message];
    // if (error instanceof Error) {
    //   return [null, error.message];
    // }
    // return [null, "Internal server error"];
  }
}

const userProfile = async (
  params: TokenPromiseuser,
  token: string): Promise<[any | null, any | null]> => {
  try {


    const response = await Promiseuser.get(PROMISEUSER_PATH.USER_PROFILE + `/${params.id_user}`, {

      // headers : {
      //     Authorization : `Bearer ${token}`
      // }
    })


    const result = response.data;

    if (result.status === "success") {
      return [result.data, null]
    }
    return [null, result.message]
  } catch (error) {
    if (error instanceof Error) {
      return [null, error.message];
    }
    return [null, "Internal server error"];
  }
}

const checkEmail = async (email : string) : Promise<[any | null, any | null]> => {
  try {
      
      const response = await Promiseuser.post(PROMISEUSER_PATH.Email, {
          email : email
      })
      const result = response.data;

      if(result.status === "success"){
          return [result.data,null]
      }

      
      return [null,result.message]

  } catch (error) {        
      if (error instanceof Error) {
          return [null, error.message];
        }
        return [null, "Internal server error"];
      }
  }

const registerExternal = async (data : RegisterExternal) : Promise<[any | null, any | null]> => {
  try {
      const response = await Promiseuser.post(PROMISEUSER_PATH.REGISTER_EXTERNAL,data)
      const result = response.data;

      
      

      if(result.status === "success"){
          return [result.data,null]
      }
      return [null,result.message]
  }
  catch (error : any) {
      if (error instanceof Error) {
          return [null, error.message];
        }
        return [null, "Internal server error"];
      }
  }


export { 
  checkTokenPromiseuser, 
  userProfile,
  checkEmail,
  registerExternal }