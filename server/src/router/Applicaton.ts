import * as route from "express";
import { AppPosition } from "../controllers/Application";

const router = route.Router();

//application에 모집글의 포지션별의 uuid를 작성
router.post("/:position_uuid",AppPosition.post);
//recevied, hired 테스트 
router.patch("/", AppPosition.patch);

export default router