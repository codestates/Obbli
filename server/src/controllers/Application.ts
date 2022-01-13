import { getRepository } from "typeorm";
import { Application, Person, Position } from "../entity";
import { verifyToken } from "../Util";
import { OrgInfo } from "./Org";

interface TokenInfo {
  uuid: string,
  user_id: string,
  created_at: Date
}

interface Person_App {
    org_uuid: string
    org_name: string,
    part_name: string,
    created_at: Date,
    reviewed_at: Date | null,
    hired_at: Date | null
    review_uuid: string,
    rating: number |null
}

interface Advert_App {
  uuid: string,
  person_uuid: string,
  advert_uuid: string,
  // porg_uuid: string
}

  const AppPerson= {
    get: async (req, res) => {
      //참여 목록가져오기
      const personInfo:TokenInfo = verifyToken(req.headers.authorization)

      const AppList = await getRepository(Application)
      .createQueryBuilder('app')
      .select(['app.created_at as created_at','app.received_at as received_at','app.hired_at as hired_at',
      'Skill.name as skill_name','Org.uuid as org_uuid','Org.name as org_name'])
      .leftJoin('app.Position','Position')
      .innerJoin('Position.Skill','Skill')
      .leftJoin('Position.Advert','Advert')
      .leftJoin('Advert.Org','Org')
      .where({person_uuid:personInfo.uuid})
      .getRawMany()
      .catch(err => {
        return res.status(500).json({message:'server ERROR, Please retry'})
      })

      return res.status(200).send(AppList)

    },
  }

  const  AppAdvert =  {
    get: async (req, res):Promise<void> => {
      //자신이 작성한 모집 게시글에 참여한 person 목록 가져오기
      const orgInfo:TokenInfo = verifyToken(req.headers.authorization)
      const advertUuid:string = req.params.advert_uuid

      if(!orgInfo){
        return res.status(400).json({message:'You do not have permission'})
      }
      else{
        const postList = await getRepository(Position)
        .createQueryBuilder('pos')
        .select(['Application.person_uuid as person_uuid',
        'Skill.name as skill_name','person.realname as person_name','person.professional as professional'])
        .leftJoin('pos.Application','Application')
        .leftJoin('Application.Person','Person')
        .leftJoin('pos.Skill','Skill')
        .where({advert_uuid:advertUuid})
        .getRawMany()
        .catch(err => {
          return res.status(500).json({message:'server ERROR, Please retry'})
        })
        return res.status(200).json(postList);
      }
      //Person Entity realname => name으로 변경
    },
  }

  const AppPosition =  {
    post: async (req, res) => {
      const position_uuid: string = req.params.position_uuid
      const person_uuid: string = verifyToken(req.headers.authorization).uuid
      const checkApply = await Application.findOne({ position_uuid, person_uuid });

      if (checkApply !== undefined) {
        return res.status(201).json({ created_at: checkApply.created_at })
      }

      try {
        const newApplication = await Application.insert({ person_uuid, position_uuid })
        const { created_at } = newApplication.generatedMaps[0];
        return res.status(201).json({ created_at });
      } catch(e) {
        return res.status(500).json({ message: 'server ERROR, Please retry' });
      }
    },
  }


export {AppPerson, AppAdvert, AppPosition}
