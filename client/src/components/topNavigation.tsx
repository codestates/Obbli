import { useNavigate } from 'react-router-dom';

interface UserStateType {
  isSignedIn: boolean,
  accessToken: string,
  uuid: string,
}

interface UseModal {
  setIsSignInVisible: React.Dispatch<React.SetStateAction<boolean>>;
  userState: UserStateType;
  setUserState: React.Dispatch<React.SetStateAction<UserStateType>>
}

function Topnavigation(props: UseModal) {
  const navigate = useNavigate();

  const handleModal = () => {
    props.setIsSignInVisible(true)
  }

  return (
    <div className="headWrapper">
      <img className="logoImg" src={require('../img/logo.png')} onClick={() => navigate('/')} />
      <div className="naviList">
          {props.userState.isSignedIn
          ? (
          <ul className="naviList">
            <li className="naviButtom" onClick={() => navigate('/advList')}>공고보기</li>
            <li className="naviButtom" onClick={() => props.setUserState({...props.userState, isSignedIn:false})}>로그아웃</li>
          </ul>
          ) : (
          <ul className="naviList">
            <li className="naviButtom" onClick={() => navigate('/advList')}>공고보기</li>
            <li className="naviButtom" onClick={handleModal}>로그인</li>
          </ul>
          )}
      </div>
    </div>
  )
}

export default Topnavigation
