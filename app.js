const express = require("express");
const app = express();
const cors = require("cors");
const userRouter = require("./controlles/user");
const urlRouter = require("./controlles/urls");
app.use(cors());
app.use(express.json());

app.use("/api/users", userRouter);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api", urlRouter);

module.exports = app;
