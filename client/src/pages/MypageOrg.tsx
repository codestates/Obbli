import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MypageOrgInfo from '../components/MypageOrgInfo'
import ReviewItem from '../components/ReviewItem'
import ReviewModal from '../modal/ReviewModal';
import AdvertModal from '../modal/AdvertModal';
import axios from 'axios';

function MypageOrg(props) {
  const navigate = useNavigate();
  const [data, setData] = useState({
    Advert: [],
    Org_review: [],
    Person_review: [],
  } as any);
  const [selectMenu, setSelectMenu] = useState<string>('adv');
  const [isReviewVisible, setIsReviewVisible] = useState<boolean>(false);
  const [reviewModalData, setReviewModalData] = useState(null as any);
  const [advertModalVisibility, setAdvertModalVisibility] = useState(false);
  const [advertModalData, setAdvertModalData] = useState();

  const clickReview = (data: any) => {
    setReviewModalData({
      rating: data.rating,
      comment: data.comment
    })
    setIsReviewVisible(true)
  }
  const controlAccount = () => {
    // TODO: axios delete 보내기
  }

    // TODO: axios get 공고 및 리뷰 가져오기

  function popAdvertModal(uuid) {
    axios.get(`/org/advert/${uuid}`)
      .then(resp => {
        setAdvertModalData(resp.data);
        setAdvertModalVisibility(true);
      })
      .catch(() => {})
  }

  useEffect(() => {
    if (!props.auth) { navigate('/'); }
    axios.get('/org').then(resp => { setData(resp.data); });
  }, [])

  return (
    <div className="mypageWrap">
      { advertModalVisibility ? <AdvertModal {...{ data: advertModalData, setAdvertModalVisibility }}/> : null }
      { reviewModalData ? <ReviewModal {... {isReviewVisible, setIsReviewVisible, data: reviewModalData, selectMenu}} /> : null }
      <div className="mypageProfileWrap">
        <div className="mypageProfile">
          <img className="profileImg" src={require('../img/user.png')} />
        </div>
        <div className="mypageHistoryWrap">
          { data ? <MypageOrgInfo {...{ data }} /> : null }
        </div>
      </div>
      <div className="mypageMenuWrap">
        <div className="mypageNav">
          <input type="radio" id="advView" name="mypageTab" value="adv" defaultChecked onChange={() => {setSelectMenu('adv')}} />
          <label htmlFor="advView" className="mypageTab">공고보기</label>
          <input type="radio" id="reviewToMe" name="mypageTab" value="reviewToMe" onChange={() => setSelectMenu('reviewToMe')} />
          <label htmlFor="reviewToMe" className="mypageTab">나에대한리뷰</label>
          <input type="radio" id="reviewFromMe" name="mypageTab" value="reviewFromMe" onChange={() => {setSelectMenu('reviewFromMe')}} />
          <label htmlFor="reviewFromMe" className="mypageTab">내가쓴리뷰</label>
        </div>
        <div className="mypageMenu">
          { selectMenu === 'adv' ? (
            <div className='mypagetablewrab'>
              <table className='mypagetable'>
                <thead>
                  <tr>
                    <td>공연 일자</td>
                    <td>모집 기한</td>
                    <td>공고 제목</td>
                  </tr>
                </thead>
                { data.Advert.map(advert => { return (
                    <tr onClick={() => popAdvertModal(advert.uuid)} >
                      <td>{advert.event_at}</td>
                      <td>{advert.active_until}</td>
                      <td>{advert.title}</td>
                    </tr>
                  ); })
                }
              </table>
            </div>
            ) : selectMenu === 'reviewToMe' ? (
            <ul className="reviewList">
              {data.Org_review.map((data, key)=>{
                return (
                <li onClick={()=>clickReview(data)} key={key}>
                  <ReviewItem  {... {data}} />
                </li>)
              })}
            </ul>
            ) : selectMenu === 'reviewFromMe' ? (
            <ul className="reviewList">
              {data.Person_review.map((data, key)=>{
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
  )
}

export default MypageOrg
