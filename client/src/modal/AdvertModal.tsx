import { useState } from 'react';
import axios from 'axios';

function ReviewsModal({ reviews }) {
  return (
    <div className="reviewSideviewWrap">
      <ul>
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

export default function AdvertModal({ data }) {
  const [reviews, setReviews] = useState([]);
  const [reviewsModalVisibility, setReviewsModalVisibility] = useState(false);

  function showReviews(person_uuid) {
    axios.get(`/person/review/${person_uuid}`)
      .then(resp => {
        setReviews(resp.data);
        setReviewsModalVisibility(true);
      });
  }

  return (
    <div className="modalBackground">
      { reviewsModalVisibility ? <ReviewsModal reviews={reviews}/> : null}
      <div className="applicationWrap">
        { data.map(({skill_name, person}) => { return (
          <div>
            <h3>{ skill_name }</h3>
            <ul>
              { person.map(each => { return (
                <li>
                  <span>{ each.name }</span>
                  <span>{ each.uuid }</span>
                  <span><button onClick={() => showReviews(each.uuid)}>평가 보기</button></span>
                  <span><button>연락처 보기</button></span>
                  <span><button>계약하기</button></span>
                </li>
              ); }) }
            </ul>
          </div>
        ); })}
      </div>
    </div>
  );
}