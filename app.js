require("dotenv").config();
const express = require("express");
const connectString = require("./db/connect");
const app = express();
const userRoutes = require("./routes/user");

app.use(express.json());

app.use("/api/v1/users", userRoutes);

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
