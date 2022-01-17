import axios from 'axios';
import React, { useEffect, useState } from "react";
import AdvList from "../components/AdvList";
import Filter from "../components/Filter";
import {Link} from "react-router-dom"
import Pagination from "../components/Pagination";

const Advertise: React.FC =  () => {
    const dummy = [
        {
            uuid : "1fa85f64-5717-4562-b3fc-2c963f66afa6",
            location:'서울시 마포구',
            org_name:'앙상블',
            title:'우리 앙상블에서 연주자를 모집합니다!',
            active_until:'2022-01-03',
        },
        {
            uuid : "2fa85f64-5717-4562-b3fc-2c963f66afa6",
            location:'서울시 종로구',
            org_name:'요게',
            title:'요게 되나요??',
            active_until:'2022-01-04',
        },
        {
            uuid : "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            location:'서울시 관악구',
            org_name:'모자르트',
            title:'모자르트 잘 아시는분?!!',
            active_until:'2022-01-05',
        },
        {
            uuid : "4fa85f64-5717-4562-b3fc-2c963f66afa6",
            location:'서울시 서대문구',
            org_name:'베토벤',
            title:'같이 연주해 봅시다!!',
            active_until:'2022-01-06',
        },
        {
            uuid : "5fa85f64-5717-4562-b3fc-2c963f66afa6",
            location:'서울시 영등포구',
            org_name:'차이코프스키',
            title:'여름, 가을, 겨울 쭉 함께해여',
            active_until:'2022-01-07',
        },
        {
            uuid : "6fa85f64-5717-4562-b3fc-2c963f66afa6",
            location:'서울시 마포구',
            org_name:'하모니',
            title:'하모니~~~하모니~~~',
            active_until:'2022-01-03',
        },
        {
            uuid : "6fa85f64-5717-4562-b3fc-2c963f66afa6",
            location:'서울시 마포구',
            org_name:'하모니',
            title:'하모니~~~하모니~~~',
            active_until:'2022-01-03',
        },
        {
            uuid : "6fa85f64-5717-4562-b3fc-2c963f66afa6",
            location:'서울시 마포구',
            org_name:'하모니',
            title:'하모니~~~하모니~~~',
            active_until:'2022-01-03',
        },
        {
            uuid : "6fa85f64-5717-4562-b3fc-2c963f66afa6",
            location:'서울시 마포구',
            org_name:'하모니',
            title:'하모니~~~하모니~~~',
            active_until:'2022-01-03',
        },
        {
            uuid : "6fa85f64-5717-4562-b3fc-2c963f66afa6",
            location:'서울시 마포구',
            org_name:'하모니',
            title:'하모니~~~하모니~~~',
            active_until:'2022-01-03',
        },
        {
            uuid : "6fa85f64-5717-4562-b3fc-2c963f66afa6",
            location:'서울시 마포구',
            org_name:'하모니',
            title:'하모니~~~하모니~~~',
            active_until:'2022-01-03',
        },
    ]
    const [currentPage, setCurrentPage] = useState(1)
    const [postsPerPage, setPostsPerPage] = useState(5)
    const [isAdmin, setIsAdmin] = useState(true);

    const indexOfLast = currentPage * postsPerPage;
    const indexOfFirst = indexOfLast - postsPerPage;

    // let adverts;
    const [adverts, setAdverts] = useState([]);

    useEffect(() => {
      // axios.get('http://api.obb.li/advert')
      axios.get('/advert')
          .then((resp) => { setAdverts(resp.data); });
    }, [])

    // function currentPosts(tmp:{uuid:string,content:{location:string, org_name:string, title:string, active_until:string}}[]) {
    //     let currentPosts:any[] = [];
    //     currentPosts = tmp.slice(indexOfFirst, indexOfLast);
    //     return currentPosts;
    // }


    return(
        <div className="advertise">
            <Filter/>
            {
                dummy.length===0 ? <div>아직 작성된 글이 없습니다.</div> : <AdvList adverts={ adverts }/>
            }

            {
                isAdmin ? <Link to={`/advert/write`}><button className="advwritebtn" type="button">작성하기</button></Link> : null
            }
            <Pagination postsPerPage={postsPerPage} totalPosts={dummy.length} paginate={setCurrentPage}/>
        </div>


    ) 
    
}



export default Advertise;
