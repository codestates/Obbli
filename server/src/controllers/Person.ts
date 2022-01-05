import { getConnection } from "typeorm";
import { Person } from "../entity/Person";
import { signToken, verifyToken, hashPassword } from "../Util";

const SignIn = {
  post: (req, res): void => {
    //로그인
    const user_id: string = req.body;
    const pw_hash: string = req.body;
    // const { user_id, pw_hash } = req.body;

    if (!user_id || !pw_hash) {
      res.status(400).json({ message: "Not a member." });
    }

    const member = Person.findOne({ user_id: user_id, pw_hash: pw_hash });
    member.then((result) => {
      if (!member) {
        res.status(400).json({ message: "Not a member." });
      }
      console.log(result);
      const { uuid, user_id, created_at } = result;
      const access_Token = signToken({ uuid, user_id, created_at }, "1h");
      const refresh_Token = signToken({ uuid, user_id, created_at }, "1d");

      res
        .cookie("refresh_token", refresh_Token, {
          httpOnly: true,
        })
        .status(200)
        .json({ access_token: `bearer ${access_Token}` });
    });
  },
};

const SignUp = {
  post: async (req, res) => {
    //회원가입
    const { user_id, pw_hash, realname, professional, history, email } =
      req.body;
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
        const { uuid, user_id, created_at } = result;
        const access_Token = signToken({ uuid, user_id, created_at }, "1h");
        const refresh_Token = signToken({ uuid, user_id, created_at }, "1d");

        res
          .cookie("refresh_token", refresh_Token, {
            httpOnly: true,
          })
          .status(200)
          .json({ access_token: `bearer ${access_Token}` });
      });
    }
  },
};

const SignOut = {
  post: (req, res) => {

    res
      .clearCookie("refresh_token")
      .status(200)
      .json({ message: "success log_out" });
  },
};

const UserInfo = {
  get: async (req, res) => {
    //유저 정보 가져오기/ 토큰해석 후 가져오는것으로 고려해볼것
    const solveData = verifyToken(req.headers.authorization);
    const person_uuid: string = solveData.uuid;
    await Person.findOne({ uuid: person_uuid }).then((result) => {
      if (!result) {
        res.status(400).json({ message: "이런사람 없습니다." });
      } else {
        console.log(result);
        res.status(200).json({ UserInfo: result });
      }
    });
  },

  patch: async (req, res) => {
    const solveData = verifyToken(req.headers.access_token);
    
    const person_uuid: string = solveData.uuid;
    const targetData = {...req.body}

    Object.entries(targetData).forEach(el => {
      if(el[1] === undefined){
        delete targetData[el[0]]
      } 
    })

    await getConnection()
      .createQueryBuilder()
      .update(Person)
      .set( targetData )
      .where("uuid = :uuid", { uuid: person_uuid })
      .execute();

    //유저정보 수정하기
    res.status(200).send("유저정보 수정하기");
  },

  delete: async (req, res) => {
    //유저정보 삭제하기
    const person_uuid = req.params.person_uuid;
    await Person.delete({ uuid: person_uuid });

    res.clearCookie("refresh_token").status(200).send("유저정보삭제하기");
  },
};

export { SignIn, SignUp, SignOut, UserInfo };
