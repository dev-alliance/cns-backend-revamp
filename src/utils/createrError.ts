export const createError = (message: string, statusCode: any) => {
  const error = new Error(message) as any;
  error.statusCode = statusCode;
  return error;
};
