const router = require("express").Router();
const Person = require("../controllers/Person");
const Application = require("../controllers/Application");

//회원가입
router.post("/", Person.Sign.Sign_up.post);
//로그인
router.post("/sign_in", Person.Sign.Sign_in.post);
//유저정보 요청
router.get("/:person_uuid", Person.UserInfo.UserInfo.get);
//유저정보 수정
router.patch("/:person_uuid", Person.UserInfo.UserInfo.patch);
//회원탈퇴
router.delete("/:person_uuid", Person.UserInfo.UserInfo.delete);
//review 작성
router.post("/:person_uuid/review", Person.Review.review.post);
//user가 작성된 review 가져오기
router.get("/:person_uuid/review", Person.Review.review.get);
//작성한 review 수정하기 (:query를 하나로 합치는것 건의 & || - 사용 )
router.patch("/:person_uuid/review/:org_uuid", Person.Review.review.patch);
//작성한 review 삭제하기
router.delete("/:person_uuid/review/:org_uuid", Person.Review.review.delete);

//Application 부분
//참여 목록 가져오기
router.get("/:person_uuid/application", Application.Application.person.get);

module.exports = router;
