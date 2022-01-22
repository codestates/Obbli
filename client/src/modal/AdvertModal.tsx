import { useEffect, useState } from 'react';
import axios from 'axios';

function ReviewsModal({ reviews }) {
  return (
    <div className="reviewSideviewWrap" onClick={e => e.stopPropagation()}>
      <ul>
        {console.log(reviews)}
        { reviews.map(review => 
          <li>
            <span>{ review.rating }</span>
            <span>{ review.comment }</span>
          </li>
        )}
      </ul>
    </div>
  )
  // return reviews.map(review =>
  //   <ul>
  //     <li>
  //       <span>{ review.rating }</span>
  //       <span>{ review.comment }</span>
  //     </li>
  //   </ul>
  // );
}

export default function AdvertModal({ data, setAdvertModalVisibility }) {
  const [reviews, setReviews] = useState([]);
  const [reviewsModalVisibility, setReviewsModalVisibility] = useState(false);
  

  function showReviews(person_uuid) {
    axios.get(`/person/review/${person_uuid}`)
      .then(resp => {
        setReviews(resp.data);
        setReviewsModalVisibility(true);
      });
  }

  function markApplication(person_uuid, position_uuid, state) {
    axios.patch('/application', { person_uuid, position_uuid, state })
  }
  
  return (
    <div className="advertModalBackground " onClick={() => setAdvertModalVisibility(false)}>
      
      { reviewsModalVisibility ? <ReviewsModal reviews={reviews} /> : null}
      
      <div className={reviewsModalVisibility ? 'applicationWrap':'applicationWrap fade'} onClick={e => e.stopPropagation()}>
        { data.map(({uuid, skill_name, person}) => { return (
          <div className="modalcontent">
            <h3>{ skill_name }</h3>  
            <table className='advertmodaltable'>
              <thead>
                  <colgroup>
                  </colgroup>
                  <tr>
                    <td>이름</td>
                    <td>리뷰</td>
                    <td>1차 합격</td>
                    <td>최종 계약</td>
                  </tr>
              </thead>
                { person.map(each => { return (
                  <tr>
                    <td><span>{ each.name }</span></td>
                    {/* <span>{ each.uuid }</span> */}
                    <td><span><button className='advertModalBtn' onClick={() => showReviews(each.uuid)}>리뷰 보기</button></span></td>
                    <td><span><button className='advertModalBtn' onClick={() => markApplication(each.uuid, uuid, 'received')}>연락처 보기</button></span></td>
                    <td><span><button className='advertModalBtn confirm' onClick={() => markApplication(each.uuid, uuid, 'hired')}>계약하기</button></span></td>
                  </tr>
                ); }) }
            </table>
          </div>
        ); })}
      </div>
    </div>
  );
}