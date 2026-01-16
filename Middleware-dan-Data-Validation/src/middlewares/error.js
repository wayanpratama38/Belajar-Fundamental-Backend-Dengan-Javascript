import ClientError from "../exceptions/client-error"
import response from "../utils/response";



const ErrorHandler = (err, req, res, next) => {
  if (err instanceof ClientError) {
    return response(res, err.statusCode, err.message, null);
  }

  if (err.isJoi) {
    return response(res, 400, err.details[0].message, null);
  }
  const status = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  console.error('Unhandled Error', err);
  return response(res, status, message, null);

}

export default ErrorHandler;
