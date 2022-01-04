require("dotenv").config();
const { sign, verify } = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const myPlaintextPassword = "s0//P4$$w0rD";
const someOtherPlaintextPassword = "not_bacon";

module.exports = {
  makejwt: (data, date) => {
    const key = process.env.JWT_KEY;
    const option = { expiresIn: date, issuer: "Obbli", subject: "data" };
    const token = sign(data, key, option);

    return token;
  },
  solveToken: (token) => {
    const key = process.env.JWT_KEY;

    const result = verify(token, key);

    return result;
  },
  hash: (word) => {
    return bcrypt.hashSync(word, 10);
  },
};
