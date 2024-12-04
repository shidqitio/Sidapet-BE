import pdfUploadShow, {PDF_UPLOAD_SERVICE_PATH} from "./path"


export type ShowPdf = {
    nama_file : string,
    keypass : string
}



const showFile = async (data:ShowPdf) : Promise<[any | null, any | null]> => {
    try {
        const response = await pdfUploadShow.post(`${PDF_UPLOAD_SERVICE_PATH.SHOW}`, {
            file_name : data.nama_file,
            keypass : data.keypass
        })

        const result = response.data

        if(response.status === 200){
            return [response.data,null]
        }
        return [null,result.message]

    } catch (error) {
         if (error instanceof Error) {
            return [null, error.message];
          }
          return [null, "Internal server error"];
    }
}


export {showFile}