import { getConnection, getRepository } from "typeorm";
import { Person_review,Org_review, Person} from "../entity";
import { verifyToken } from "../Util";

interface TokenInfo {
  uuid: string,
  user_id: string,
  created_at: Date
}


const PersonReview = {
  post: async (req, res):Promise<void> => {
    const writerInfo:TokenInfo = verifyToken(req.headers.authorization)
    const checkReview = await Person_review.findOne({org_uuid:writerInfo.uuid})

    if(!writerInfo ){
      return res.status(400).json({message:'You do not have permission'})
    }
    else{
      const targetUuid:string = req.params.person_uuid
      const { rating,comment }:{rating:number,comment:string} =req.body
      //회원 고유의 Rating column이있어야 관리가 가능함

      const connection = getConnection();
      // const newReview = await Person_review.create({
      //   org_uuid:writerInfo.uuid,
      //   rating: rating,
      //   comment:comment
      // }).save()

      const newcomment = new Person_review()
      newcomment.comment = comment,
      newcomment.rating = rating,
      newcomment.org_uuid = writerInfo.uuid
      await connection.manager.save(newcomment)
      
      const personInfo = await Person.findOne({uuid:targetUuid})
      console.log(personInfo)
      const person = new Person()
      person.user_id

      // const person = new Person()
      // person.Person_review = [newReview] 
      // await connection.manager.save(person)
  
      return res.status(201).json({uuid:targetUuid});
    }
  },
  get: async (req, res):Promise<void> => {
    //user가 작성된 review 가져오기
    const targetUuid:string = req.params.person_uuid

    const reviewList = await getRepository(Person_review)
    .createQueryBuilder('rev')
    .leftJoinAndSelect('rev.Person','Person_review')
    .where('rev.person_uuid = :id',{id:targetUuid})
    .getMany()

    console.log(reviewList)
    return res.status(200).json({reviewList})

  },
  patch: (req, res): void => {
    //작성한 review 수정하기
    res.status(200).send("리뷰수정하기");
  },
  delete: (req, res): void => {
    //작성한 review 삭제하기
    res.status(200).send("리뷰삭제하기");
  },
};

const OrgReview = {
  post: (req, res) => {
    //review 작성
    res.status(200).send("review작성");
  },
  get: (req, res) => {
    res.status(200).send("단체가 작성한 review가져오기");
    //단체가 작성한 review 가져오기
  },
  patch: (req, res) => {
    res.status(200).send("작성한 review수정하기");
    //작성한 review 수정하기
  },
  delete: (req, res) => {
    res.status(200).send("작성한 review삭제하기");
    //작성한 review 삭제하기
  },
};

export { PersonReview, OrgReview };
