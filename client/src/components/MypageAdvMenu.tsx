function MypageAdvMenu(props: any) {
    
  return (
      <tr>
        <th>{props.org_name}</th>
        <th>{props.skill_name}</th>
        <th>{props.hired_at}</th>
        {props.active_until ? 
        (<th>{props.reviewed_at === null ? <div onClick={() => props.setIsReviewVisible(true)}>작성하기</div> : <div onClick={() => props.setIsReviewVisible(true)}>수정하기</div>}</th>) : 
        (<th>{props.reviewed_at === null ? <div>작성불가</div> : <div>작성완료</div>}</th>) }
      </tr>
  );
}

export default MypageAdvMenu