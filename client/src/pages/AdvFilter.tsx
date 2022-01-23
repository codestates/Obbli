import axios from 'axios';
import React, { useEffect, useState } from "react";
import AdvList from "../components/AdvList";
import Filter from "../components/Filter";
import { Link } from "react-router-dom"
import Pagination from "../components/Pagination";
import AdvMapFilter from '../components/AdvMapfilter';

const AdvFilter: React.FC =  () => {
    
    const [isAdmin, setIsAdmin] = useState(true);

    // let adverts;
    const [adverts, setAdverts] = useState([]);

    useEffect(() => {
      // axios.get('http://api.obb.li/advert')
      axios.get('/advert')
          .then((resp) => { 
              const result = resp.data.map((el: any)=>{
                return {...el, visible:false}
              })
              setAdverts(result) });
    }, [])
    
    return(
        <div className="advMapFilter">
            {
                adverts.length===0 ? <div>아직 작성된 글이 없습니다.</div> : <AdvMapFilter adverts={ adverts } setAdverts={setAdverts}/>
            }
            {
                isAdmin ? <Link to={`/advert/write`}><button className="advfilterwritebtn" type="button">작성하기</button></Link> : null
            }
            
        </div>


    ) 
    
}



export default AdvFilter;
