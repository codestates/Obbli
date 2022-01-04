import * as route from "express";
const Application = require("../controllers/Application");
const router = route.Router();

//application에 모집글의 포지션별의 uuid를 작성
router.post(
  "/application/:position_uuid",
  Application.Application.position.post
);

module.exports = router;
