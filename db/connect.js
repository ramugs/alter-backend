const mongoose = require("mongoose");

const connectString = (uri) => {
  return mongoose.connect(uri);
};

module.exports = connectString;
