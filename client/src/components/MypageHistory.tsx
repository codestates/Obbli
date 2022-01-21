import axios from 'axios';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// interface mypageInfoType {
//     user_id: string,
//     name: string,
//     professional: boolean,
//     instrument: string,
//     history: string
// }

// interface historyType {
//     mypageInfo: mypageInfoType
//     setMypageInfo: React.Dispatch<React.SetStateAction<mypageInfoType>>
// }

function MypageHistory({ data }):JSX.Element {
  const defaultInput = {
    name: data.name,
    pw: '',
    pw_check: '',
    skill_name: data.skill_name,
    history: data.history,
  };
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [userInput, setUserInput] = useState({ ...defaultInput });

  function controlInput(key) {
    return function (ev) {
      setUserInput(prev => ({ ...prev, [key]: ev.target.value }));
    }
  }

  const checkBoxChecked = (e:any) => {
    const professional = e.target.checked ? true : false;
    setUserInput(prev => ({ ...prev, professional }));
  }

  const unregister = () => {
    axios.delete(`/person`).then((res) => { navigate('/'); });
  }

  function update() {
    axios.patch('/person', Object.fromEntries(Object.entries(userInput).filter(pair => pair[1])))
      .then(resp => {
        if (resp.status !== 200) { /* Error */ }
        navigate('/');
      });
  }

  return (
    <>
    {isEditing ? (
    <div>
      <div className="userInfoWrap">
        <div>
          <div className="inputWrap">
            <div className="mypageInfoNameEdit">이름 : </div>
            <input type="text" value={userInput.name} onChange={controlInput('name')} />
          </div>
          <div className="inputWrap">
            <div className="mypageInfoNameEdit">악기 : </div>
            <input type="text" value={userInput.skill_name} onChange={controlInput('skill')} />
          </div>
          <div className="inputWrap">
            <div className="mypageInfoNameEdit">전공 여부</div>
            <input type='checkbox' onChange={(e)=>checkBoxChecked(e)} />
          </div>
        </div>
        <div className="pwChangeWrap">
          <div className="inputWrap">
            <div className="mypageInfoNameEdit">비밀번호 : </div>
            <input type="password" value={userInput.pw} onChange={controlInput('pw')} />
          </div>
          <div className="inputWrap">
            <div className="mypageInfoNameEdit">비밀번호 확인 : </div>
            <input type="password" value={userInput.pw_check} onChange={controlInput('pw_check')} />
          </div>
        </div>
      </div>
      <div className="userHistoryWrap">
        <textarea className="userHistoryText">{userInput.history}</textarea>
      </div>
      <button type='button' className="mypageBtu delete" onClick={unregister}>탈퇴하기</button>
      <button type='button' className="mypageBtu" onClick={update}>확인</button>
      <button type='button' className="mypageBtu" onClick={() => setIsEditing(false)}>취소하기</button>
    </div>
    ) : (
    <div>
      <div className="userInfoWrap">
        <div>
          <div className="mypageInfoName">이름 : {data.name}</div>
          <div className="mypageInfoName">악기 : {data.skill}</div>
        </div>
        <div>
          <div className="mypageInfoName">전공 여부 {data.professional ? '✔' : null}</div>
        </div>
      </div>
      <div className="userHistory">
        {data.history}
      </div>
      <button type='button' className="mypageBtu" onClick={() => setIsEditing(true)}>수정하기</button>
    </div>
    )}
    </>
  )
}

export default MypageHistory