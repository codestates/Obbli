import React, { useState } from "react";
// import AdvPositionAdd from '../components/AdvPositionAdd'


const AdvertiseEdit: React.FC =  () => {
    

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
    const [addInstrument, setAddInstrument] = useState([1])

    const controlAddInstrument = () => {
        const result = [...addInstrument]
        result.push(1)
        setAddInstrument(result)
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
                        <th><input value={userInput.title} onChange={(e)=>{controlInputValue(e, 'title')}}></input></th>
                    </tr>
                <thead>
                    <tr>
                        <th>공고 상세 내용</th>
                    </tr>
                </thead>
                    <th><textarea value={userInput.content} onChange={(e)=>{controlInputValue(e, 'content')}}></textarea></th>   
            </table>
            <table className="advWriteTable">
                <thead>
                    <tr>
                        <th>공연 장소</th>
                        <th>모집 기한</th>
                    </tr>
                </thead>
                    <tr>
                        <th><input type="text" value={userInput.place} onChange={(e)=>{controlInputValue(e, 'place')}}></input></th>
                        <th><input type="date" value={userInput.date} onChange={(e)=>{controlInputValue(e, 'date')}}></input></th>
                    </tr>
            </table>
            <table className="advWriteTable ">
                <thead>
                    <tr>
                        <th>모집 악기</th>
                        <th>모집 인원</th>
                        <th><button type="button" onClick={()=>{controlAddInstrument()}}>추가</button></th>
                    </tr>
                </thead>
                   {
                    addInstrument.map((el)=>{
                        // return <AdvPositionAdd/>
                    })
                   }
                    
            </table>
            
            <div><button  className="advwritebtn" type="button" onClick={()=>{console.log(userInput)}}>작성 하기</button></div>
        
        </div>


    ) 
    
}



export default AdvertiseEdit;



