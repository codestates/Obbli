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

const AdvView = ({ auth }) => {
    const { uuid } = useParams();
    const navigate = useNavigate();
    // TODO: error handling for invalid url
    

    const [advert, setAdvert] = useState({ reviews: [], positions:[]} as any);
    const [position, setPosition] = useState('');
    const [applied, setApplied] = useState(true);

    const onClickDelete = () => {
        axios.delete(`/advert/${uuid}`)
        .then(() => {
          navigate('/advert')
        })
    }

    function apply() {
      if (!position) { return }
      axios.post(`/application/${position}`)
        .then(resp => navigate('/'));
    }

    useEffect(() => {
        axios.get(`/advert/${uuid}`)
            .then((resp) => { setAdvert(resp.data); });
        if (auth?.permission === 'person') {
            axios.get(`/person/applied/${uuid}`)
                .then(resp => setApplied(resp.data.applied));
        }
    }, []);

    return (
        <div className="advView">
            <div>
            <h2>{ advert.title }</h2>
            {console.log(auth)}
            {(auth?.permission === 'org' && auth?.uuid === uuid)
                ? <div className="advViewbtn">
                    <button type="button" onClick={()=>navigate(`/advert/edit/${uuid}`)}>수정하기</button>
                    <button type="button" onClick={()=>onClickDelete()}>삭제하기</button>
                </div>
                : null
            }
            <table className="advViewTable">
                <colgroup>
                    <col className="col1"></col>
                    <col className="col2"></col>
                </colgroup>
                <thead>
                    <th>상세 내용</th>
                    <th>모집 기한</th>
                </thead>
                    <tr className="advViewbtn join">
                        <td>{ advert.body }</td>
                        <td>{ advert.active_until }</td>
                    </tr>
            </table>
            <table className="advViewTable">
                <thead>
                    <th>모집 악기</th>
                    <th>모집 인원</th>
                </thead>
                {advert.positions.map(({uuid, skill_name, quota})=>{
                            return (
                                <tr>
                                    <td>{skill_name}</td>
                                    <td>{quota}</td>
                                    {/* <td>
                                    
                                        <button type="button" onClick={() => apply(uuid)}>지원하기</button>
                                    </td> */}
                                </tr>
                            )
                        })}
                        
            </table>
            <AdvMap location={ advert.location } event_at={advert.event_at}/>
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
            </table >
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
            <table className="advViewTable">
                <thead>
                    <th>연혁</th>
                </thead>
                <tr><td>{ 'Lorem ipsum dolor sit amet' }</td></tr>
            </table>
            </div>
            { applied ? null : 
                <div className="advViewJoin">
                    <div className="advViewJoinSelect">
                        <select onChange={(e) => setPosition(e.target.value)}>
                            <option value="">==지원 부문==</option>
                            {advert.positions.map((el)=>{
                                return <option value={el.uuid}>{el.skill_name}</option>
                            })}
                        </select>
                    </div>
                    <div className="advViewJoinBtn">
                        <button type="button" onClick={apply}>지원하기</button>
                    </div>
                </div>}
            
            
        </div>
    )
}


export default AdvView


