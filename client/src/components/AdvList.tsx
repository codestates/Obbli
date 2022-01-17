import React from "react";
import AdvListItem from "./AdvListItem";

const AdvList = ({ adverts }: { adverts: any }) => {
    return(
        <div className="advList">
            <h2>Adv</h2>
            <table className="advListTable">
                <thead>
                        <th>행사 장소</th>
                        <th>업체 이름</th>
                        <th>공고 제목</th>
                        <th>모집 기한</th>
                        <th>비고</th>
                </thead>
                {adverts.map((el: any)=>{
                    return <AdvListItem uuid={el.uuid} location={el.location} org_name={el.org_name} title={el.title} active_until={el.active_until}></AdvListItem>
                })}
            </table>
        </div>
    )
}

export default AdvList;
