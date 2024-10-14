import axios, { AxiosInstance } from "axios";
import getConfig from "@config/dotenv";
import https from "https"


const Promiseuser:AxiosInstance = axios.create({
    baseURL : `${getConfig("USMAN_BASE_URL")}/api/v1`,
    timeout : 60000,
    httpsAgent : new https.Agent({
        rejectUnauthorized : false
    }),
    timeoutErrorMessage : "Harap Periksa Kembali Koneksi Anda",
    headers : {
        Accept : "application/json"
    }
})

export default Promiseuser

export const PROMISEUSER_PATH = {
    TOKEN: "/akses/check-token",
    USER_PROFILE: "/users/user-profile",
    Email: "/users/search/email",
    REGISTER_EXTERNAL : "/akses/register-eksternal"
}