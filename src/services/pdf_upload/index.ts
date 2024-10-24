import pdfUpload, {PDF_UPLOAD_SERVICE_PATH} from "./path"

import FormData from "form-data"


export type UploadPdf = {
    nama_aplikasi : string,
    file : Express.Multer.File
}

export type ShowPdf = {
    nama_file : string,
    keypass : string
}

export type Delete = {
    nama_file : string
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

const showFile = async (data:ShowPdf) : Promise<[any | null, any | null]> => {
    try {
        const response = await pdfUpload.get(`${PDF_UPLOAD_SERVICE_PATH.DELETE_UPLOAD}/${data.nama_file}/${data.keypass}`)

        const result = response.data

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

const deleteFile = async (data:Delete["nama_file"]) : Promise<[any | null, any | null]> => {
    try {
        const response = await pdfUpload.delete(`${PDF_UPLOAD_SERVICE_PATH.DELETE_UPLOAD}/${data}`)

        const result = response.data

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

export {uploadPdf, showFile, deleteFile}