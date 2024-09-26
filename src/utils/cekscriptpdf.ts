import { PythonShell } from "python-shell";
import fs from "fs";

const cekScriptPdf = async (sourcenamepdf: string) => {
  try {

      const scanScript = await PythonShell.run("./src/python/scanscriptpdf.py", {
        args: [sourcenamepdf],
      })    

      
      const encryptPdf = await PythonShell.run("./src/python/encryptpdf.py",{
        args:[sourcenamepdf]
       })

       return encryptPdf[0]

      //  if(encryptPdf.length !== 0) {
        
      //  }

    //   PythonShell.run("./src/python/scanscriptpdf.py", {
    //   args: [sourcenamepdf],
    // }).then((py1) => {
    //   PythonShell.run("./src/python/encryptpdf.py",{
    //     args:[sourcenamepdf]
    //    }).then((data)=>{
    //     console.log("TES LOG : ", data[0])
    //     return data[0];
    //    })
    // })
    // .catch((err) => {
    //   throw err
    // })
  } catch (err) {
    fs.unlink(sourcenamepdf,(err)=>{
      if(err){
        console.log(err);
        return
      }
    })
    throw err
  }
};

export default cekScriptPdf