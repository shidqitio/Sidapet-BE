import getConfig from "@configs/dotenv"
import { Request, Response, NextFunction } from "express"
import { debugLogger } from "@configs/logger"
import axios from "axios"
import CustomError from "./error-handler"
import { httpCode } from "@utils/prefix"
import * as ip from 'ip';


const authCaptcha = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const response = req.body.response;
        const clientIp: string | undefined = req.headers['x-forwarded-for'] as string || req.socket.remoteAddress;
        const secretCaptcha = getConfig("SECRET_KEY_CAPTCHA");
        const apiCaptcha = getConfig("API_CAPTCHA");

        if (!response) throw new CustomError(httpCode.unauthorized, "error", "Unauthorized: 1")

        const convertedIp = ip.toString(ip.toBuffer(clientIp ? clientIp : ""));

        const checkIp = ip.isV6Format(clientIp ? clientIp : "")

        if (checkIp === false) throw new CustomError(httpCode.badRequest, "error", "IP not available")

        const validationCaptcha = await axios.post(`${apiCaptcha}?secret=${secretCaptcha}&response=${response}&remoteip=${convertedIp}`)

        if (!validationCaptcha) throw new CustomError(httpCode.unauthorized, "error", "Unauthorized: 2")

        if (validationCaptcha.data.success === false) throw new CustomError(httpCode.unauthorized, "error", "Unauthorized: 3");

        next();
    } catch (error) {
        debugLogger.error("error auth captcha : ", error)
        next(error);
    }
}

export default authCaptcha