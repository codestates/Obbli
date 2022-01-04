// const router = require("express").Router();
import * as route from "express";
const Org = require("../controllers/Org");
const router = route.Router();

//회원가입
router.post("/", Org.Sign.Sign_up.post);
//로그인
router.post("/sign-in", Org.Sign.Sign_in.post);
//단체정보 요청
router.get("/:org_uuid", Org.OrgInfo.OrgInfo.get);
//단체정보 수정
router.patch("/:org_uuid", Org.OrgInfo.OrgInfo.patch);
//회원탈퇴
router.delete("/:org_uuid", Org.OrgInfo.OrgInfo.delete);
//review 작성
router.post("/:org_uuid/review", Org.Review.review.post);
//단체가가 작성한 review 가져오기
router.get("/:org_uuid/review", Org.Review.review.get);
//작성한 review 수정하기
router.patch("/:org_uuid/review/:person_uuid", Org.Review.review.patch);
//작성한 review 삭제하기
router.delete("/:org_uuid/review/:person_uuid", Org.Review.review.delete);

module.exports = router;
