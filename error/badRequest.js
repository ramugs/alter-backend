const { CustomerError } = require("./customError");
const { StatusCodes } = require("http-status-codes");

class BadRequest extends CustomerError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

module.exports = BadRequest;
