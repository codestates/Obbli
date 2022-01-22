

export default function ReviewsModal({ reviews }) {
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