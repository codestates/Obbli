import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MypageHistory from '../components/MypageHistory'
import ReviewItem from '../components/ReviewItem'
import ReviewModal from '../modal/ReviewModal';
import NewReviewModal from '../modal/NewReviewModal';
import axios from 'axios';

function MypagePerson(props: any):JSX.Element {
  const navigate = useNavigate();
  if (!props.auth) { navigate('/') }
  const placeHolder = <p>내용이 없습니다</p>;
  const [data, setData] = useState({
    Application: [],
    Person_review: [],
    Org_review: [],
  } as any);
  const [selectMenu, setSelectMenu] = useState<string>('adv');
  const [isReviewVisible, setIsReviewVisible] = useState<boolean>(false);
  const [reviewModalData, setReviewModalData] = useState(null as any);
  const [reviewModalVisibility, setReviewModalVilibility] = useState(false);
  const [newReviewTarget, setNewReviewTarget] = useState(null as any);
  const [file,setFile] =useState('')
  const clickReview = (data: any) => {
    setReviewModalData({
      rating: data.rating,
      comment: data.comment
    })
    setIsReviewVisible(true)
  }

  const unregister = () => {
    // TODO: axios delete 보내기
  }

  function getApplicationStatus({ received_at, hired_at }) {
    if (hired_at) { return 'hired'; }
    if (received_at) { return 'received'; }
    return 'pending';
  }

  console.log(props)
  
  useEffect(() => {
    axios.get('/person').then(resp => {
      setData(resp.data);
    });
  }, []);

  const [imageURL, setImageURL] = useState(`https://obbli-image.s3.ap-northeast-2.amazonaws.com/${props.auth.uuid}`);

  const upload = async (event) => {
    event.preventDefault()
    await saveImage(file)
  }

  const settingFile = (event) => {
    const file = event.target.files[0]
    setFile(file)
  }

  const saveImage = async (file) => {
    const formData = new FormData();
  formData.append("image",file)

  await axios.post('/image', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
  }


  return (
    <div className="mypageWrap">
      { reviewModalData ? <ReviewModal {... {isReviewVisible, setIsReviewVisible, data: reviewModalData, selectMenu}} /> : null }
      { newReviewTarget ? <NewReviewModal {...{ target: newReviewTarget, setNewReviewTarget }}/> : null }

      <div className="mypageProfileWrap">
        <div className="mypageProfile">
          <img className="profileImg" alt="" src={imageURL} onError={() => setImageURL(require('../img/user.png'))} />
          <form onSubmit={upload} encType="multipart/form-data">
            <input onChange={settingFile} type="file" accept="image/*" />
            <button type="submit" >사진 업로드하기</button>
          </form>
        </div>
        <div className="mypageHistoryWrap">
          { data ? <MypageHistory {...{ data }}  /> : null }
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
              <table>
                <thead>
                  <tr>
                    <td>단체명</td>
                    <td>부문</td>
                    <td>모집기한</td>
                    <td>상태</td>
                    <td></td>
                  </tr>
                </thead>
                {data.Application.map(each =>
                <tr>
                  <td>{ each.org_name }</td>
                  <td>{ each.skill_name }</td>
                  <td>{ each.active_until }</td>
                  <td>{ getApplicationStatus(each) }</td>
                  <td>{ each.reviewed
                    ? null
                    : <button onClick={ () => setNewReviewTarget({ type: 'org', uuid: each.org_uuid, name: each.org_name }) }>리뷰 작성하기</button>
                  }</td>
                </tr>
              )}
              </table>
            ) : selectMenu === 'reviewToMe' ? (
              // TODO: 가져온 리뷰를 연결
              <ul className="reviewList">
                {data.Person_review.map((review, key)=>{
                  return (
                  <li onClick={()=>clickReview(review)} key={key}>
                    <ReviewItem  data={review} />
                  </li>)
                })}
              </ul>
            ) : selectMenu === 'reviewFromMe' ? (
              <ul className="reviewList">
                {data.Org_review.map((review, key)=>{
                  return (
                  <li onClick={()=>clickReview(review)} key={key}>
                    <ReviewItem  data={review} />
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

export default MypagePerson
