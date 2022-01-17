import React, {useState, useEffect} from 'react';
import MypageOrgInfo from '../components/MypageOrgInfo'
import ReviewItem from '../components/ReviewItem'
import ReviewModal from '../modal/ReviewModal';
import MypageAdvMenu from '../components/MypageAdvMenu'
import axios from 'axios'
import { useNavigate } from 'react-router';


interface UserStateType {
  isSignedIn: boolean,
  accessToken: string,
  }

interface MypageInfoType{
  uuid: string,
  name: string,
  description: string,
  since: string,
  headcount: number
}

interface MypageType {
  userState: UserStateType,
  setUserState: React.Dispatch<React.SetStateAction<UserStateType>>
}

interface ReviewInfoType {
  username : string,
  rating : number,
  comment : string
}

function MypageOrg(props:MypageType):JSX.Element {
  const [mypageInfo, setMypageInfo] = useState<MypageInfoType>({
    uuid: '',
    name: '',
    description: '',
    since: '',
    headcount: 0
  })
  const [selectMenu, setSelectMenu] = useState<string>('advOrg')
  const [isReviewVisible, setIsReviewVisible] = useState<boolean>(false)
  const [reviewInfoList, setReviewInfoList] = useState<ReviewInfoType[]>([])
  const [data, setData] = useState({
    rating : 0,
    comment : ''
  })
  const [advertList, setAdvertList] = useState([]);
  const navigate = useNavigate();

  const clickReview = (data:ReviewInfoType) => {
    setData({
      rating: data.rating,
      comment: data.comment
    })
    setIsReviewVisible(true)
  }

  const fetchUserInfo = () => {
    axios.get(`/org`)
    .then(res => {
      setMypageInfo({
        uuid: res.data.uuid,
        name: res.data.name,
        description: res.data.description,
        since: res.data.since,
        headcount: res.data.headcount
      })
    })
  }

  const controlAccount = () => {
    // TODO: axios delete 보내기
    axios.delete(`/org`)
    .then(res=>{
      props.setUserState({...props.userState, isSignedIn:false});
      navigate('/');
    })
  }

  useEffect(() => {
    fetchUserInfo()
  }, [])

    // 메뉴 정보인 selectMenu가 바뀔떄마다 메뉴에 맞게 axios콜 해주기
  useEffect(() => {
    if(selectMenu === 'advOrg'){
      // TODO: 공고에 지원한 지원자 현황
      axios.get(`/advert/{advert_uuid}/application`)
      .then(res => {
        setAdvertList(res.data)
      })
    }else if(selectMenu === 'reviewToMe'){
      axios.get(`/org/review/${mypageInfo.uuid}`)
      .then(res => {
        setReviewInfoList(res.data)
      })
    }else if(selectMenu === 'reviewFromMe'){
      // TODO: 회원이 남긴 리뷰둘 가져오기
      axios.get(`/org/review`)
      .then(res => {
        setReviewInfoList(res.data)
      })
    }
  }, [selectMenu])

  return (
    <>
    {props.userState.isSignedIn
    ? (
      <div className="mypageWrap">
        <ReviewModal {... {isReviewVisible, setIsReviewVisible, data, selectMenu, mypageInfo}} />
        <div className="mypageProfileWrap">
          <div className="mypageProfile">
            <img className="profileImg" src={require('../img/user.png')} />
            <div className="btu" onClick={controlAccount}>탈퇴하기</div>
          </div>
          <div className="mypageHistoryWrap">
            <MypageOrgInfo {...{ mypageInfo, setMypageInfo }} />
          </div>
        </div>
        <div className="mypageMenuWrap">
          <div className="mypageNav">
              <span className="mypageBtu" onClick={() => {setSelectMenu('advOrg')}}>공고</span>
              <span className="mypageBtu" onClick={() => {setSelectMenu('reviewToMe')}}>나에대한리뷰</span>
              <span className="mypageBtu" onClick={() => {setSelectMenu('reviewFromMe')}}>내가쓴리뷰</span>
          </div>
          <div className="mypageMenu">
            {/* 공고 메뉴 + 리뷰 상태(써야하는지 썼는지 수정할지)
                리뷰만 모아서 보기 */
              selectMenu === 'advOrg' ? (
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
                // TODO: 가져온 리뷰를 reviewItem에 하나씩 넘겨줌
                <ul className="reviewList">
                  {reviewInfoList.map((data, key)=>{
                    return (
                    <li onClick={()=>clickReview(data)} key={key}>
                      <ReviewItem  {... {data}} />
                    </li>)
                  })}
                </ul>
              ) : selectMenu === 'reviewFromMe' ? (
                // TODO: 가져온 리뷰를 reviewItem에 하나씩 넘겨줌
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
    ) : (
      <div>
        로그인이 필요합니다!
      </div>
    )}
    </>
  )
}

export default MypageOrg
