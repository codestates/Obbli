import axios from 'axios';
import React, {useState} from 'react';

interface UserStateType {
  isSignedIn: boolean,
  accessToken: string,
  uuid: string,
}

interface LoginModal {
    isSignInVisible: boolean;
    setIsSignInVisible: React.Dispatch<React.SetStateAction<boolean>>;
    setIsSignUpVisible: React.Dispatch<React.SetStateAction<boolean>>;
    setUserState: React.Dispatch<React.SetStateAction<UserStateType>>
}

interface LoginInfo {
    id: string;
    pw: string;
    permission: string
}

const myId:string = "kimcoding";
const myPw:string = "qweqwe"
const API_SERVER:string = '';

function SignIn (props: LoginModal):JSX.Element {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loginInfo, setLoginInfo] = useState<LoginInfo>({
    id: '',
    pw: '',
    permission:''
  })

    const controlInput = (key:string) => (e:any) => {
        setLoginInfo({ ...loginInfo, [key]: e.target.value });
      };

      const handleLogin = () => {
        if(myId === loginInfo.id && myPw === loginInfo.pw){
            setErrorMessage("로그인 성공!")
            // //TODO: axios:get 비교 후 로그인 승인
            // axios.post(API_SERVER,{
            //   user_id: loginInfo.id,
            //   pw: loginInfo.pw
            // },
            // { headers: { "Content-Type": "application/json" }})
            // .then(({data: {uuid, access_token: accessToken}})=>{
            //   props.setUserState({
            //     isSignedIn: true,
            //     accessToken,
            //     uuid
            //   })
            // })
            // .then(()=>{
              props.setIsSignInVisible(false);
            // })
            // .catch((err)=> console.log(err))
        }else{
            setErrorMessage("아이디와 비밀번호를 확인해주세요!")
        }
      }

      const changeModal = () => {
        props.setIsSignInVisible(false);
        props.setIsSignUpVisible(true);
      }

  return (
      <>
      {props.isSignInVisible
      ? (
    <div className="modalBackground" onClick={() => props.setIsSignInVisible(false)}>
      <div className="signInWrap" onClick={(e) => e.stopPropagation()}>
        <div className="signInLogo">로그인</div>
        <div className="signInChoiseWrap">
            <input type="radio" id="perLogin" name="permission" value="person" checked={true} onChange={controlInput('permission')} />
            <label htmlFor="perLogin" className="permissionPerson">개인회원</label>
            <input type="radio" id="orgLogin" name="permission" value="org" onChange={controlInput('permission')} />
            <label htmlFor="orgLogin" className="permissionOrg">단체회원</label>
        </div>
        <div className="signInInputWrap">
            <div>아이디</div>
            <input type="text" placeholder="아이디를 입력하시오" value={loginInfo.id} onChange={controlInput('id')} />
            <div>비밀번호</div>
            <input type="password" placeholder="비밀번호를 입력하시오" value={loginInfo.pw} onChange={controlInput('pw')} />
        </div>
        <div className="errMessage">
        {errorMessage}
        </div>
        <div className="signInbutton">
            <div className="btn" onClick={changeModal}>회원가입</div>
            <div className="btn" onClick={handleLogin}>로그인</div>
        </div>
      </div>
    </div>) : null}
    
    </>
  )
}

export default SignIn
