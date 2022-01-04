module.exports = {
  OrgInfo: {
    get: (req, res) => {
      //단체 정보 가져오기
      res.status(200).send("단체정보요청하기");
    },
    patch: (req, res) => {
      res.status(200).send("단체정보수정하기");
      //단체정보 수정하기
    },
    delete: (req, res) => {
      res.status(200).send("단체정보 삭제하기");
      //단체정보 삭제하기
    },
  },
};
