import React from "react";
import AdvListItem from "./AdvListItem";

type ItemProps = {
    dummy:{
        uuid:string,
        content:{
            location:string,
            org_name:string,
            title:string,
            active_until:string
        },
    }[]
}
const AdvList: React.FC<ItemProps> =  (props:ItemProps) => {
    return(
        
        <div className="advList">
            {console.log(props.dummy)}
            <h2>Adv</h2>
            <table className="advListTable">
                <thead>
                        <th>행사 장소</th>
                        <th>업체 이름</th>
                        <th>공고 제목</th>
                        <th>모집 기한</th>
                        <th>비고</th>
                </thead>
                {props.dummy.map((el)=>{
                    return <AdvListItem uuid={el.uuid} location={el.content.location} org_name={el.content.org_name} title={el.content.title} active_until={el.content.active_until}></AdvListItem>
                           
                })}
            </table>
           
            
            
        
        </div>


    ) 
    
}



export default AdvList;



