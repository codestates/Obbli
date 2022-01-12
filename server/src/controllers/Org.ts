import { Org } from "../entity/Org";
import { Person  } from "../entity";
import { signToken, verifyToken, hashPassword} from "../Util"

interface TokenInfo {
  uuid: string,
  user_id: string,
  created_at: Date
}

interface search_OrgInfo {
    uuid: string ,
    user_id: string,
    pw_hash: string,
    name: string,
    description: string,
    since: Date,
    headcount: number,
    created_at: Date,
    deleted_at: null | Date
}


const SignIn = {
  post: async (req, res):Promise<void>=> {
    const { user_id , pw }:{user_id:string,pw:string} = req.body;
    const orgInfo:search_OrgInfo = await Org.findOne({ user_id: user_id ,pw_hash:pw, deleted_at:null});

    if (!orgInfo) {
      return res.status(400).json({ message: "Data not found." });
    }
    else {
      const { uuid, user_id,created_at }:{uuid:string, user_id:string, created_at:Date} = orgInfo;
      const access_token:string = signToken({ uuid, user_id,created_at}, "1d");
      const refresh_token:string = signToken({ uuid, user_id,created_at }, "1h");

      return res
        .cookie("refresh_Token", refresh_token, { httpOnly: true })
        .status(200)
        .json({ access_token: `Bearer ${access_token}`});
    }
  },
};

const SignUp = {
  post: async (req, res):Promise<void> => {
    const { user_id, pw, pw_check, name } = req.body;

    if (!user_id || !pw || !pw_check || !name ) {
      return res.status(400).json({ message: "항목을 전부 채워주세요" });
    }
    // TODO: validate pw_check
    // TODO: Do not use upsert
    await Org.create({
      user_id: user_id,
      pw_hash: pw,
      name: name
    }).save();

    await Org.findOne({ user_id: user_id }).then((result) => {
      const { uuid, user_id, created_at } = result;
      const access_token:string = signToken({ uuid, user_id, created_at }, "1h");
      const refresh_token:string = signToken({ uuid, user_id, created_at }, "1d");

      return res
        .cookie("refresh_token", refresh_token, {
          httpOnly: true,
        })
        .status(201)
        .json({ access_token: `Bearer ${access_token}` });
    })
  }
};

const SignOut = {
  post : (req,res):void =>{

  return res
    .clearCookie("refresh_token")
    .status(204)
    .send();

  }
}

const OrgInfo = {
  get: async (req, res): Promise<void> => {
    //단체 정보 가져오기
    const tokenCheck:TokenInfo = verifyToken(req.headers.authorization)

    if (!tokenCheck) {
      return res.status(400).json({message: 'Please Sign-in'})
    }
    else {
      // TODO: error handling when `uuid` not in data
      const { uuid } = tokenCheck;
      const OrgData: search_OrgInfo = await Org.findOne({ uuid })
      // TODO: error handling when nothing is selected

      interface response_OrgInfo {
        name:string,
        description:string,
        since:Date,
        headcount:number
      }

      const { name, description, since, headcount }: response_OrgInfo = OrgData

      return res.status(200).send({ name, description, since, headcount });
    }
  },

  patch: async (req, res):Promise<void> => {
    const uuid:string = verifyToken(req.headers.authorization).uuid

    if(!uuid){
      return res.status(400).json({message:'Data not found'})
    }
    else{

      interface Change_Case{
        name:string | null,
        description:string | null,
        since:Date| null,
        headcount:number| null
      }

      const newData:Change_Case = req.body;
      Object.entries(newData).map(el =>{
        if(!el[1]){
          delete newData[el[0]]
        }
      })

      await Org.update({uuid:uuid},newData);
      const updatedData: search_OrgInfo = await Org.findOne({ uuid })
      const { name, description, since, headcount } = updatedData;

      return res.status(200).send({ name, description, since, headcount });

    }
  },

  delete: async (req, res):Promise<void> => {
    //단체정보 삭제하기
    const targetUuid:string = verifyToken(req.headers.authorization).uuid
    await Org.update({uuid: targetUuid},{deleted_at:Date()})

    return res.status(204).send();
  },
};

export { SignIn, SignUp,SignOut, OrgInfo };
