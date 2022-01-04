module.exports = {
  Sign_in: {
    post: (req, res) => {
      //로그인 하기
      res.status(200).send("로그인하기");
    },
  },
  Sign_up: {
    post: (req, res) => {
      //회원가입
      res.status(200).send("회원가입하기");
    },
  },
};
