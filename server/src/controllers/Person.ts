import 'reflect-metadata';
import { getConnection } from "typeorm";
import { Person } from "../entity/Person";
import { Skill } from "../entity/Skill";
import { signToken, verifyToken, hashPassword } from "../Util";

const SignIn = {
  post: (req, res): void => {
    const { user_id, pw } = req.body;
    // TODO: check types

    if (!user_id || !pw) {
      res.status(400).json({ message: "Not a member." });
    }

    // TODO: hash pw
    const member = Person.findOne({ user_id: user_id, pw_hash: pw });
    member.then((result) => {
      if (!member) {
        return res.status(400).send({ message: "Not a member." });
      }
      const { uuid, user_id, created_at } = result;
      const access_token = signToken({ uuid, user_id, created_at }, "1h");
      const refresh_token = signToken({ uuid, user_id, created_at }, "1d");

      return res.cookie("refresh_token", refresh_token, {
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
    if (!user_id || !pw || !pw_check || !name) {
      return res.status(400).json({ message: "Missing information" });
    }

    // TODO: hash pw
    await Person.insert({ user_id, pw_hash: pw, realname: name });

    await Person.findOne({ user_id }).then((result) => {
      const { uuid, user_id, created_at } = result;
      const access_token = signToken({ uuid, user_id, created_at }, "1h");
      const refresh_token = signToken({ uuid, user_id, created_at }, "1d");

      return res.cookie("refresh_token", refresh_token, {
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
    //유저 정보 가져오기/ 토큰해석 후 가져오는것으로 고려해볼것
    const solveData = verifyToken(req.headers.authorization);
    const person_uuid: string = solveData.uuid;
    // TODO: select only necessary columns from joined table
    const row = await Person.findOne({
        where: { uuid: person_uuid },
        select: ['uuid', 'realname', 'professional', 'history'],
        relations: ['Skill'],
    });
    if (!row) {
      return res.status(400).json({ message: "이런사람 없습니다." });
    }
    const { realname, professional, history, Skill: { name: skill } } = row;
    return res.status(200).json({ realname, professional, history, skill });
  },

  patch: async (req, res) => {
    const solveData = verifyToken(req.headers.authorization);

    const person_uuid: string = solveData.uuid;
    const targetData = {...req.body}

    Object.entries(targetData).forEach(el => {
      if(el[1] === undefined){
        delete targetData[el[0]]
      }
    })
    targetData.realname = targetData.name;
    delete targetData.name;
    const skill_name = targetData.skill;
    delete targetData.skill;

    // TODO: use subquery from API
    let setter = Object.entries(targetData)
      .map(([k, v]) => `${k} = '${v}'`)
      .join(',');
    if (skill_name !== undefined) {
      setter += `, skill_uuid = (SELECT uuid from skill where name = '${skill_name}')`;
    }
    const raw = `UPDATE person set ${setter} where uuid = '${person_uuid}'`

    const result = await Person.query(raw);

    // TODO: use one DB call for update and select?
    const row = await Person.findOne({
      where: { uuid: person_uuid },
      select: ['uuid', 'history', 'professional', 'realname'],
      relations: ['Skill'],
    });
    //유저정보 수정하기

    return res.status(200).send({
      history: row.history,
      professional: row.professional,
      name: row.realname,
      skill: row.Skill.name,
    });
  },

  delete: async (req, res) => {
    //유저정보 삭제하기
    const person_uuid = req.params.person_uuid;
    await Person.delete({ uuid: person_uuid });

    res.clearCookie("refresh_token").status(204).send();
  },
};

export { SignIn, SignUp, SignOut, UserInfo };
