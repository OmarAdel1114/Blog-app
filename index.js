const express = require("express");
const app = express();
app.use(express.json());

const mongoose = require("mongoose");

const dotenv = require("dotenv");
dotenv.config();
// const mongoDbUrl = process.env.DB_CONNECT;
// const port = process.env.port;
const bookRoutes = require("./routes/book.rout");

mongoose.connect(process.env.DB_CONNECT).then(() => {
  console.log("Mongodb Server Started");
});

app.use("/api/books", bookRoutes);

app.listen(process.env.PORT);
