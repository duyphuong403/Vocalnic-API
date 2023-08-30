import { Response } from "express";

const apiResponse = (response: Response, status: number, data: any) => {
  return response.status(status).json({ status, data });
};

export { apiResponse };
