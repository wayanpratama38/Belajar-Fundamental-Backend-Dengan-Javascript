import { MulterError } from 'multer';
import ClientError from '../exceptions/ClientError.js';
import response from '../utils/Response.js';

// eslint-disable-next-line no-unused-vars
const ErrorHandler = (err, req, res, _next) => {
  if (err instanceof ClientError) {
    return response(res, err.statusCode, err.message, null);
  }

  if (err instanceof MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return response(res, 413, 'File yang diberikan lebih besar dari 51200KB', null);
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return response(res, 400, 'File yang diberikan tidak sesuai dengan perminataan', null);
    }
  }

  if (err.isJoi) {
    return response(res, 400, err.details[0].message, null);
  }

  const status = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  return response(res, status, message, null);
};

export default ErrorHandler;
