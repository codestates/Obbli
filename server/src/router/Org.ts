import * as route from "express";
import { SignIn, SignUp,SignOut, OrgInfo } from '../controllers/Org'
import { OrgReview } from "../controllers/Review";

const router = route.Router();

//회원가입
router.post("/", SignUp.post);
//로그인
router.post("/sign-in", SignIn.post);
//단체정보 요청
router.get("/", OrgInfo.get);
//단체정보 수정
router.patch("/", OrgInfo.patch);
//회원탈퇴
router.delete("/", OrgInfo.delete);
//review 작성
router.post("/review/:org_uuid", OrgReview.post);
//단체가가 작성한 review 가져오기
router.get("/review/:org_uuid", OrgReview.get);
//작성한 review 수정하기
router.patch("/review/:org_uuid", OrgReview.patch);
//작성한 review 삭제하기
router.delete("/review/:org_uuid", OrgReview.delete);

export default router

