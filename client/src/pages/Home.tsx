import { useNavigate } from 'react-router-dom';

interface UserStateType {
  isSignedIn: boolean,
  accessToken: string
}

interface UseModal {
  setIsSignInVisible: React.Dispatch<React.SetStateAction<boolean>>;
  userState: UserStateType;
  setUserState: React.Dispatch<React.SetStateAction<UserStateType>>;
  setIsSignUpVisible:React.Dispatch<React.SetStateAction<boolean>>;
}

function Home(props:UseModal) {
const navigate = useNavigate();

  return(
    <div className="homeBody">
      <img className="homeLogoImg" src={require('../img/logo.png')} onClick={() => navigate('/')} />
      <div className="homeWrap">
        <div className="buttonWrap">
        { props.userState ? (
          <div className="logButtonWrap">
            <div className="homeBtu hoverBtu" onClick={()=>navigate('/mypage')}>마이페이지</div>
            <div className="homeBtu hoverBtu">로그아웃</div>
          </div>
        ) : (
          <div className="logButtonWrap">
            <div className="homeBtu hoverBtu" onClick={()=>props.setIsSignInVisible(true)}>로그인</div>
            <div className="homeBtu hoverBtu" onClick={()=>props.setIsSignUpVisible(true)}>회원가입</div>
          </div>
        )
        }
          <div className="advButtonWrap">
            <div className="advBtu hoverAdvBtu" onClick={()=>navigate('/advert')}>공고 보러 가기</div>
            <div className="advBtu hoverAdvBtu" onClick={()=>navigate('/filter')}>지도에서 공고 보기</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
