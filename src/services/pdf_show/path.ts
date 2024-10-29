import axios, {AxiosInstance} from "axios";
import getConfig from "@config/dotenv";
import https from "https"

const pdfUploadShow : AxiosInstance = axios.create({
    baseURL : `${getConfig("PDF_SHOW_UPLOAD_BASE_URL")}`,
    timeout : 60000,
    httpsAgent: new https.Agent({
        rejectUnauthorized : false
    }),
    timeoutErrorMessage : "Harap Periksa Kembali Koneksi Anda",
    headers : {
        Accept: "application/json"
    }
})

export default pdfUploadShow

export const PDF_UPLOAD_SERVICE_PATH = {
    SHOW : "/shows-doc/pdf"
}