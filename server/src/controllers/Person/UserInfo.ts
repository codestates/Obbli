module.exports = {
  UserInfo: {
    get: (req, res) => {
      //유저 정보 가져오기
      res.status(200).send("유저정보 가져오기");
    },
    patch: (req, res) => {
      //유저정보 수정하기
      res.status(200).send("유저정보 수정하기");
    },
    delete: (req, res) => {
      //유저정보 삭제하기
      res.status(200).send("유저정보삭제하기");
    },
  },
};
