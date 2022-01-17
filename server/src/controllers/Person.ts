import "reflect-metadata";
import { getConnection } from "typeorm";
import { Person } from "../entity/Person";
import { Skill } from "../entity/Skill";
import { signToken, verifyToken, hashPassword } from "../Util";

const SignIn = {
  post: (req, res): void => {
    const { user_id, pw } = req.body;
    // TODO: check types

    if (!user_id || !pw) {
      return res.status(400).json({});
    }

    // TODO: hash pw
    const member = Person.findOne({ user_id: user_id, pw_hash: pw });
    member.then((result) => {
      if (!result) {
        return res.status(400).send();
      }
      const { uuid, user_id, created_at } = result;
      const access_token = signToken({ uuid, user_id, created_at }, "1h");
      const refresh_token = signToken({ uuid, user_id, created_at }, "1d");

      return res
        .cookie("refresh_token", refresh_token, {
          httpOnly: true,
        })
        .status(200)
        .send({ access_token: `Bearer ${access_token}` });
    });
  },
};

const SignUp = {
  post: async (req, res) => {
    // 회원가입
    const { user_id, pw, pw_check, name } = req.body;
    // TODO: check types

    // 빈 입력값 체크
    if (!user_id || !pw || !pw_check || (!name && !name && pw === pw_check)) {
      return res.status(400).json({});
    }

    const duplicateID = await Person.findOne({ user_id });

    if (duplicateID) {
      return res.status(403).json({});
    }

    // TODO: hash pw
    await Person.insert({ user_id, pw_hash: pw, realname: name });

    Person.findOne({ user_id }).then((result) => {
      const { uuid, user_id, created_at } = result;
      const access_token = signToken({ uuid, user_id, created_at }, "1h");
      const refresh_token = signToken({ uuid, user_id, created_at }, "1d");

      return res
        .cookie("refresh_token", refresh_token, {
          httpOnly: true,
        })
        .status(201)
        .json({ access_token: `Bearer ${access_token}` });
    });
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
    if (!req.headers.authorization) {
      return res.status(500).json({});
    }

    const person_uuid: string = verifyToken(req.headers.authorization).uuid;

    const row = await Person.findOne({
      where: { uuid: person_uuid },
      select: ["uuid", "realname", "professional", "history"],
      relations: ["Skill"],
    });

    if (!row) {
      return res.status(404).json({});
    } else {
      const {
        realname,
        professional,
        history,
        Skill: { name: skill },
      } = row;

      return res
        .status(200)
        .json({ realname, professional, history, skill, uuid: person_uuid });
    }
  },

  patch: async (req, res) => {
    if (!req.headers.authorization) {
      return res.status(401).json({});
    }

    const person_uuid: string = verifyToken(req.headers.authorization).uuid;
    const targetData = { ...req.body };

    if (req.body.user_id) {
      return res.status(401).json({});
    }

    Object.entries(targetData).forEach((el) => {
      if (el[1] === undefined) {
        delete targetData[el[0]];
      }
    });
    targetData.realname = targetData.name;
    delete targetData.name;
    const skill_name = targetData.skill;
    delete targetData.skill;

    // TODO: use subquery from API
    let setter = Object.entries(targetData)
      .map(([k, v]) => `${k} = '${v}'`)
      .join(",");
    if (skill_name !== undefined) {
      setter += `, skill_uuid = (SELECT uuid from skill where name = '${skill_name}')`;
    }
    const raw = `UPDATE person set ${setter} where uuid = '${person_uuid}'`;

    const result = await Person.query(raw);

    // TODO: use one DB call for update and select?
    const row = await Person.findOne({
      where: { uuid: person_uuid },
      select: ["uuid", "history", "professional", "realname"],
      relations: ["Skill"],
    });

    if (!row) {
      return res.status(401).json({});
    }
    //유저정보 수정하기
    else {
      return res.status(200).send({
        history: row.history,
        professional: row.professional,
        name: row.realname,
        skill: row.Skill.name,
        uuid: person_uuid,
      });
    }
  },

  delete: async (req, res) => {
    //유저정보 삭제하기

    if (!req.headers.authorization) {
      return res.status(401).json({});
    }

    const person_uuid: string = verifyToken(req.headers.authorization).uuid;

    const invalid = await Person.findOne({ uuid: person_uuid });
    if (!invalid) {
      return res.status(404).json({});
    } else {
      await Person.findOne({ uuid: person_uuid });
      res.clearCookie("refresh_token").status(204).send();
    }
  },
};

export { SignIn, SignUp, SignOut, UserInfo };
