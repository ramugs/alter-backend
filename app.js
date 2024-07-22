require("dotenv").config();
const express = require("express");
const connectString = require("./db/connect");
const app = express();

const port = process.env.PORT;

const start = async () => {
  try {
    await connectString(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server is listening at the port: ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
