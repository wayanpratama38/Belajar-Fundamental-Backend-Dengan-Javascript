const response = (res, statusCode, message, data) => res
  .status(statusCode)
  .json({
    code: statusCode,
    status:
        // eslint-disable-next-line no-nested-ternary
        statusCode >= 500 ? 'error' : statusCode < 400 ? 'success' : 'fail',
    message,
    data,
  })
  .end();

export default response;
