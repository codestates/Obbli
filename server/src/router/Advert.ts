import * as route from "express";
const Advert = require("../controllers/Advert");
const Application = require("../controllers/Application");
const router = route.Router();

//게시글 전체 목록 가져오기
router.get("/", Advert.MainPage.advert.get);

//게시글 작성하기
router.post("/", Advert.PrivatePage.advert.post);
//게시글 선택시 자세한 정보 가져오기
router.get("/:advert_uuid", Advert.PrivatePage.advert.get);
//게시글 수정하기
router.patch("/:advert_uuid", Advert.PrivatePage.advert.patch);
//게시글 삭제하기
router.delete("/:advert_uuid", Advert.PrivatePage.advert.delete);

//Application 부분
//자신이 작성한 모집 게시글들 가져오기
router.get("/:advert_uuid/application", Application.Application.advert.get);

module.exports = router;
