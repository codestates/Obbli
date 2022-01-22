import axios from "axios";
import { useState, useEffect } from "react"

interface ReviewInfoType {
  rating : number,
  comment : string
}

interface MypageInfoType{
  uuid: string,
  name: string,
  professional?: boolean,
  skill?: string,
  history?: string,
  description?: string,
  since?: string,
  headcount?: number
}

interface ReviewType {
  isReviewVisible: boolean,
  setIsReviewVisible: React.Dispatch<React.SetStateAction<boolean>>
  data : ReviewInfoType,
  selectMenu: string,
  mypageInfo: MypageInfoType
}

function ReviewModal(props):JSX.Element {
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [reviewInfo, setReviewInfo] = useState({
    rating:props.data.rating,
    comment:props.data.comment
  })

  const controlInput = (key:string) => (e:any) => {
    setReviewInfo({ ...reviewInfo, [key]: e.target.value });
  };
  
  const style = {
    width: `${24.5*props.data.rating}px`
  }

  const styleModal = {
    width: `${38.5*props.data.rating}px`
  }

  const handleReview = () => {
    //TODO: axios post
    if(!reviewInfo.rating && !reviewInfo.comment){
      alert('별점 혹은 내용을 작성해주세요!')
      return;
    }
    else{
      console.log(props)
      const key = `${props.target}_uuid`
      axios.patch(`/${props.target}/review/${props.data[key]}`, {
        rating: reviewInfo.rating,
        comment: reviewInfo.comment,
      },{
        headers:{
        authorization:`Barer ${props.token}`
      }})
      .then(res => {
        props.setIsReviewVisible(false)
      })
      .catch(err => console.log(err))
    }
  }

  const onClickDeleteRiview = () => {
    const key = `${props.target}_uuid`
   
      axios.delete(`/${props.target}/review/${props.data[key]}`)
      .then(res => {
        props.setIsReviewVisible(false)
      })
      .catch(err => console.log(err))
    
  }
  
  return (
    <>
      {props.isReviewVisible
        ? isEditing ? (
          <div className="modalBackground" onClick={() => props.setIsReviewVisible(false)}>
            <div className="reviewWrap" onClick={(e) => e.stopPropagation()}>
              <h2 className="reviewLogo">리뷰를 남겨보세요!</h2>
              <div className="star-rating">
                <input type="radio" id="5-stars" name="rating" value='5' v-model="ratings" onChange={controlInput('rating')} />
                <label htmlFor="5-stars" className="star">★</label>
                <input type="radio" id="4-stars" name="rating" value='4' v-model="ratings" onChange={controlInput('rating')} />
                <label htmlFor="4-stars" className="star">★</label>
                <input type="radio" id="3-stars" name="rating" value='3' v-model="ratings" onChange={controlInput('rating')} />
                <label htmlFor="3-stars" className="star">★</label>
                <input type="radio" id="2-stars" name="rating" value='2' v-model="ratings" onChange={controlInput('rating')} />
                <label htmlFor="2-stars" className="star">★</label>
                <input type="radio" id="1-star" name="rating" value='1' v-model="ratings" onChange={controlInput('rating')} />
                <label htmlFor="1-star" className="star">★</label>
              </div>
              <div className="comentWrap">
                  <textarea className="reviewModalText" onChange={controlInput('comment')}>{props.data.comment}</textarea>
              </div>
              <div className="reviewBtu">
                <button type='button' className="reviewModalBtn" onClick={handleReview}>리뷰남기기</button>
                <button type='button' className="reviewModalBtn" onClick={() => setIsEditing(false)}>취소</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="modalBackground" onClick={() => props.setIsReviewVisible(false)}>
            <div className="reviewWrap" onClick={(e) => e.stopPropagation()}>
              <h2 className="reviewLogo">리뷰를 남겨보세요!</h2>
              <div className="reviewStarsModal">
                <div className="star-ratings-fill-modal" style={styleModal}>
                  <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                </div>
                <div className="star-ratings-base-modal">
                  <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                </div>
              </div>
              <div className="reviewModalComment">
                {props.data.comment}
              </div>
              <div>
                {props.selectMenu !== 'reviewToMe' ?
                <div className="reviewBtu">
                  <button type='button' className="reviewModalBtn" onClick={()=>setIsEditing(true)}>수정하기</button>
                  <button type='button' className="reviewModalBtn" onClick={onClickDeleteRiview} >삭제하기</button>
                </div> : null}
              </div>
            </div>
          </div>
        )
         : null}
    </>
  )
}

export default ReviewModal
