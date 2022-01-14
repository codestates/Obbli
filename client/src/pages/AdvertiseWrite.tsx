import React, { useState, useEffect } from "react";
import axios from "axios";
import AdvPositionAdd from '../components/AdvPositionAdd'
import { useNavigate, useParams } from 'react-router-dom';



const AdvertiseWrite: React.FC =  () => {

    const {uuid} =useParams();
    const navigate = useNavigate();

    

    const [userInput, setUserInput] = useState({
        
        location:'',
        positions:[{

        }],
        active_until:'',
        event_at:'',
        title:'',
        body:'',
    })

    console.log(userInput)
       
   
    const controlInputValue = (e:any, key:string) => {
        setUserInput({...userInput, [key]:e.target.value})
        
    }
    const fetchAdvertise = () => {
        axios.get(`/advert/${uuid}`)
          .then((res) => {
              console.log(res.data)
            setUserInput(prev => ({...prev, ...res.data}));
          })
    } 

    const [addPosition, setaddPosition] = useState([1])
    const [position, setPosition] = useState([])
    
    
    const onClickWrite = () => {

        const data = {
            location: userInput.location,
            active_until: userInput.active_until,
            event_at: userInput.event_at,
            title: userInput.title,
            body: userInput.body,
            positions:position
        }
    
        console.log(data);
    
        (uuid ? axios.patch : axios.post)(`/advert/${uuid || ''}`, data)
          .then((resp) => { navigate(`/advert/${uuid || resp.data.uuid}`) })
        ///Users/jeonghun/Desktop/project/Obbli/server/build/Util.js:15
        //const target = token.split(' ')[1]; 오류 발생했습니다....아마 액세스 토큰 문제인것 같아요...
        //
    }
    
    useEffect(()=>{
        if(uuid) {fetchAdvertise();}
        
    }, [])

    return(
        <div className="advertiseWrite">
            <h3>Write</h3>
            <table className="advWriteTable">
                <thead>
                    <tr>
                        <th>공고 제목</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><input value={userInput.title} onChange={(e)=>{controlInputValue(e, 'title')}}></input></td>
                    </tr>
                </tbody>
            </table>
            <table className="advWriteTable">
                <thead>
                    <tr>
                        <th>공고 상세 내용</th>
                    </tr>        
                </thead>
                <tbody>
                    <tr>
                        <td><textarea value={userInput.body} onChange={(e)=>{controlInputValue(e, 'body')}}></textarea></td>
                    </tr>
                </tbody>
            </table>
            <table className="advWriteTable">
                <thead>
                    <tr>
                        <th>공연 장소</th>
                    </tr>        
                </thead>
                <tbody>
                    <tr>
                      <td><input type="text" value={userInput.location} onChange={(e)=>{controlInputValue(e, 'location')}}></input></td>
                    </tr>
                </tbody>
                    
            </table>

            <table className="advWriteTable">
                <thead>
                    <tr>
                        <th>모집 기한</th>
                        <th>공연 일시</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><input type="datetime-local" value={userInput.active_until} onChange={(e)=>{controlInputValue(e, 'active_until')}}></input></td>
                        <td><input type="datetime-local" value={userInput.event_at} onChange={(e)=>{controlInputValue(e, 'event_at')}}></input></td>
                    </tr>
                </tbody>    
            </table>
            <table className="advWriteTable">                
                <thead>
                    <tr>
                        <th>모집 악기</th>
                        <th>모집 인원</th>
                        
                    </tr>
                </thead>
                <tbody>
                    {
                        addPosition.map((el, key)=>{
                            return <AdvPositionAdd key={key} userPosition={userInput.positions} addPosition={addPosition} setaddPosition={setaddPosition} position={position} setPosition={setPosition} />
                        })
                    }
                </tbody>
            </table>
            
            <div><button  className="advwritebtn" type="button" onClick={()=>{onClickWrite()}}>작성 하기</button></div>
        
        </div>


    ) 
    
}



export default AdvertiseWrite;



