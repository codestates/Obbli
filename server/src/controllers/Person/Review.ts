module.exports = {
  review: {
    post: (req, res) => {
      console.log(req.params);
      //review 작성
      res.status(200).send("리뷰작성");
    },
    get: (req, res) => {
      //user가 작성된 review 가져오기
      res.status(200).send("리뷰가져오기");
    },
    patch: (req, res) => {
      //작성한 review 수정하기
      res.status(200).send("리뷰수정하기");
    },
    delete: (req, res) => {
      //작성한 review 삭제하기
      res.status(200).send("리뷰삭제하기");
    },
  },
};
