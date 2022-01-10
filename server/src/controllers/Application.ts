import { createConnection, getRepository } from "typeorm";
import { Application, Position } from "../entity";
import { verifyToken } from "../Util";

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
  porg_uuid: string
}

  const AppPerson= {
    get: async (req, res) => {
      //참여 목록가져오기
      console.log(req.params.person_uuid)
      const personInfo:TokenInfo = verifyToken(req.headers.authorization)

      const appRepo = await getRepository(Application)
      .createQueryBuilder('app')
      .leftJoinAndSelect('app.Position','Position')
      // .leftJoinAndSelect('Position.Advert','Advert')
      // .leftJoinAndSelect('Advert.Org','Org')
      .where('app.Person = :uuid',{uuid:personInfo.uuid})
      .getMany()

      console.log(appRepo)
      // const posRepo = getRepository(Position)
      // .createQueryBuilder('pos')
      // .leftJoinAndSelect('pos.Advert','Position')
      // .leftJoinAndSelect('pos.Skill','Application')
      // .leftJoinAndSelect('pos.Application','Position')
      // .where('app.Person = :uuid',{uuid:personInfo.uuid})
      // .getMany()

     

      

      return res.status(200)

    },
  }
  const  AppAdvert =  {
    get: (req, res) => {
      res.status(200).send("모집게시글 가져오기");
      //자신이 작성한 모집 게시글들 가져오기
    },
  }
  const AppPosition =  {
    post: (req, res) => {
      res.status(200).send("신청한 게시글가져오기");
      //신청한 게시글가져오기
    },
  }


export {AppPerson, AppAdvert, AppPosition}
