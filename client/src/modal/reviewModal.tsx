import { useState, useEffect } from "react"

interface ReviewInfoType {
  rating : number,
  comment : string
}

interface ReviewType {
  isReviewVisible: boolean,
  setIsReviewVisible: React.Dispatch<React.SetStateAction<boolean>>
  data : ReviewInfoType,
  selectMenu: string
}

function ReviewModal(props: ReviewType):JSX.Element {
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

  const handleReview = () => {
    //TODO: axios post
  }

  //TODO: uuid를 받아온다면 fetch

  return (
    <>
      {props.isReviewVisible
        ? isEditing ? (
          <div className="modalBackground" onClick={() => props.setIsReviewVisible(false)}>
            <div className="signInWrap" onClick={(e) => e.stopPropagation()}>
              <div className="signInLogo">리뷰를 남겨보세요!</div>
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
                  <textarea onChange={()=>controlInput('comment')}>{props.data.comment}</textarea>
              </div>
              <div className="reviewBtu">
                <span className="btn" onClick={handleReview}>리뷰남기기</span>
                <span className="btn" onClick={() => setIsEditing(false)}>취소</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="modalBackground" onClick={() => props.setIsReviewVisible(false)}>
            <div className="signInWrap" onClick={(e) => e.stopPropagation()}>
              <div className="signInLogo">리뷰를 남겨보세요!</div>
              <div className="reviewStars">
                <div className="star-ratings-fill" style={style}>
                  <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                </div>
                <div className="star-ratings-base">
                  <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                </div>
              </div>
              <div className="reviewComment">
                {props.data.comment}
              </div>
              <div className="reviewBtu">
                {props.selectMenu !== 'reviewToMe' ? <div className="btn" onClick={()=>setIsEditing(true)}>수정하기</div> : null}
              </div>
            </div>
          </div>
        )
         : null}
    
    </>
  )
}

export default ReviewModal