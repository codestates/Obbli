import React, { useState } from "react";


const AdvertiseWrite: React.FC =  () => {
    

    const [userInput, setUserInput] = useState({
        
        place:'',
        instrument:'',
        number:'',
        date:'',
        title:'',
        content:'',
        
    })

    const controlInputValue = (e:any, key:string) => {
        setUserInput({...userInput, [key]:e.target.value})
    }



    return(
        <div className="advertiseWrite">
            <h3>Write</h3>
            <table className="advWriteTable">
                <thead>
                    <tr>
                        <th>공고 제목</th>
                        
                    </tr>
                    
                </thead>
                    <tr>
                        <td><input value={userInput.title} onChange={(e)=>{controlInputValue(e, 'title')}}></input></td>
                    </tr>
            </table>
            <table className="advWriteTable">
                <thead>
                    <tr>
                        <th>공고 상세 내용</th>
                    </tr>        
                </thead>
                    <tr>
                        <td><textarea value={userInput.content} onChange={(e)=>{controlInputValue(e, 'content')}}></textarea></td>
                    </tr>
            </table>
            <table className="advWriteTable">
                <thead>
                    <tr>
                        <th>공연 장소</th>
                        <th>모집 악기</th>
                        <th>모집 인원</th>
                        <th>모집 기한</th>
                    </tr>
                </thead>
                    <tr>
                        <th><input type="text" value={userInput.place} onChange={(e)=>{controlInputValue(e, 'place')}}></input></th>
                        <th>
                            <select value={userInput.instrument} onChange={(e)=>{controlInputValue(e, 'instrument')}}>
                                <option value="none" selected>===선택===</option>
                                <option value="violin" >바이올린</option>
                                <option value="viola">비올라</option>
                                <option value="cello">첼로</option>
                                <option value="flute">플룻</option>
                            </select>
                        </th>
                        <th><input type="text" value={userInput.number} onChange={(e)=>{controlInputValue(e, 'number')}}></input></th>
                        <th><input type="date" value={userInput.date} onChange={(e)=>{controlInputValue(e, 'date')}}></input></th>
                    </tr>
            </table>
            
            <div><button  className="advwritebtn" type="button" onClick={()=>{console.log(userInput)}}>작성 하기</button></div>
        
        </div>


    ) 
    
}



export default AdvertiseWrite;



