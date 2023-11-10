import { Response } from 'express';

type ApiResponseArg = {
  data?: any;
  error?: string;
  message?: string;
  success?: boolean;
};

export function standardApiResponse(
  res: Response,
  status: number,
  details: ApiResponseArg,
) {
  const { data, error, message, success } = details;

  const response = {
    data,
    error,
    message,
    success,
  };

  res.status(status).send(response);
}
