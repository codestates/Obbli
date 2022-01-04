import { createQuery } from "mysql2/typings/mysql/lib/Connection";
import { getConnection } from "typeorm";
import { Person } from "../../entity/Person";
const { solveToken } = require("../function");

module.exports = {
  UserInfo: {
    get: async (req, res) => {
      //유저 정보 가져오기/ 토큰해석 후 가져오는것으로 고려해볼것
      const solveData = solveToken(req.headers.access_token);
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
      const solveData = solveToken(req.headers.access_token);
      const person_uuid: string = solveData.uuid;
      const { user_id, realname, professional, history, email, cellular } =
        req.body;

      await getConnection()
        .createQueryBuilder()
        .update(Person)
        .set({
          user_id: user_id,
          realname: realname,
          professional: professional,
          history: history,
          email: email,
          cellular: cellular,
        })
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
  },
};
