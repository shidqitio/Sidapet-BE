import moment from "moment"
import { SHA256, HmacSHA256 } from "crypto-js";
import getConfig from "@configs/dotenv";

const generateHeaderWithSignature = async (methd : any, apiUrl : any, data : any) => {
  try {
    const method = methd;

    const url = apiUrl;
    const urlParts = url.split("/");
    const path = "/" + urlParts.slice(3).join("/");

    const apiKey = getConfig("API_KEY");

    const body : any = await SHA256(data);
    console.log("TES KIRIM : ", body)
    const bodyLower = body.toLowerCase();

    const date = moment().format();

    const payloads = `${method}:${path}:${apiKey}:${bodyLower}:${date}`;
    const signature = await HmacSHA256(payloads, getConfig("CRYPTO_KEY"));

    const headers = {
      "Content-type": "application/json",
      "x-api-key": apiKey,
      signature: signature,
      timestamp: date,
      "key": "TUKANGBANGUNANSINARSURYA"
    };

    return headers;
  } catch (error) {
    throw error;
  }
};

export default {
  generateHeaderWithSignature
}