export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  // Log full error on server
  console.error("ERROR:", err);

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack:
      process.env.NODE_ENV === 'development'
        ? err.stack
        : undefined,
  });
};