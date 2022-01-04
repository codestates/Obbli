import repository from "typeorm";
const Person = require("../../entity/Person");

module.exports = {
  Sign_in: {
    post: (req, res) => {
      //로그인
      res.status(200).send("로그인하기");
    },
  },
  Sign_up: {
    post: (req, res) => {
      //회원가입
      const userId = req.body.ID;
      const userPw = req.body.PW;

      if (!userId || !userPw) {
        res.status(400).json({ message: "write ID,PW" });
      } else {
        //쿠키에 refreshToken과 헤더에 Token을 담기
        const person = new Person();
        person.user_id = userId;
        person.pw_hash = userPw;
        person.save();
        res.status(200).json({ message: "welcome" });
      }
    },
  },
};
