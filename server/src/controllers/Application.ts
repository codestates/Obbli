import { off } from "process";
import { getRepository } from "typeorm";
import { Application, Person, Position, Advert } from "../entity";
import { verifyToken } from "../Util";
import { OrgInfo } from "./Org";

interface TokenInfo {
  uuid: string;
  user_id: string;
  created_at: Date;
}

interface Person_App {
  org_uuid: string;
  org_name: string;
  part_name: string;
  created_at: Date;
  reviewed_at: Date | null;
  hired_at: Date | null;
  review_uuid: string;
  rating: number | null;
}

interface Advert_App {
  uuid: string;
  person_uuid: string;
  advert_uuid: string;
  // porg_uuid: string
}

const AppPerson = {
  get: async (req, res) => {
    //참여 목록가져오기
    if(!req.headers.authorization){
      return res.status(401).json({})
    }
    const personInfo: TokenInfo = verifyToken(req.headers.authorization);

    if(!personInfo){
      return res.status(401).json({})
    }

    const AppList = await getRepository(Application)
      .createQueryBuilder("app")
      .select([
        "app.created_at as created_at",
        "app.received_at as received_at",
        "app.hired_at as hired_at",
        "Skill.name as skill_name",
        "Org.uuid as org_uuid",
        "Org.name as org_name",
      ])
      .leftJoin("app.Position", "Position")
      .innerJoin("Position.Skill", "Skill")
      .leftJoin("Position.Advert", "Advert")
      .leftJoin("Advert.Org", "Org")
      .where({ person_uuid: personInfo.uuid })
      .getRawMany()
      .catch((err) => {
        return res.status(500).json({});
      });
  
    if(AppList.length === 0){
      return res.status(404).json({})
    }

    return res.status(200).send(AppList);
  },
};

const AppAdvert = {
  get: async (req, res): Promise<void> => {
    //자신이 작성한 모집 게시글에 참여한 person 목록 가져오기
    if(!req.headers.authorization){
      return res.status(401).json({})
    }

    const orgInfo: TokenInfo = verifyToken(req.headers.authorization);
    const advert_uuid: string = req.params.advert_uuid;

    if (!orgInfo) {
      return res.status(401).json({});
    } 
    const postList = await getRepository(Position)
      .createQueryBuilder("pos")
      .select([
        "Application.person_uuid as person_uuid",
        "pos.uuid as position_uuid",
        "Skill.name as skill_name",
        "person.realname as person_name",
        "person.professional as professional",
      ])
      .leftJoin("pos.Application", "Application")
      .leftJoin("Application.Person", "Person")
      .leftJoin("pos.Skill", "Skill")
      .where({ advert_uuid: advert_uuid })
      .getRawMany()
      .catch((err) => {
        return res.status(500).json({});
      });

    if(postList.length === 0){
      return res.status(404).json({})
    }
    
    postList.map((el) => {
      const Obj = [
        {
          uuid: el.person_uuid,
          name: el.person_name,
          professional: el.professional,
        },
      ];
      el["person"] = Obj;
      delete el.person_uuid;
      delete el.person_name;
      delete el.professional;
    });

    const check = [];
    const result = []
    for (let i = 0; i < postList.length; i++) {
      if(check.includes(postList[i].position_uuid)){
        continue
      }
      else{
        for (let y = i+1; y < postList.length; y++){
          if(postList[i].position_uuid === postList[y].position_uuid){
            postList[i]['person'].push(postList[y]['person'][0])
          }
        }
        check.push(postList[i].position_uuid)
        result.push(postList[i])
      }
    }
      return res.status(200).json(result);
  },
};

const AppPosition = {
  post: async (req, res): Promise<void> => {

    if(!req.headers.authorization){
      return res.status(401).json({})
    }

    const position_uuid: string = req.params.position_uuid;
    const person:TokenInfo = verifyToken(req.headers.authorization);
    // console.log("토큰은!!!!!" + req.headers.authorization)
    console.log(person)

    if( !person ){
      return res.status(401).json({})
    }

    const invalidUser = await Person.findOne({uuid:person.uuid})
    console.log("유저확인!!!" + invalidUser)
    const findPosition = await Position.findOne({uuid: position_uuid})
    console.log("포지션확인!!!!" + findPosition)    
    const invaliudAdv = await Advert.findOne({uuid: findPosition.advert_uuid})
    console.log("게시글확인!!!!" + invaliudAdv)

    if( !invalidUser || !invaliudAdv || !findPosition){
      return res.status(404).json({})
    }

    const checkApply = await Application.findOne({
      position_uuid,
      person_uuid:person.uuid,
    });

    if (checkApply !== undefined) {
      return res.status(201).json({ created_at: checkApply.created_at });
    }

    try {
      const newApplication = await Application.insert({
        person_uuid:person.uuid,
        position_uuid,
      });
      const { created_at } = newApplication.generatedMaps[0];
      return res.status(201).json({ created_at });
    } catch (e) {
      return res.status(500).json({ message: "server ERROR, Please retry" });
    }
  },

  patch: async (req, res): Promise<void> => {
    
    if(!req.headers.authorization){
      return res.status(401).json({})
    }
    
    interface incomingData {
      position_uuid: string;
      person_uuid: string;
      state: string;
    }
    
    const { position_uuid, person_uuid, state }: incomingData = req.body;
    const org:TokenInfo = verifyToken(req.headers.authorization);
    
    if( !org ){
      return res.status(401).json({})
    }
    
    const checkUnauth = await getRepository(Position)
    .createQueryBuilder('Position')
    .select(["Advert.uuid as uuid"])
    .leftJoin("Position.Advert","Advert")
    .leftJoin("Advert.Org","Org")
    .where({uuid: position_uuid})
    .andWhere("Org.uuid =:uuid",{uuid:org.uuid})
    .execute()

    if(checkUnauth.length === 0){
      return res.status(401).json({})
    }
    console.log(req.body)
    console.log("Person" + person_uuid)
    console.log("Position::" + position_uuid)
    console.log("Org::" + org.uuid)
    const checkData = await getRepository(Application)
      .createQueryBuilder("Application")
      .select([
        "Application.person_uuid as person_uuid",
        "Advert.org_uuid",
        "Application.received_at as received_at",
        "Application.hired_at as hired_at",
        "Application.position_uuid as position_uuid",
      ])
      .leftJoin("Application.Position", "Position")
      .leftJoin("Position.Advert", "Advert")
      .where({ position_uuid })
      .andWhere({ person_uuid })
      .andWhere("Advert.org_uuid =: org_uuid", { org_uuid:org.uuid })
      .getQuery();

    console.log(checkData)
    //토큰,유효하지 않은 Application에 대해 분기처리
    if (!checkData) {
      return res.status(400).json({});
    }
    //received를 건너뛴 hired요청
    else if (state === "hired" && checkData["received_at"] === null) {
      return res.status(400).json({});
    }
    //이미 완료된 요청에 대한 재응답 요청
    else if (checkData[state] !== null) {
      return res.status(204).json({});
    } 
    else {
      const newDate = {};
      newDate[state] = Date();
      const before = await Application.findOne({person_uuid, position_uuid})
      console.log(before)
      await Application.update({ person_uuid, position_uuid }, newDate);
      const after = await Application.findOne({person_uuid, position_uuid})
      console.log(after)
      return res.status(200).json();
    }
  },
};

export { AppPerson, AppAdvert, AppPosition };