import { Person } from "../../entity/Person";
const { makejwt, hash } = require("../function");

module.exports = {
  Sign_in: {
    post: (req, res) => {
      //로그인
      const { user_id, pw_hash } = req.body;

      if (!user_id || !pw_hash) {
        res.status(400).json({ message: "Not a member." });
      }

      const member = Person.findOne({ user_id: user_id, pw_hash: pw_hash });
      member.then((result) => {
        if (!member) {
          res.status(400).json({ message: "Not a member." });
        }
        console.log(result);
        const { uuid, user_id, email } = result;
        const access_Token = makejwt({ uuid, user_id, email }, "1h");
        const refresh_Token = makejwt({ uuid, user_id, email }, "1d");

        res
          .cookie("refresh_token", refresh_Token, {
            httpOnly: true,
          })
          .status(200)
          .json({ access_token: `bearer ${access_Token}` });
      });
    },
  },

  Sign_up: {
    post: async (req, res) => {
      //회원가입
      const { user_id, pw_hash, realname, professional, history, email } = req.body;
      //아이디 비밀번호 전달확인
      if (!user_id || !pw_hash) {
        res.status(400).json({ message: "write ID,PW" });
      }

      //아이디 중복여부 확인
      const usercheck = await Person.findOne({ user_id: user_id });
      console.log(usercheck);

      if (usercheck) {
        res.status(400).json({ message: "이미있는 아이디입니다." });
      } else {
        //쿠키에 refreshToken과 헤더에 Token을 담기(추후과제)
        await Person.create({
          user_id: user_id,
          pw_hash: pw_hash,
          realname: realname,
          professional: professional,
          history: history,
          email: email,
        }).save();

        await Person.findOne({ user_id: user_id }).then((result) => {
          const { uuid, user_id, email } = result;
          const access_Token = makejwt({ uuid, user_id, email }, "1h");
          const refresh_Token = makejwt({ uuid, user_id, email }, "1d");

          res
            .cookie("refresh_token", refresh_Token, {
              httpOnly: true,
            })
            .status(200)
            .json({ access_token: `bearer ${access_Token}`});
        });
      }
    },
  },
  sign_out: {
    post: (req, res) => {
      res
        .clearCookie("refresh_token")
        .status(200)
        .json({ message: "success log_out" });
    },
  },
};
