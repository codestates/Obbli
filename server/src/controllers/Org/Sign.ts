import { Org } from "../../entity/Org";
const makejwt = require("../function");

module.exports = {
  Sign_in: {
    post: async (req, res) => {
      const { user_id, pw_hash } = req.body;

      const orgInfo = await Org.findOne({ user_id: user_id });
      if (!orgInfo) {
        res.status(400).json({ message: "이런사람 업습니다." });
      } else {
        const { uuid, user_id } = orgInfo;
        const access_token = makejwt({ uuid, user_id }, "1d");
        const refresh_token = makejwt({ uuid, user_id }, "1h");
        
        res
          .cookie("refresh_Token", refresh_token, { httpOnly: true })
          .status(200)
          .json({ access_token: access_token });
      }
    },
  },
  Sign_up: {
    post: async (req, res) => {
      const { user_id, pw_hash, name, description, since, headcount } =
        req.body;

      if (!user_id ||!pw_hash ||!name ||!description ||!since ||!headcount){
        res.status(400).json({ message: "항목을 전부 채워주세요" });
      } 
      else {
        await Person.create({
          user_id: user_id,
          pw_hash: pw_hash,
          name: name,
          description: description,
          since: since,
          headcount: headcount,
        }).save();
      }
    },
  },
};
