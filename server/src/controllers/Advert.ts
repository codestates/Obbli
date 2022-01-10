import { Advert, Org } from "../entity";
import { verifyToken } from "../Util";

interface TokenInfo {
  uuid: string,
  user_id: string,
  created_at: Date
}

interface AdvertInfo {
    uuid: string ,
    org_uuid: string
    created_at: Date,
    content:string
}

const advertList = {
  get: async (req, res): Promise<void> => {
    //게시글 가져오기
    const advartList = await Advert.find({ select: ["uuid", "content"] });
    return res.status(200).json({ advartList });
  },
};

const Mainadvert = {
  get: async (req, res):Promise<void> => {
    //게시글 선택시 자세한 정보 가져오기
    const verifyTarget:TokenInfo = verifyToken(req.headers.authorization);
    const targetAdvert_uuid:string = req.params.advert_uuid

    if(!verifyTarget){
      return res.status(400).json({message: '이런사람 없습니다.'})
    } 
    else{
      const advertInfo:AdvertInfo = await Advert.findOne({uuid: targetAdvert_uuid})
      return res.status(200).json({advertInfo});
    }

  },
  post: async (req, res):Promise<void> => {
    //게시글 작성하기
    const verifyTarget:TokenInfo = verifyToken(req.headers.authorization);
    const newContent:string = req.body.content;

    const writerInfo:{uuid:string} = await Org.findOne({ uuid: verifyTarget.uuid },{select:['uuid']});
    

    if (!writerInfo) {
      return res.status(400).json({ message: "토큰에 문제가 있습니다." });
    } else {
      await Advert.create({
        org_uuid: writerInfo.uuid,
        content: newContent,
      }).save();

      return res.status(200).json({ message: "게시가 완료되었습니다." });
    }
  },
  patch: async (req, res) => {
    const newContent: string = req.body.content;
    const target_uuid:string = req.params.advert_uuid
    const writerInfo:string = verifyToken(req.headers.authorization).uuid;

    if(!writerInfo){
      return res.status(400).json({message:'이런사람 없습니다.'})
    }
    Advert.update({uuid:target_uuid},{content:newContent})

    return res.status(200).json({message:'변경이 완료되었습니다.'})
    //게시글 수정하기
  },
  delete: (req, res) => {
    //게시글 삭제하기
    const target_uuid:string = req.params.advert_uuid
    const writerInfo:string = verifyToken(req.headers.authorization).uuid;

    if(!writerInfo){
      return res.status(400).json({message:'이런사람 없습니다.'})
    }
    else{
      Advert.delete({uuid: target_uuid})
    return res.status(200).json({message:'삭제가 완료 되었습니다.'})
    }
  },
};

export { advertList, Mainadvert };
