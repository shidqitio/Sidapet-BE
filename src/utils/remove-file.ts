import path from "path";
import fs from "fs/promises";
import { errorLogger } from "@config/logger";

const removeFile = async (filePath: string) => {
  const file = path.join(__dirname, `../../${filePath}`);
  try {
    await fs.unlink(file);
  } catch (error) {
    errorLogger.error(`ERROR REMOVE FILE: ${error}`);
  }
};

const removeFileName = async (existFile: URL) => {
  try {
    const filePath = existFile.pathname;
    const file = path.join(__dirname, `../../${filePath}`);
    await fs.unlink(file);
  } catch (error) {
    errorLogger.error(`ERROR REMOVE FILE NAME: ${error}`);
  }
};

const removeByLastNameAplikasi = async (fileName:string) => {
  try {
    let part = fileName.split("/")
    let lastPart = part[part.length - 1]
    return lastPart
  } catch (error) {
    errorLogger.error(`ERROR REMOVE FILE BY NAME: ${error}`)
  }
};

export { removeFile, removeFileName, removeByLastNameAplikasi };
