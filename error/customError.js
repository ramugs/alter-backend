class CustomerError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

const customErrorMessage = (msg, statusCode) => {
  return new CustomerError(msg, statusCode);
};

module.exports = { CustomerError, customErrorMessage };
