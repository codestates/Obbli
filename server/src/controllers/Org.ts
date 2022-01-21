import { Advert, Org, Person } from "../entity";
import { signToken, verifyToken, hashPassword } from "../Util";

interface TokenInfo {
  uuid: string;
  user_id: string;
  created_at: Date;
}

interface search_OrgInfo {
  uuid: string;
  user_id: string;
  pw_hash: string;
  name: string;
  description: string;
  since: Date;
  headcount: number;
  created_at: Date;
  deleted_at: null | Date;
}

const SignIn = {
  post: async (req, res): Promise<void> => {
    const { user_id, pw }: { user_id: string; pw: string } = req.body;
    const orgInfo: search_OrgInfo = await Org.findOne({
      user_id: user_id,
      pw_hash: pw,
      deleted_at: null,
    });

    if (!orgInfo) {
      return res.status(400).json({ message: "Data not found." });
    }
    else {
      const { uuid, user_id,created_at } = orgInfo;
      const data = { uuid, user_id, created_at, permission: 'org' };
      const access_token:string = signToken(data, "1d");
      const refresh_token:string = signToken(data, "1h");

      return res
        .cookie("refresh_token", refresh_token, { httpOnly: true })
        .status(200)
        .json({
          access_token,
          token_type: 'Bearer',
          expires_in: 3600,
          uuid,
          permission: 'org',
        });
    }
  },
};

const SignUp = {
  post: async (req, res): Promise<void> => {
    const { user_id, pw, pw_check, name } = req.body;

    if (!user_id || !pw || !pw_check || (!name && pw === pw_check)) {
      return res.status(400).json({});
    }
    // TODO: validate pw_check
    // TODO: Do not use upsert

    const duplicateID = await Org.findOne({ user_id });

    if (duplicateID) {
      return res.status(403).json({});
    } else {
      await Org.create({
        user_id: user_id,
        pw_hash: pw,
        name: name,
      }).save();

      await Org.findOne({ user_id: user_id }).then((result) => {
        const { uuid, user_id, created_at } = result;
        const access_token: string = signToken(
          { uuid, user_id, created_at },
          "1h"
        );
        const refresh_token: string = signToken(
          { uuid, user_id, created_at },
          "1d"
        );

        return res
          .cookie("refresh_token", refresh_token, {
            httpOnly: true,
          })
          .status(201)
          .json({ access_token: `Bearer ${access_token}` });
      });
    }
  },
};

const SignOut = {
  post: (req, res): void => {
    return res.clearCookie("refresh_token").status(204).send();
  },
};

const OrgInfo = {
  get: async (req, res): Promise<void> => {
    if (!req.headers.authorization) {
      return res.status(401).json({});
    }

    const tokenCheck: TokenInfo = verifyToken(req.headers.authorization);

    if (!tokenCheck) {
      return res.status(401).json({});
    } else {
      const { uuid } = tokenCheck;
      const row = await Org.findOne({
        where: { uuid },
        relations: ['Advert', 'Org_review', 'Person_review'],
      });
      // TODO: error handling when nothing is selected
      if (!row) { return res.status(404).send(); }

      console.log(row);
      return res.status(200).send(row);
    }
  },

  patch: async (req, res): Promise<void> => {
    if (!req.headers.authorization) {
      return res.status(401).json({});
    } 
    else if (req.body.user_id) {
      return res.status(401).json({});
    }

    const orgInfo:TokenInfo= verifyToken(req.headers.authorization);
    
    if (!orgInfo) {
      return res.status(401).json({});
    } else {
      interface Change_Case {
        name: string | null;
        description: string | null;
        since: Date | null;
        headcount: number | null;
      }

      const newData: Change_Case = req.body;
      Object.entries(newData).map((el) => {
        if (!el[1]) {
          delete newData[el[0]];
        }
      });

      await Org.update({ uuid: orgInfo.uuid }, newData);
      const updatedData: search_OrgInfo = await Org.findOne({ uuid:orgInfo.uuid });
      const { name, description, since, headcount } = updatedData;

      return res.status(200).send({ name, description, since, headcount });
    }
  },

  delete: async (req, res): Promise<void> => {
    //단체정보 삭제하기
    if (!req.headers.authorization) {
      return res.status(401).json({});
    } 
    
      const orgInfo: TokenInfo = verifyToken(req.headers.authorization);
      
      if(!orgInfo){
        return res.status(401).json({})
      }

      const matching = await Org.findOne({ uuid: orgInfo.uuid, deleted_at:null });
      
      if (!matching) {
        return res.status(404).json({});
      } 
      else {
        await Org.update({ uuid: orgInfo.uuid }, { deleted_at: Date() });
        return res.status(204).send();
      }
  },
};

export async function getOrgAdvert(req, res) {
  const token = verifyToken(req.headers.authorization);
  if (!token) { return res.status(401).send(); }
  const uuid = req.params.advert_uuid;

  const row = await Advert.findOne({
    where: { uuid },
    relations: ['Position', 'Position.Skill', 'Position.Application', 'Position.Application.Person', 'Position.Application.Person.Person_review'],
  })
  const data = [] as any;
  for (const position of row.Position) {
    data.push({
      skill_name: position.Skill.name,
      person: (position.Application as any).map(application => ({
        uuid: application.Person.uuid,
        name: application.Person.name,
        reviews: application.Person.Person_review.map(review => ({
          comment: review.comment,
          rating: review.rating,
        })),
      })),
    });
  }

  return res.status(200).send(data);
}

export { SignIn, SignUp, SignOut, OrgInfo };
