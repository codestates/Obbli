import axios from "axios";
import { useState } from "react";

interface UserStateType {
    isSignedIn: boolean,
    accessToken: string,
  }

interface LoginModal {
  isSignUpVisible: boolean;
  setIsSignUpVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setUserState: React.Dispatch<React.SetStateAction<UserStateType>>;
}

interface SignUPType {
    user_id: string,
    pw: string,
    pw_check: string,
    name: string,
    permission: string
  }  

function SignUp( props:LoginModal ):JSX.Element {
  const [errorMessage, setErrorMessage] = useState<string>('');  
  const [signUpInfo, setSignUpInfo] = useState<SignUPType>({
    user_id: '',
    pw: '',
    pw_check: '',
    name: '',
    permission: ''
  })

  const controlInput = (key:string) => (e:React.ChangeEvent<HTMLInputElement>) => {
    setSignUpInfo({ ...signUpInfo, [key]: e.target.value });
  };

  const handleSignUp = () => {
    const {user_id, pw, pw_check, name, permission} = signUpInfo;
    
    if(pw !== pw_check){
      setErrorMessage('비밀번호가 다릅니다.')
      return;
    }
    if(!user_id || !pw || !pw_check || !name){
      setErrorMessage('모든 칸을 채워주세요!')
      return ;
    }
    // TODO: axios:post 할때 맨드포인트에 permission으로 단체와 개인회원 구분
    setErrorMessage('가입 가능합니다!')
    axios.post(`/${permission}`, {
      user_id,
      pw,
      pw_check,
      name
    })
    .then(({data: {access_token: accessToken}})=>{
      axios.defaults.headers.common.authorization = accessToken;
      props.setUserState({ isSignedIn: true, accessToken })
      props.setIsSignUpVisible(false);
    })
    .catch((err)=> console.log(err))
  }

  return (
    <>
      {props.isSignUpVisible
        ? (
          <div className="modalBackground" onClick={() => props.setIsSignUpVisible(false)}>
            <div className="signInWrap" onClick={(e) => e.stopPropagation()}>
            <div className="signInLogo">회원가입</div>
              <div className="signInChoiseWrap">
                <input type="radio" id="perLogin" name="permission" value="person" onChange={controlInput('permission')} />
                <label htmlFor="perLogin" className="permissionPerson">개인회원</label>
                <input type="radio" id="orgLogin" name="permission" value="org" onChange={controlInput('permission')} />
                <label htmlFor="orgLogin" className="permissionOrg">단체회원</label>
              </div>
              <div className="signInInputWrap">
                <div>아이디</div>
                <input type="text" placeholder="아이디" value={signUpInfo.user_id} onChange={controlInput('user_id')} />
                <div>비밀번호</div>
                <input type="password" placeholder="비밀번호" value={signUpInfo.pw} onChange={controlInput('pw')} />
                <div>비밀번호 확인</div>
                <input type="password" placeholder="비밀번호 확인" value={signUpInfo.pw_check} onChange={controlInput('pw_check')} />
                <div>이름</div>
                <input type="text" placeholder="이름" value={signUpInfo.name} onChange={controlInput('name')} />
              </div>
              <div className="errMessage">
                {errorMessage}
              </div>
              <div className="signInbutton">
                <div className="btn" onClick={handleSignUp}>회원가입</div>
              </div>
            </div>
          </div>
          ) : null 
        }
    </>
  )
}

export default SignUp