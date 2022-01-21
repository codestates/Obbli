import { Person_review, Org_review, Person } from "../entity";
import { verifyToken } from "../Util";

interface TokenInfo {
  uuid: string,
  user_id: string,
  created_at: Date
}

const PersonReview = {
  post: async (req, res): Promise<void> => {
    //Review 작성(Person ===> Org)
    if(!req.headers.authorization){
      return res.status(401).json({})
    }

    const org: TokenInfo= verifyToken(req.headers.authorization);
    const person_uuid: string = req.params.person_uuid;
    const checkReview = await Person_review.findOne({ org_uuid:org.uuid,person_uuid });

    // 이미 리뷰르 작성했거나 토큰이 유효하지 않을경우
    if (checkReview || !org.uuid) {
      return res.status(401).json({});
    }
    const { rating,comment }: { rating: number, comment: string } = req.body;
    await Person_review.insert({ person_uuid, org_uuid:org.uuid, comment, rating })
    .catch((err) => {
      return res.status(500).json({});
    });

    return res.status(201).json(req.body);
  },

  get: async (req, res): Promise<void> => {
    if (!req.headers.authorization) { return res.status(401).send(); }

    const auth = verifyToken(req.headers.authorization);
    if (!auth) { return res.status(401).send(); }
    const { uuid } = auth;

    if (!auth) { return res.status(401).send(); }

    const reviewList = await Org_review.find({
      where: { person_uuid: uuid },
      select: ['comment','rating'],
    });
    return res.status(200).json(reviewList);
  },

  patch: async (req, res): Promise<void> => {
    //작성한 review 수정하기
    //수정할때 수정된 내용만 가져올건지 확인

    if(!req.headers.authorization){
      return res.status(401).json({})
    }

    const person_uuid: string = req.params.person_uuid;
    const org: TokenInfo = verifyToken(req.headers.authorization);
    const { comment, rating } = req.body;

    if (!org) {
      return res.status(401).json({});
    }
    const updateReview = await Person_review.update(
      { person_uuid, org_uuid:org.uuid },
      { comment, rating },
    ).catch((err) => {
        return res.status(500).json({ message: 'server ERROR, Please retry' });
    });
    //업데이트할 대상이 없을경우
    if (updateReview.affected === 0) {
      return res.status(401).json({});
    }
    return res.status(200).send({ comment, rating });
  },

  delete: async (req, res): Promise<void> => {

    if(!req.headers.authorization){
      return res.status(401).json({})
    }

    const person_uuid: string = req.params.person_uuid;
    const org: TokenInfo = verifyToken(req.headers.authorization);

    if (!org) {
      return res.status(401).json({});
    }
    const deleteReview = await Person_review.delete({ person_uuid, org_uuid:org.uuid })
      .catch((err) => {
        return res.status(500).json({ message: 'server ERROR, Please retry' });
      })
    //삭제 대상 리뷰가 없을경우
    if (deleteReview.affected === 0) {
      return res.status(401).json({});
    }
    return res.status(204).send();
  },
};

const OrgReview = {
  post: async (req, res):Promise<void> => {
    //review 작성(person ===> Org)

    if(!req.headers.authorization){
      return res.status(401).json({})
    }

    const person:TokenInfo= verifyToken(req.headers.authorization)
    const org_uuid: string = req.params.org_uuid
    const checkReview = await Org_review.findOne({ org_uuid, person_uuid:person.uuid })

    if (checkReview !== undefined) {
      return res.status(200).send(checkReview);
    }
    const { rating, comment }: { rating: number, comment: string } = req.body;
    await Org_review.insert({ person_uuid:person.uuid, org_uuid, comment, rating })
      .catch((err) => {
        return res.status(500).json({ message: 'server ERROR, Please retry' });
      });
    return res.status(201).json({ rating, comment });
  },

  get: async (req, res): Promise<void> => {
    //단체가 작성한 review 가져오기

    if(!req.headers.authorization){
      return res.status(401).json({})
    }

    const person: TokenInfo = verifyToken(req.headers.authorization);
    const org_uuid: string = req.params.org_uuid;
    if (!person || !org_uuid) {
      return res.status(401).json({});
    }
    const reviewList = await Org_review.find({
      where:{org_uuid},
      select:['rating','comment'],
    });
    return res.status(200).json(reviewList);
  },

  patch: async (req, res):Promise<void> => {
    //작성한 review 수정하기

    if(!req.headers.authorization){
      return res.status(401).json({})
    }

    const org_uuid: string = req.params.org_uuid;
    const person: TokenInfo = verifyToken(req.headers.authorization);
    const { comment, rating } = req.body;

    if(!org_uuid || !person){
      return res.status(401).json({});
    }
    const updateReview = await Org_review.update(
      { person_uuid:person.uuid , org_uuid },
      { comment, rating },
    ).catch(err => {
        return res.status(500).json({ message: 'server ERROR, Please retry' });
    });
    //업데이트할 대상이 없을경우
    if (updateReview.affected === 0) {
      return res.status(410).json({});
    }
    return res.status(200).send({ comment, rating });
  },

  delete:async (req, res):Promise<void> => {
    //작성한 review 삭제하기

    if(!req.headers.authorization){
      return res.status(401).json({})
    }

    const org_uuid: string = req.params.org_uuid;
    const person: TokenInfo = verifyToken(req.headers.authorization);

    if (!person.uuid || !org_uuid) {
      return res.status(401).json({});
    }
    const deleteReview = await Org_review.delete({ person_uuid:person.uuid, org_uuid })
      .catch((err) => {
        return res.status(500).json({ message: 'server ERROR, Please retry' });
      });
    //삭제 대상 리뷰가 없을경우
    if(deleteReview.affected === 0) {
      return res.status(401).json({});
    }
    return res.status(204).send();
  },
};

export async function getPersonReview(req, res) {
  const { person_uuid } = req.params;
  const rows = await Person_review.find({
    select: ['comment', 'rating'],
    where: { person_uuid },
  });

  return res.status(200).send(rows);

}

export { PersonReview, OrgReview };
