import { AppPerson } from '../controllers/Application';
import { PersonReview } from '../controllers/Review'
import { SignIn, SignUp, SignOut, UserInfo } from '../controllers/Person'

const router = require("express").Router();

//회원가입
router.post("/", SignUp.post);
//로그인
router.post("/sign-in", SignIn.post);
//로그아웃
router.post('/sign-out', SignOut.post)
//유저정보 요청
router.get("/", UserInfo.get);
//유저정보 수정
router.patch("/", UserInfo.patch);
//회원탈퇴
router.delete("/", UserInfo.delete);
//review 작성
router.post("/review/:person_uuid", PersonReview.post);
//user가 작성된 review 가져오기
router.get("/review/:person_uuid", PersonReview.get);
//작성한 review 수정하기 (:query를 하나로 합치는것 건의 & || - 사용 )
router.patch("/review/:person_uuid", PersonReview.patch);
//작성한 review 삭제하기
router.delete("/review/:person_uuid", PersonReview.delete);

//Application 부분
//참여 목록 가져오기
router.get("/application", AppPerson.get);

export default router

