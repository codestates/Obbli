import React, { useState } from 'react';

interface ReviewInfoType {
  username : string,
  rating : number,
  comment : string
}

interface propsType {
  data : ReviewInfoType
}

function ReviewItem(props): JSX.Element{

  // TODO: props로 받아온 데이터로 리뷰 나타내기

  const style = {
    width: `${24.5*props.data.rating}px`
  }

  return (
  <>
    <div className="reviewItemWrap">
      <div className="reviewStars">
        <div className="star-ratings-fill" style={style}>
          <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
        </div>
        <div className="star-ratings-base">
          <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
        </div>
      </div>
        <div className="userName">
          {props.data.username}
        </div>
        <div className="reviewComment">
          {props.data.comment.length > 10 ? 
          <div> 
            {props.data.comment.substring(0,10)}...
              <br />
            <div className="showMore">더보기..</div>
          </div> : props.data.comment}
        </div>
    </div>
  </>
  )
}

export default ReviewItem