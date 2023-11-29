const userRouter = require("express").Router();
const bcrypt = require("bcrypt");
const user = require("../models/user");
const nodemailer = require("nodemailer");
const config = require("../utils/config");
const jwt = require("jsonwebtoken");

// register

userRouter.post("/", async (request, response) => {
  const { email, Firstname, Lastname, password } = request.body;
  const isexist = await user.find({ email: email });
  if (isexist.length > 0) {
    return response.json({
      message: "email already exist use another email",
    });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: config.USER_NAME,
      pass: config.PASSWORD,
      clientId: config.ID,
      clientSecret: config.SECRET,
      refreshToken: config.TOKEN,
    },
  });
  generateToken = (email) => {
    const expirationDate = new Date();
    expirationDate.setMinutes(new Date().getMinutes() + 10);
    return jwt.sign({ email, expirationDate }, config.JWT_SECRET);
  };
  const mailConfigurations = {
    from: "rajabharathi0258@gmail.com",
    to: email,
    subject: "Sending Email using Node.js",
    html: `<h2>Hi!</h2> <h5>Click the link to acctivate your account : ${
      config.BASE
    }/Welcome/${generateToken(email)} </h5>
    <p>Link is only valid for 10 mins</p>`,
  };
  transporter.sendMail(mailConfigurations, function (error, info) {
    if (error) console.log(error);
    console.log("Email Sent Successfully");
    response.json({ message: "Activation link sent sucessfully" });
  });
  const User = new user({
    isActive: false,
    email,
    Firstname,
    Lastname,
    passwordHash,
  });
  const saveduser = await User.save();
  response.json(saveduser);
});

// registration verification
userRouter.patch("/verify", async (request, response) => {
  const { token } = request.query;
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, config.JWT_SECRET);
  } catch {
    response.status(401).send("Invalid authentication credentials");
    return;
  }
  const { email, expirationDate } = decodedToken;
  const User = await user.find({ email: email });
  if (expirationDate < new Date().toISOString() || User[0].isActive) {
    response.status(401).send("Token has expired.");
    return;
  }
  await User[0].updateOne({
    isActive: true,
  });

  response.status(200).send("verfication successful");
});

// forget password
userRouter.patch("/:email", async (request, response) => {
  const email = request.params.email;
  let User = await user.findOne({ email });
  if (!User) {
    return response.status(401).json({
      message: "user does not exist",
    });
  }
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: config.USER_NAME,
      pass: config.PASSWORD,
      clientId: config.ID,
      clientSecret: config.SECRET,
      refreshToken: config.TOKEN,
    },
  });
  generateTokenForget = (email) => {
    const expirationDate = new Date();
    expirationDate.setMinutes(new Date().getMinutes() + 10);
    return jwt.sign({ email, expirationDate }, config.JWT_SECRET);
  };
  const mailConfigurations = {
    from: "rajabharathi0258@gmail.com",
    to: email,
    subject: "Sending Email using Node.js",
    html: `<h2>Hi!</h2> <h5>Click the link to acctivate your account : ${
      config.BASE
    }/Reset/${generateTokenForget(email)} </h5>
    <p>Link is only valid for 10 mins</p>`,
  };
  await User.updateOne({
    isActive: false,
  });
  transporter.sendMail(mailConfigurations, function (error, info) {
    if (error) console.log(error);
    console.log("Email Sent Successfully");
    response.json({ message: "Forgot password link sent sucessfully" });
  });
});

// forget password verification
userRouter.put("/forget", async (request, response) => {
  const { token } = request.query;
  const { password } = request.body;
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, config.JWT_SECRET);
  } catch {
    response.status(401).send("Invalid authentication credentials");
    return;
  }
  const { email, expirationDate } = decodedToken;
  const User = await user.find({ email: email });
  const newPass = await bcrypt.hash(password, 10);
  await User[0].updateOne({
    isActive: true,
  });
  await User[0].updateOne({
    passwordHash: newPass,
  });
  if (expirationDate < new Date().toISOString() || User[0].isActive) {
    response.status(401).send("Token has expired.");
    return;
  }
  response.json({ message: "password changed sucessfully" });
});

// Login
userRouter.put("/login", async (request, response) => {
  try {
    const { username, password } = request.body;

    const User = await user.findOne({ email: username });
    if (!User) {
      return response.status(401).json({ error: "User Not found" });
    }
    if (!User.isActive) {
      return response.status(401).json({ error: "User Not found" });
    }

    const passwordMatch = await bcrypt.compare(password, User.passwordHash);

    if (!passwordMatch) {
      return response.status(401).json({ error: "Invalid Password" });
    }
    response.status(200).json({ username: User.email, name: User.Firstname });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

module.exports = userRouter;
