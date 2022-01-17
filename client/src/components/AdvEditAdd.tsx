import React, { useState } from "react";


const AdvEditAdd: React.FC =  () => {
    

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
        
                    
                    <tr>
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
                    </tr>
               


    ) 
    
}



export default AdvEditAdd;



