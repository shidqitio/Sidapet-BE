import { Response } from "express";
import { responseStatus } from "@utils/prefix";

interface IResponseSuccess {
  code: number;
  status: string;
  message: string;
  data?: any;
  meta: any;
}

const responseSuccess = (res: Response, code: number, status: string, message: string, data?: any, metaPage?: any, metaLimit?: any) => {

  const limit = (!metaLimit) ? 10 : parseInt(metaLimit)
  const countData = (!data || !data.length) ? 0 : data.length;
  const pageData = (!metaPage) ? (((!data) ? 0 : ((!data.length) ? 0 : data.length)) / limit) : parseInt(metaPage)

  const response: IResponseSuccess = {
    code: code,
    status: status,
    message: message,
    data: data,
    meta: {
      count: countData,
      page: (pageData < 1) ? ((!data || !data.length) ? 0 : 1) : pageData,
      limit: (!data || (!data.length)) ? 0 : limit
    }
  };
  return res.json(response);
};

const responseSuccessCount = (res: Response, code: number, status: string, message: string, data?: any, metaPage?: any, metaLimit?: any, count?: number) => {

  const limit = (!metaLimit) ? 10 : parseInt(metaLimit)
  const countData = !count ? ((!data || !data.length) ? 0 : data.length ) : count
  const pageData = (!metaPage) ? (((!data) ? 0 : ((!data.length) ? 0 : data.length)) / limit) : parseInt(metaPage)
  

  const response: IResponseSuccess = {
    code: code,
    status: status,
    message: message,
    data: data,
    meta: {
      count: countData,
      page: (pageData < 1) ? ((!data || !data.length) ? 0 : 1) : pageData,
      limit: (!data || (!data.length)) ? 0 : limit
    }
  };
  return res.json(response);
};

export { responseSuccess, responseSuccessCount };
