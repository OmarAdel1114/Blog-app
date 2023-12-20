const express = require("express");
const app = express();
app.use(express.json());

const mongoose = require("mongoose");

const dotenv = require("dotenv");
dotenv.config();

const bookRoutes = require("./routes/book.route");
const userRoutes = require("./routes/user.route");
mongoose.connect(process.env.DB_CONNECT).then(() => {
  console.log("Mongodb Server Started");
});

app.use("/api/books", bookRoutes);
app.use("/api/users", userRoutes);

app.listen(process.env.PORT);
