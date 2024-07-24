require("dotenv").config();
require("express-async-errors");
const express = require("express");
const bodyParser = require("body-parser");
const connectString = require("./db/connect");
const app = express();
const userRoutes = require("./routes/user");
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");

// extra security package
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/user", userRoutes);
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;

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


