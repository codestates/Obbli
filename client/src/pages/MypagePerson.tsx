import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MypageHistory from '../components/MypageHistory'
import ReviewItem from '../components/ReviewItem'
import ReviewModal from '../modal/ReviewModal';
import axios from 'axios';

const listData = [
  {
    key : 1,
    username : '김코딩',
    rating : 4,
    comment : "K-오케스트라 여윽시 최고다, 역시 이런 무대를 설수 있다니"
  },
  {
    key : 2,
    username : '나코딩',
    rating : 4,
    comment : "역시 K-오케스트라 여윽시 최고다, 이런 무대를 설수 있다니"
  },
  {
    key : 3,
    username : '박코딩',
    rating : 4,
    comment : "아무리 그래도 K-오케스트라 여윽시 최고다, 이런 무대를 설수 있다니"
  },
  {
    key : 4,
    username : '이코딩',
    rating : 4,
    comment : "역시는 역시 K-오케스트라 여윽시 최고다, 이런 무대를 설수 있다니"
  }
]

function MypagePerson(props: any):JSX.Element {
  const navigate = useNavigate();
  if (!props.userState) { navigate('/') }
  const [mypageInfo, setMypageInfo] = useState({});
  const [selectMenu, setSelectMenu] = useState<string>('adv')
  const [isReviewVisible, setIsReviewVisible] = useState<boolean>(false)
  const [reviewInfoList, setReviewInfoList] = useState([] as any[])
  const [data, setData] = useState({
    rating : 0,
    comment : ''
  })

  const clickReview = (data: any) => {
    setData({
      rating: data.rating,
      comment: data.comment
    })
    setIsReviewVisible(true)
  }

  const controlAccount = () => {
    // TODO: axios delete 보내기
  }

    // TODO: axios get 공고 및 리뷰 가져오기

  useEffect(() => {
    console.log(axios.defaults.headers.common);
    axios.get('/person').then(resp => setMypageInfo(resp.data));
  }, [])

  return (
    <>
    {
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
                <div>advadv</div>
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
    }
    </>
  )
}

export default MypagePerson
