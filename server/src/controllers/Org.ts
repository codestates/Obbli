import { Org } from "../entity/Org";
import { signToken, verifyToken, hashPassword} from "../Util"

const SignIn = {
  post: async (req, res) => {
    const { user_id, pw_hash } = req.body;

    const orgInfo = await Org.findOne({ user_id: user_id });
    if (!orgInfo) {
      res.status(400).json({ message: "이런사람 업습니다." });
    } else {
      const { uuid, user_id,created_at } = orgInfo;
      const access_token = signToken({ uuid, user_id,created_at}, "1d");
      const refresh_token = signToken({ uuid, user_id,created_at }, "1h");

      res
        .cookie("refresh_Token", refresh_token, { httpOnly: true })
        .status(200)
        .json({ access_token: access_token });
    }
  },
};

const SignUp = {
  post: async (req, res) => {
    const { user_id, pw_hash, name, description, since, headcount } = req.body;

    if (!user_id || !pw_hash || !name || !description || !since || !headcount) {
      res.status(400).json({ message: "항목을 전부 채워주세요" });
    } else {
      await Org.create({
        user_id: user_id,
        pw_hash: pw_hash,
        name: name,
        description: description,
        since: since,
        headcount: headcount,
      }).save();
    }
  },
};

const SignOut = {
  post : (req,res) =>{

  }
}

const OrgInfo = {
  get: (req, res) => {
    //단체 정보 가져오기
    res.status(200).send("단체정보요청하기");
  },
  patch: (req, res) => {
    res.status(200).send("단체정보수정하기");
    //단체정보 수정하기
  },
  delete: (req, res) => {
    res.status(200).send("단체정보 삭제하기");
    //단체정보 삭제하기
  },
};

export { SignIn, SignUp,SignOut, OrgInfo };
