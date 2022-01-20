import axios from 'axios';
import React, { useEffect, useState } from "react";
import AdvList from "../components/AdvList";
import Filter from "../components/Filter";
import {Link} from "react-router-dom"
import Pagination from "../components/Pagination";

const Advertise: React.FC =  () => {
    const [isAdmin, setIsAdmin] = useState(true);
    const [adverts, setAdverts] = useState([]);

    useEffect(() => {
      axios.get('/advert')
          .then((resp) => { setAdverts(resp.data) });
    }, [])

    return(
        <div className="advertise">
            <Filter/>
            { adverts.length === 0
              ? <div>아직 작성된 글이 없습니다.</div>
              : <AdvList adverts={ adverts }/>
            }
            <div className="writeButtonArray">
                { isAdmin
                  ? <Link to={`/advert/write`}><button className="advwritebtn" type="button">작성하기</button></Link>
                  : null
                }
            </div>
        </div>
    )
}

export default Advertise;
