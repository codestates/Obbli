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
    const org_uuid: string = verifyToken(req.headers.authorization).uuid;
    const person_uuid: string = req.params.person_uuid;
    const checkReview = await Person_review.findOne({ org_uuid,person_uuid });

    // 이미 리뷰르 작성했거나 토큰이 유효하지 않을경우
    if (checkReview || !org_uuid) {
      return res.status(401).json({ message: 'You do not have permission' });
    }
    const { rating,comment }: { rating: number, comment: string } = req.body;
    await Person_review.insert({ person_uuid, org_uuid, comment, rating })
    .catch((err) => {
      return res.status(500).json({ message: 'server ERROR, Please retry' });
    });

    return res.status(201).json(req.body);
  },

  get: async (req, res): Promise<void> => {
    //user로 작성된 review 가져오기
    const org_uuid: string = verifyToken(req.headers.authorization).uuid;
    const person_uuid: string = req.params.person_uuid;
    if (!org_uuid) {
      return res.status(401).json({ message: 'You do not have permission' });
    }
    const reviewList = await Person_review.find({
      where: { person_uuid },
      select: ['comment','rating'],
    });
    return res.status(200).json(reviewList);
  },

  patch: async (req, res): Promise<void> => {
    //작성한 review 수정하기
    //수정할때 수정된 내용만 가져올건지 확인
    const person_uuid: string = req.params.person_uuid;
    const org_uuid: string = verifyToken(req.headers.authorization).uuid;
    const { comment, rating } = req.body;

    if (!org_uuid) {
      return res.status(401).json({ message: 'You do not have permission' });
    }
    const updateReview = await Person_review.update(
      { person_uuid, org_uuid },
      { comment, rating },
    ).catch((err) => {
        return res.status(500).json({ message: 'server ERROR, Please retry' });
    });
    //업데이트할 대상이 없을경우
    if (updateReview.affected === 0) {
      return res.status(400).json({ message: "Not find review" });
    }
    return res.status(200).send({ comment, rating });
  },

  delete: async (req, res): Promise<void> => {
    const person_uuid: string = req.params.person_uuid;
    const org_uuid: string = verifyToken(req.headers.authorization).uuid;

    if (!org_uuid) {
      return res.status(400).json({ message: 'You do not have permission' });
    }
    const deleteReview = await Person_review.delete({ person_uuid, org_uuid })
      .catch((err) => {
        return res.status(500).json({ message: 'server ERROR, Please retry' });
      })
    //삭제 대상 리뷰가 없을경우
    if (deleteReview.affected === 0) {
      return res.status(400).json({ message: "Not find review" });
    }
    return res.status(204).send();
  },
};

const OrgReview = {
  post: async (req, res):Promise<void> => {
    //review 작성(person ===> Org)
    const person_uuid: string = verifyToken(req.headers.authorization).uuid
    const org_uuid: string = req.params.org_uuid
    const checkReview = await Org_review.findOne({ org_uuid, person_uuid })

    if (checkReview !== undefined) {
      return res.status(200).send(checkReview);
    }
    const { rating, comment }: { rating: number, comment: string } = req.body;
    await Org_review.insert({ person_uuid, org_uuid, comment, rating })
      .catch((err) => {
        return res.status(500).json({ message: 'server ERROR, Please retry' });
      });
    return res.status(201).json({ rating, comment });
  },

  get: async (req, res): Promise<void> => {
    //단체가 작성한 review 가져오기
    const person_uuid: string = verifyToken(req.headers.authorization).uuid;
    const org_uuid: string = req.params.org_uuid;
    if (!person_uuid) {
      return res.status(401).json({ message: 'You do not have permission' });
    }
    const reviewList = await Org_review.find({
      where:{org_uuid},
      select:['rating','comment'],
    });
    return res.status(200).json(reviewList);
  },

  patch: async (req, res):Promise<void> => {
    //작성한 review 수정하기
    const org_uuid: string = req.params.org_uuid;
    const person_uuid: string = verifyToken(req.headers.authorization).uuid;
    const { comment, rating } = req.body;

    if(!person_uuid){
      return res.status(401).json({ message: 'You do not have permission' });
    }
    const updateReview = await Org_review.update(
      { person_uuid,org_uuid },
      { comment, rating },
    ).catch(err => {
        return res.status(500).json({ message: 'server ERROR, Please retry' });
    });
    //업데이트할 대상이 없을경우
    if (updateReview.affected === 0) {
      return res.status(400).json({ message: "Not find review" });
    }
    return res.status(200).send({ comment, rating });
  },

  delete:async (req, res):Promise<void> => {
    //작성한 review 삭제하기
    const org_uuid: string = req.params.org_uuid;
    const person_uuid: string = verifyToken(req.headers.authorization).uuid;

    if (!person_uuid) {
      return res.status(400).json({ message: 'You do not have permission' });
    }
    const deleteReview = await Org_review.delete({ person_uuid, org_uuid })
      .catch((err) => {
        return res.status(500).json({ message: 'server ERROR, Please retry' });
      });
    //삭제 대상 리뷰가 없을경우
    if(deleteReview.affected === 0) {
      return res.status(400).json({ message: "Not find review" });
    }
    return res.status(204).send();
  },
};

export { PersonReview, OrgReview };
