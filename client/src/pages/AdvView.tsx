import React, { useState } from "react";
import {Link} from "react-router-dom"
import AdvMap from "../components/AdvMap";

const AdvView : React.FC =  () => {
    const [advInfo, setAdvInfo] = useState({
        uuid:'',
        content:{
            org_name:'Ensemble',
            org_address:'서울시 예술의전당',
            org_contact:'test_12-456-7894',
            org_since:['2021년 1월 앙상블 창단', '2021년 4월 제 1회 봄 연주회', '2021년 9월 제 1회 가을 정기 연주회', '2021년 12월 제 1회 겨울 연주회'],
            adv_title:`우리 앙상블에서는 단기 연주생을 모집합니다! `,
            adv_content:`모집 분야는 바이올린 입니다! 모집인원은 1명 입니당. 
            여러분의 많은 지원 바랍니다! 
            감사합니다.!
            @#$ㄴㅇ리ㅏㅁ너이라ㅓㅁㄴ이ㅏ러민아ㅓㄹㄴㅇㅁㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹ`,
            adv_created_at:'2021-01-10',
            org_review_comment:['여기는 음악 맛집 입니다!','밥이 맛있어요!', '정말 맛있어요!!!'],
            org_review_rating:['★★★★★','★★★','★★★★'],
            position_name:'Violine',
            position_number:'2명'
        }
    })
    const [isAdmin, setIsAdmin] = useState(true);

    return (
        <div className="advView">
            {isAdmin ? <Link to={`/advert/write`}><button className="advwritebtn" type="button">수정하기</button></Link>  : null}    
            <h1>{advInfo.content.adv_title}</h1>
            <h3>Content</h3>
            <table className="advViewTable">
                <colgroup>
                    <col className="col1"></col>
                </colgroup>
                <thead>
                    <th>상세 내용</th>
                    <th>모집 악기</th>
                    <th>모집 인원</th>
                    <th>모집 기한</th>
                </thead>
                    <tr>
                        <td>{advInfo.content.adv_content}</td>
                        <td>{advInfo.content.position_name}</td>
                        <td>{advInfo.content.position_number}</td>
                        <td>{advInfo.content.adv_created_at}</td>
                        <td><button type="button" className="btn">지원하기</button></td>
                    </tr>
            </table>
            <h3>Performance place</h3>
            <AdvMap org_address={advInfo.content.org_address}/>
            
            <h3>Review</h3>
            <table className="advViewTable">
                <thead>
                    <th>리뷰</th>
                    <th>별점</th>
                </thead>
                        {advInfo.content.org_review_comment.map((el, reviewIndex)=>{
                           return advInfo.content.org_review_rating.map((rating, ratingIndex) => {
                                if(reviewIndex===ratingIndex){
                                    return (
                                        <tr>
                                            <td>{el}</td>
                                            <td>{rating}</td>
                                        </tr>
                                    )
                                        
                                }else{
                                    return
                                }    
                                
                            })
                        })}
            </table>
            <h3>Org</h3>
            <table className="advViewTable">
                <thead>
                    <th></th>
                    <th>이름</th>
                    <th>주소</th>
                    <th>연락처</th>
                </thead>
                    <tr>
                        <td>이건 로고</td>
                        <td>{advInfo.content.org_name}</td>
                        <td>{advInfo.content.org_address}</td>
                        <td>{advInfo.content.org_contact}</td>
                    </tr>
            </table>
            <h3>Since</h3>
            <table className="advViewTable">
                <thead>
                    <th>연혁</th>
                </thead>
                    {advInfo.content.org_since.map((el)=>{
                        return <tr><td>{el}</td> </tr>
                    })}
                    
            </table>
            
                
                    
                
            
            

        </div>
    )

}


export default AdvView