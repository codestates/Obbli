import React, { useState } from "react";

type ItemProps = {
    addPosition:number[],
    setaddPosition:any,
    position:{}[],
    setPosition:any
    userPosition:any
}


const AdvPositionAdd: React.FC<ItemProps>=  ({addPosition, setaddPosition, position, setPosition, userPosition}) => {
    const [userInput, setUserInput] = useState({
        skill_name:'',
        quota:0
    }) 

    const controlAddPosition = () => {
        if(userInput.skill_name==='' || userInput.quota===0){
            return
        }else {
            const result = [...addPosition]
            result.push(1)
            setaddPosition(result)
            setPosition([...position, userInput])
        }
    }
 
    
    const controlPosition = (e:any) => {
        const {value, name} = e.target
        setUserInput({
            ...userInput, [name]:value
        })
    }
    console.log(userPosition)
    return(
        <tr>
            <td>
                <select  onChange={(e)=>{controlPosition(e)}} name="skill_name">
                    <option value="none" >===선택===</option>
                    <option value="바이올린" >바이올린</option>
                    <option value="비올라">비올라</option>
                    <option value="첼로">첼로</option>
                    <option value="플룻">플룻</option>
                    <option value="지휘">지휘</option>
                </select>
            </td>
            <td><input type="text" onChange={(e)=>controlPosition(e)} name='quota'></input></td>
            <td className="btn" onClick={()=>{controlAddPosition()}}><span>+</span></td>
        </tr>
    ) 
    
}



export default AdvPositionAdd;



