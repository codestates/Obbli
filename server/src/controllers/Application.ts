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
      console.log(req.params.person_uuid)
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
      //자신이 작성한 모집 게시글들 가져오기
      const orgInfo:TokenInfo = verifyToken(req.headers.authorization)
      const advUuid:string = req.params.advert_uuid
      
      const postList = await getRepository(Position)
      .createQueryBuilder('pos')
      .select(['pos.uuid as uuid','pos.advert_uuid as advert_uuid','Application.person_uuid as person_uuid'])
      .leftJoin('pos.Application','Application')
      .where({advert_uuid:advUuid})
      .getRawMany()
      .catch(err => {
        return res.status(500).json({message:'server ERROR, Please retry'})
      })
      
      return res.status(200).json({postList});
    },
  }

  const AppPosition =  {
    post: (req, res) => {
      const position_uuid:string = req.params.position_uuid
      const person_uuid:string = verifyToken(req.headers.authorization).uuid
      const checkApply = Application.find({position_uuid,person_uuid})

      if(checkApply){
        return res.status(400).json({message:'Already applied'})
      }
      else{
        Application.insert({person_uuid,position_uuid})
        .catch(err => {
          return res.status(500).json({message:'server ERROR, Please retry'})
        })
        
        return res.status(201).json(person_uuid);
      }
    },
  }


export {AppPerson, AppAdvert, AppPosition}
