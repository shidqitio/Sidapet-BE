import pdfUploadShow, {PDF_UPLOAD_SERVICE_PATH} from "./path"


export type ShowPdf = {
    nama_file : string,
    keypass : string
}



const showFile = async (data:ShowPdf) : Promise<[any | null, any | null]> => {
    try {
        const response = await pdfUploadShow.get(`${PDF_UPLOAD_SERVICE_PATH.SHOW}/${data.nama_file}/${data.keypass}`,{
            responseType : "stream"
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