import multer, { FileFilterCallback, Multer } from "multer";
import fs from "fs/promises";
import CustomError from "@middleware/error-handler";
import { Request } from "express";
import { httpCode } from "@utils/prefix";
import getConfig from "@config/dotenv";

// jenis file
enum FileType {
  UserPhoto = "userphoto",
  Aplikasi = "aplikasi",
  Invoice = "invoice",
  PdfProfil = 'pdfprofil',
  Pengumuman = "pengumuman",
  Multiupload = "multiupload",
  Temporary = "temporary"
}

// path file
const destinationMap: Record<FileType, string> = {
  [FileType.Aplikasi]: "./public/aplikasi",
  [FileType.Invoice]: "./public/invoice",
  [FileType.UserPhoto] : getConfig('SIDAPET_SAVED_FOTO'),
  [FileType.PdfProfil] : getConfig('SIDAPET_SAVE_PDF'),
  [FileType.Pengumuman] : getConfig('CUSTOM_SAVE_FILE'),
  [FileType.Multiupload] : getConfig("PDF_MULTI_UPLOAD"),
  [FileType.Temporary] : getConfig("SIDAPET_TEMPO_FILE")
};

const allowedMimeTypesImage = ["image/jpeg", "image/png", "image/jpg"];
const allowedMimeTypesPdf = ["application/pdf"];
const allowMimeTypesCustom = ["application/pdf", "image/jpeg", "image/png", "image/jpg" ]

const storage = multer.diskStorage({
  destination: async (req , file, callback) => {
    let type: FileType = req.body.type;
    if (!type) {
      type = FileType.Temporary
    }

    // if (!(type in destinationMap)) {
    //   return callback(
    //     new Error(
    //       `Type file harus salah satu dari ${Object.values(FileType).join("|")}`
    //     ),
    //     ""
    //   );
    // }

    const folderPath = destinationMap[type];

    try {
      await fs.access(folderPath);
    } catch (error) {
      await fs.mkdir(folderPath, { recursive: true });
    }
    callback(null, folderPath);
  },
  filename: async (req , file, callback) => {
    const type: FileType = req.body.type;
    const name = Date.now();

    if (allowedMimeTypesImage.includes(file.mimetype)) {
      const fileName = `${type}-${name}.png`;
      callback(null, fileName);
    }

    if (allowedMimeTypesPdf.includes(file.mimetype)) {
      const fileName = `${type}-${name}.pdf`;
      callback(null, fileName);
    }
  },
});

const fileFilterImage = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (allowedMimeTypesImage.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
    cb(
      new CustomError(
        httpCode.unsupportedMediaType,
        "error",
        `Format file harus berupa ${allowedMimeTypesImage.join(" | ")}`
      )
    );
  }
};

const fileFilterPdf = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (allowedMimeTypesPdf.includes(file.mimetype)) {
    cb(null, true);
  } else {
    console.log("ERROR TERLALU ")
    cb(null, false);
    cb(
      new CustomError(
        httpCode.unsupportedMediaType,
        "error",
        `Format file harus berupa ${allowedMimeTypesPdf.join(" | ")}`
      )
    );
  }
};

const uploadImage: Multer = multer({
  storage,
  fileFilter: fileFilterImage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

const uploadPdf: Multer = multer({
  storage, 
  fileFilter : fileFilterPdf, 
  limits : {fileSize: 10000 * 1024 * 1024 }
})

export { uploadImage, uploadPdf };
