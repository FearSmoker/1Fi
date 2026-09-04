// error handler
export function errorHandler(err, req, res, _next) {
  console.error('❌ Error:', err.message);

  // prisma errors
  if (err.code === 'P2002') {
    return res.status(409).json({
      error: 'Conflict',
      message: 'A record with this unique value already exists.',
    });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({
      error: 'Not Found',
      message: 'The requested record was not found.',
    });
  }

  // fallback error
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: statusCode === 500 ? 'Internal Server Error' : err.message,
    message: statusCode === 500
      ? 'Something went wrong. Please try again later.'
      : err.message,
  });
}
