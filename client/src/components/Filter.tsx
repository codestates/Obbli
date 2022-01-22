import React from "react";


const Filter: React.FC =  () => {
    return(
        <div className="filter">
            <div className="selectBoard">
                <div className="selectEle">
                    <span>지역</span>
                    <select name="region" >
                        <option value="none" selected>===선택===</option>
                        <option value="seoul" >서울</option>
                        <option value="daejeon">대전</option>
                        <option value="daegu">대구</option>
                        <option value="busan">부산</option>
                    </select>
                </div>
                <div className="selectEle">
                    <span>악기</span>
                    <select name="instrument" >
                        <option value="none" selected>===선택===</option>
                        <option value="violin" >바이올린</option>
                        <option value="viola">비올라</option>
                        <option value="cello">첼로</option>
                        <option value="flute">플룻</option>
                    </select>
                </div> 
                <div className="selectEle">
                    <span>공연기간</span>
                    <select name="instrument" >
                        <option value="none" selected>===선택===</option>
                        <option value="day" >하루</option>
                        <option value="week">일주일</option>
                        <option value="month">한달</option>
                        <option value="months">한달이상</option>
                    </select>
                </div>
                <div className="selectEle">
                    <span>공연시간</span>
                    <select name="instrument" >
                        <option value="none" selected>===선택===</option>
                        <option value="morning" >오전</option>
                        <option value="afternoon">오후</option>
                        <option value="dinner">저녁</option>
                    </select>
            </div>
            </div>
                <div className="searchBar">
                <input type="text" placeholder="Insert text here"/>
                <button className="searchBtn" type="button">검색</button>
                </div>
        </div>


    ) 
    
}



export default Filter;



