class ValidationError extends Error {}

const handleError = (err, req, res, next) => {
  console.error(err);

  res
    .status(err instanceof ValidationError ? 400 : 500)
    .json({
      message: err instanceof ValidationError ? err.message : 'Sorry, please try again later',
    });
}

module.exports = {ValidationError, handleError}