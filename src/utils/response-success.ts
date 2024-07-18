import { Response } from "express";
import { responseStatus } from "@utils/prefix";

interface IResponseSuccess {
  code: number;
  status: string;
  message: string;
  data?: any;
}

const responseSuccess = (res: Response, code: number, message: string, data?: any) => {
  const response: IResponseSuccess = {
    code: code,
    status: responseStatus.success,
    message: message,
    data: data,
  };
  return res.json(response);
};

export { responseSuccess };
