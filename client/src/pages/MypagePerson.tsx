import axios from 'axios';
import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router';
import MypageHistory from '../components/MypageHistory'
import ReviewItem from '../components/ReviewItem'
import ReviewModal from '../modal/ReviewModal';
import AdvListItem from "../components/AdvListItem";


interface UserStateType {
    isSignedIn: boolean,
    accessToken: string,
}

interface MypageInfoType{
    name: string,
    professional: boolean,
    skill: string,
    history: string
}

interface MypageType {
  userState: UserStateType,
  setUserState: React.Dispatch<React.SetStateAction<UserStateType>>
}

interface ReviewInfoType {
  key : number,
  username : string,
  rating : number,
  comment : string
}

function MypagePerson(props:MypageType):JSX.Element {
  const [mypageInfo, setMypageInfo] = useState<MypageInfoType>({
    name: '',
    professional: false,
    skill: '',
    history: ``
  })
  const [selectMenu, setSelectMenu] = useState<string>('adv')
  const [isReviewVisible, setIsReviewVisible] = useState<boolean>(false)
  const [reviewInfoList, setReviewInfoList] = useState<ReviewInfoType[]>([])
  const [data, setData] = useState({
    rating : 0,
    comment : ''
  })
  const [adverts, setAdverts] = useState([]);
  const navigate = useNavigate();

  const fetchUserInfo = () => {
    axios.get(`/person`)
    .then(res => {
      setMypageInfo({
        name: res.data.name,
        professional: res.data.professional,
        skill: res.data.skill,
        history: res.data.history
      })
    })
  }

  const clickReview = (data:ReviewInfoType) => {
    setData({
      rating: data.rating,
      comment: data.comment
    })
    setIsReviewVisible(true)
  }

  const controlAccount = () => {
    // TODO: axios delete 보내기
    axios.delete(`/person`)
    .then(res=>{
      props.setUserState({...props.userState, isSignedIn:false});
      navigate('/');
    })
  }
    // TODO: axios get 공고 및 리뷰 가져오기

  useEffect(() => {
    fetchUserInfo()
  }, [])

  return (
    <>
    {props.userState.isSignedIn
    ? (
      <div className="mypageWrap">
        <ReviewModal {... {isReviewVisible, setIsReviewVisible, data, selectMenu}} />
        <div className="mypageProfileWrap">
          <div className="mypageProfile">
            <img className="profileImg" src={require('../img/user.png')} />
            <div className="btu" onClick={controlAccount}>탈퇴하기</div>
          </div>
          <div className="mypageHistoryWrap">
            <MypageHistory {...{ mypageInfo, setMypageInfo }} />
          </div>
        </div>
        <div className="mypageMenuWrap">
          <div className="mypageNav">
              <span className="mypageBtu" onClick={() => {setSelectMenu('adv')}}>공고</span>
              <span className="mypageBtu" onClick={() => {setSelectMenu('reviewToMe')}}>나에대한리뷰</span>
              <span className="mypageBtu" onClick={() => {setSelectMenu('reviewFromMe')}}>내가쓴리뷰</span>
          </div>
          <div className="mypageMenu">
            {/* 공고 메뉴 + 리뷰 상태(써야하는지 썼는지 수정할지)
                리뷰만 모아서 보기 */
              selectMenu === 'adv' ? (
                <div className = "advertListWarp">
                    <table className="advListTable">
                <thead>
                        <th>행사 장소</th>
                        <th>업체 이름</th>
                        <th>공고 제목</th>
                        <th>모집 기한</th>
                        <th>비고</th>
                </thead>
                {adverts.map((el: any)=>{
                    return <AdvListItem uuid={el.uuid} location={el.location} org_name={el.org_name} title={el.title} active_until={el.active_until}></AdvListItem>
                })}
            </table>
                </div>
              ) : selectMenu === 'reviewToMe' ? (
                // TODO: 가져온 리뷰를 연결
                <ul className="reviewList">
                  {reviewInfoList.map((data, key)=>{
                    return (
                    <li onClick={()=>clickReview(data)} key={key}>
                      <ReviewItem  {... {data}} />
                    </li>)
                  })}
                </ul>
              ) : selectMenu === 'reviewFromMe' ? (
                // TODO: 가겨온 리뷰를 연결
                <ul className="reviewList">
                  {reviewInfoList.map((data, key)=>{
                    return (
                    <li onClick={()=>clickReview(data)} key={key}>
                      <ReviewItem  {... {data}} />
                    </li>)
                  })}
                </ul>
              ) : null
              }
          </div>
        </div>
      </div>
    ) : 
      <div>
          로그인이 필요합니다!
      </div>
    }
    </>
  )
}

export default MypagePerson
