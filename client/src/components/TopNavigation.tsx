import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function TopNavigation({ auth, setIsSignInVisible, signOut }) {
  const navigate = useNavigate();

  const handleModal = () => {
    setIsSignInVisible(true)
  }

  return (
    <div className="headWrapper">
      <img className="logoImg" src={require('../img/logo.png')} onClick={() => navigate('/')} />
      <div className="naviList">
        <ul className="naviList">
        <li className="naviButtom" onClick={() => navigate('/filter')}>지도로보기</li>
          <li className="naviButtom" onClick={() => navigate('/advert')}>공고보기</li>
          { auth
            ? <>
                <li className="naviButtom" onClick={() => navigate(`/mypage/${auth.permission}`)}>마이페이지</li>
                <li className="naviButtom" onClick={signOut}>로그아웃</li>
              </>
            : <li className="naviButtom" onClick={handleModal}>로그인</li>
          }
        </ul>
      </div>
    </div>
  )
}

export default TopNavigation
