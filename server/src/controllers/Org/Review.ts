module.exports = {
  review: {
    post: (req, res) => {
      //review 작성
      res.status(200).send("review작성");
    },
    get: (req, res) => {
      res.status(200).send("단체가 작성한 review가져오기");
      //단체가 작성한 review 가져오기
    },
    patch: (req, res) => {
      res.status(200).send("작성한 review수정하기");
      //작성한 review 수정하기
    },
    delete: (req, res) => {
      res.status(200).send("작성한 review삭제하기");
      //작성한 review 삭제하기
    },
  },
};
