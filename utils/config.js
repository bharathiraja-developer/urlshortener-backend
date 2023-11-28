require("dotenv").config();

const URI = process.env.URI;
const PORT = process.env.PORT;
const USER_NAME = process.env.MAIL_USERNAME;
const PASSWORD = process.env.MAIL_PASSWORD;
const ID = process.env.ID;
const SECRET = process.env.SECRET;
const TOKEN = process.env.TOKEN;
const JWT_SECRET = process.env.JWT_SECRET;
const BASE = process.env.BASE;

module.exports = {
  URI,
  PORT,
  USER_NAME,
  PASSWORD,
  ID,
  SECRET,
  TOKEN,
  JWT_SECRET,
  BASE,
};
