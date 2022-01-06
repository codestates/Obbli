import * as route from "express";
import {advertList, Mainadvert} from '../controllers/Advert'
import { AppAdvert } from "../controllers/Application";

const router = route.Router();


//게시글 전체 목록 가져오기
router.get("/", advertList.get);

//게시글 작성하기
router.post("/", Mainadvert.post);
//게시글 선택시 자세한 정보 가져오기
router.get("/:advert_uuid", Mainadvert.get);
//게시글 수정하기
router.patch("/:advert_uuid", Mainadvert.patch);
//게시글 삭제하기
router.delete("/:advert_uuid", Mainadvert.delete);

//Application 부분
//자신이 작성한 모집 게시글들 가져오기
router.get("/:advert_uuid/application", AppAdvert.get);

export default router
