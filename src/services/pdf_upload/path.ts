import axios, {AxiosInstance} from "axios";
import getConfig from "@config/dotenv";
import https from "https"

const pdfUpload : AxiosInstance = axios.create({
    baseURL : `${getConfig("PDF_UPLOAD_BASE_URL")}`,
    timeout : 60000,
    httpsAgent: new https.Agent({
        rejectUnauthorized : false
    }),
    timeoutErrorMessage : "Harap Periksa Kembali Koneksi Anda",
    headers : {
        Accept: "application/json"
    }
})

export default pdfUpload

export const PDF_UPLOAD_SERVICE_PATH = {
    UPLOAD : "/uploads/pdf",
    SHOW : "/shows-doc/pdf",
    DELETE_UPLOAD : "/remove-file"
}