module.exports = {
  person: {
    get: (req, res) => {
      res.status(200).send("참여목록 가져오기");
      //참여 목록가져오기
    },
  },
  advert: {
    get: (req, res) => {
      res.status(200).send("모집게시글 가져오기");
      //자신이 작성한 모집 게시글들 가져오기
    },
  },
  position: {
    post: (req, res) => {
      res.status(200).send("신청한 게시글가져오기");
      //신청한 게시글가져오기
    },
  },
};
