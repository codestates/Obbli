import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom"
import axios from 'axios';
import AdvMap from "../components/AdvMap";

interface Advert {
  title: string,
  body: string,
  positions: [
    {
      skill_name: string,
      quota: number,
    }
  ],
  active_until: string,
  location: string,
  org_name: string,
  reviews: [
    {
      rating: number,
      comment: string,
    },
  ],
};

const AdvView : React.FC =  () => {
    const { uuid } = useParams();
    const navigate = useNavigate();
    // TODO: error handling for invalid url
    
    const [advert, setAdvert] = useState({ reviews: [] as unknown, positions:[] as unknown} as Advert);
    
    const [isAdmin, setIsAdmin] = useState(true);

    const onClickDelete = () => {
        axios.delete(`/advert/${uuid}`)
        .then(() => {
          navigate('/advert')
        })
    }
    console.log(advert)
    useEffect(() => {
        axios.get(`/advert/${uuid}`)
            .then((resp) => { setAdvert(resp.data as Advert); });
    }, []);
    return (
        <div className="advView">
            <h1>{ advert.title }</h1>
            {isAdmin ? 
                <div className="advViewbtn">
                    <button type="button" onClick={()=>navigate(`/advert/edit/${uuid}`)}>수정하기</button>
                    <button type="button" onClick={()=>onClickDelete()}>삭제하기</button>
                </div>
                : null}    
            <h3>Content</h3>
            <table className="advViewTable">
                <colgroup>
                    <col className="col1"></col>
                </colgroup>
                <thead>
                    <th>상세 내용</th>
                    <th>모집 기한</th>
                    <th></th>
                </thead>
                    <tr>
                        <td>{ advert.body }</td>
                        <td>{ advert.active_until }</td>
                        <td><button type="button" >지원하기</button></td>
                    </tr>
            </table>
            <table>
                <thead>
                    <th>모집 악기</th>
                    <th>모집 인원</th>
                </thead>
                {advert.positions.map(({skill_name, quota})=>{
                            return (
                                <tr><td>{skill_name}</td><td>{quota}</td></tr>
                            )
                        })}
            </table>
            <h3>Performance place</h3>
            <AdvMap org_address={ advert.location }/>
            <h3>Review</h3>
            <table className="advViewTable">
                <thead>
                    <th>리뷰</th>
                    <th>별점</th>
                </thead>
                        {advert.reviews.map(({ comment, rating }, reviewIndex)=>{
                            return (
                                <tr>
                                    <td>{ comment }</td>
                                    <td>{ rating }</td>
                                </tr>
                            )
                        })}
            </table>
            <h3>Org</h3>
            <table className="advViewTable">
                <thead>
                    <th></th>
                    <th>이름</th>
                    <th>주소</th>
                </thead>
                    <tr>
                        <td>이건 로고</td>
                        <td>{ advert.org_name }</td>
                        <td>{ advert.location }</td>
                    </tr>
            </table>
            <h3>Since</h3>
            <table className="advViewTable">
                <thead>
                    <th>연혁</th>
                </thead>
                <tr><td>{ 'Lorem ipsum dolor sit amet' }</td></tr>
            </table>
            
            
        </div>
    )
}


export default AdvView
