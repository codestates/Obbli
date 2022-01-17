import axios from 'axios';
import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router';
import MypageHistory from '../components/MypageHistory'
import ReviewItem from '../components/ReviewItem'
import ReviewModal from '../modal/ReviewModal';
import MypageAdvMenu from '../components/MypageAdvMenu'


interface UserStateType {
  isSignedIn: boolean,
  accessToken: string,
}

interface MypageInfoType{
  uuid: string,
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
    uuid: '',
    name: '',
    professional: false,
    skill: '',
    history: ``
  })
  const [selectMenu, setSelectMenu] = useState<string>('advPerson')
  const [isReviewVisible, setIsReviewVisible] = useState<boolean>(false)
  const [reviewInfoList, setReviewInfoList] = useState<ReviewInfoType[]>([])
  const [data, setData] = useState({
    rating : 0,
    comment : ''
  })
  const [advertList, setAdvertList] = useState<any>([]);
  const navigate = useNavigate();

  const fetchUserInfo = () => {
    axios.get(`/person`)
    .then(res => {
      setMypageInfo({
        uuid: res.data.uuid,
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
    axios.delete(`/person`)
    .then(res=>{
      props.setUserState({...props.userState, isSignedIn:false});
      navigate('/');
    })
  }

  useEffect(() => {
    fetchUserInfo()
  }, [])

  // 메뉴 정보인 selectMenu가 바뀔떄마다 메뉴에 맞게 axios콜 해주기
  // 모든 리뷰를 가져온뒤 uuid_person이 같은거만 나타냄
  useEffect(() => {
    if(selectMenu === 'advPerson'){
      // TODO: 회원이 지원한 공고 가져오기
      axios.get('/person/application')
      .then(res => {
        setAdvertList(res.data)
      })
    }else if(selectMenu === 'reviewToMe'){
      axios.get(`/person/review/${mypageInfo.uuid}`)
      .then(res => {
        setReviewInfoList(res.data)
      })
    }else if(selectMenu === 'reviewFromMe'){
      // TODO: 회원이 남긴 리뷰둘 가져오기
      axios.get(`/person/review`)
      .then(res => {
        setReviewInfoList(res.data)
      })
    }
  }, [selectMenu])

  return (
    <>
    {true
    ? (
      <div className="mypageWrap">
        <ReviewModal {... {isReviewVisible, setIsReviewVisible, data, selectMenu, mypageInfo}} />
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
              <span className="mypageBtu" onClick={() => {setSelectMenu('advPerson')}}>공고</span>
              <span className="mypageBtu" onClick={() => {setSelectMenu('reviewToMe')}}>나에대한리뷰</span>
              <span className="mypageBtu" onClick={() => {setSelectMenu('reviewFromMe')}}>내가쓴리뷰</span>
          </div>
          <div className="mypageMenu">
            {selectMenu === 'advPerson' ? (
              <div>
                {/* 가져온 공고를 MypageAdvMenu 컴포넌트에 전송 */}
                <table className="advListTable">
                  <thead>
                    <th>업체 이름</th>
                    <th>지원 악기</th>
                    <th>합격 여부</th>
                    <th>리뷰</th>
                  </thead>
                  {advertList.map((el: any) => {
                    return <MypageAdvMenu {... {el, setIsReviewVisible}}></MypageAdvMenu>
                  })}
                </table>
              </div>
             ) : selectMenu === 'reviewToMe' ? (
              // TODO: 가져온 리뷰를 연결
              <ul className="reviewList">
                {reviewInfoList.map((data, key)=>{
                  return (
                  <li onClick={()=>clickReview(data)} key={key}>
                    <div>{data.username}이 남긴 리뷰</div>
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
