import pdfUpload, {PDF_UPLOAD_SERVICE_PATH} from "./path"

import FormData from "form-data"


export type UploadPdf = {
    nama_aplikasi : string,
    file : Express.Multer.File
}


const uploadPdf = async (
    data:FormData) : Promise<[any | null, any | null]> => {
    try {
        const response = await pdfUpload.post(PDF_UPLOAD_SERVICE_PATH.UPLOAD, data, {
            headers : {
                "Content-Type" : "multipart/form-data"
            }
        }

    )

        const result = response.data

        console.log("TES DAH : ", result.data)

        if(result.status === "success"){
            return [result.data[0],null]
        }
        return [null,result.message]
    } catch (error) {
        if (error instanceof Error) {
            return [null, error.message];
          }
          return [null, "Internal server error"];
    }
}

export {uploadPdf}