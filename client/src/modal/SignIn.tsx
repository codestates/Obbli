import axios from 'axios';
import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom'

import { storeAccessToken } from '../utils';

// interface UserStateType {
//   isSignedIn: boolean,
//   accessToken: string,
//   uuid: string,
// }

// interface LoginModal {
//     isSignInVisible: boolean;
//     setIsSignInVisible: React.Dispatch<React.SetStateAction<boolean>>;
//     setIsSignUpVisible: React.Dispatch<React.SetStateAction<boolean>>;
//     setUserState: React.Dispatch<React.SetStateAction<UserStateType>>
// }

// interface LoginInfo {
//     user_id: string;
//     pw: string;
//     permission: string
// }
const emptyInput = {
  user_id: '',
  pw: '',
  permission: 'person',
};

function SignIn (props: any):JSX.Element {
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState<string>('');
  const [userInput, setUserInput] = useState({ ...emptyInput })

    const controlInput = (key:string) => (e:any) => {
        setUserInput({ ...userInput, [key]: e.target.value });
      };

      const handleLogin = () => {
        const { user_id, pw, permission } = userInput;
        if (!user_id || !pw) {
          setErrorMessage("아이디와 비밀번호를 입력하세요");
          return;
        }
        axios.post(`/${permission}/sign-in`, { user_id, pw })
          .then((resp) => {
            if (resp.status !== 200) {
              setErrorMessage("아이디와 비밀번호를 확인하세요");
              return;
            }
            storeAccessToken(resp.data);
            axios.defaults.headers.common['Authorization'] = `${resp.data.token_type} ${resp.data.access_token}`;
            props.setUserState({ uuid: resp.data.uuid, permission: resp.data.permission });
            props.setIsSignInVisible(false);
            setUserInput({ ...emptyInput });
            navigate('/');
          });
      }

  const changeModal = () => {
    props.setIsSignInVisible(false);
    props.setIsSignUpVisible(true);
  }

  return (
    <>
      { !props.isSignInVisible
        ? null
        : (
          <div className="modalBackground" onClick={() => props.setIsSignInVisible(false)}>
            <div className="signInWrap" onClick={(e) => e.stopPropagation()}>
              <div className="signInLogo">로그인</div>
              <div className="signInChoiseWrap">
                  <input type="radio" id="perLogin" name="permission" value="person" defaultChecked onChange={controlInput('permission')} />
                  <label htmlFor="perLogin" className="permission">개인회원</label>
                  <input type="radio" id="orgLogin" name="permission" value="org" onChange={controlInput('permission')} />
                  <label htmlFor="orgLogin" className="permission">단체회원</label>
              </div>
              <div className="signInInputWrap">
                  <div>아이디</div>
                  <input type="text" placeholder="아이디를 입력하시오" value={userInput.user_id} onChange={controlInput('user_id')} />
                  <div>비밀번호</div>
                  <input type="password" placeholder="비밀번호를 입력하시오" value={userInput.pw} onChange={controlInput('pw')} />
              </div>
              <div className="errMessage">{errorMessage}</div>
              <div className="signInbutton">
                  <div className="btn" onClick={changeModal}>회원가입</div>
                  <div className="btn" onClick={handleLogin}>로그인</div>
              </div>
            </div>
          </div>
        )
      }
    </>
  )
}

export default SignIn
