import axios from 'axios';
import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

function MypageOrgInfo({ data }):JSX.Element {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const navigate = useNavigate();
  const [userInput, setUserInput] = useState({
    name: data.name,
    description: data.description,
    headcount: data.headcount,
    since: data.since,
    pw: '',
    pw_check: '',
  });

  const controlInput = (key:string) => (e:any) => {
    setUserInput({ ...userInput, [key]: e.target.value });
  };

  const onClickUpdate = () => {
    // TODO: axios fetch 정보 수정
    // TODO: pw check
    axios.patch(`/org`)
    .then((res)=> {
      setIsEditing(false)
    })
  }

  const unregister = () => {
    // TODO: axios delete 보내기
    axios.delete(`/person`)
    .then((res) => {
      navigate('/')
    })
  }

  return (
    <>
    {isEditing ? (
    <div>
      <div className="userInfoWrap">
        <div>
          <div className="inputWrap">
            <div className="mypageInfoNameEdit">단체 이름 :</div>
            <input type="name" value={userInput.name} onChange={controlInput('name')} />
          </div>
          <div className="inputWrap">
            <div className="mypageInfoNameEdit">단체인원수 :</div>
            <input type="headcount" value={userInput.headcount} onChange={controlInput('headcount')} />
          </div>
          <div className="inputWrap">
            <div className="mypageInfoNameEdit">단체설립일 :</div>
            <input type="since" value={userInput.since} onChange={controlInput('since')} />
          </div>
        </div>
        <div className="pwChangeWrap">
          <div className="inputWrap">
            <div className="mypageInfoNameEdit">비밀번호 :</div>
            <input type="password" value={userInput.pw} onChange={controlInput('pw')} />
          </div>
          <div className="inputWrap">
            <div className="mypageInfoNameEdit">비밀번호 확인 :</div>
            <input type="password" value={userInput.pw_check} onChange={controlInput('pw_check')} />
          </div>
        </div>
      </div>
      <div className="userHistoryWrap">
        <textarea className="userHistoryText">{userInput.description}</textarea>
      </div>
      <button type='button' className="mypageBtu delete" onClick={unregister}>탈퇴하기</button>
      <button type='button' className="mypageBtu" onClick={onClickUpdate}>확인</button>
      <button type='button' className="mypageBtu" onClick={() => setIsEditing(false)}>취소하기</button>
    </div>
    ) : (
    <div>
      <div className="userInfoWrap">
        <div>
          <div className="mypageInfoName">단체 이름 : {data.name}</div>
          <div className="mypageInfoName">단체인원수 : {data.headcount}</div>
        </div>
        <div>
          <div className="mypageInfoName">단체설립일 : {data.since}</div>
        </div>
      </div>
      <div className="userHistory">
        {userInput.description}
      </div>
      <button type='button' className="mypageBtu" onClick={() => setIsEditing(true)}>수정하기</button>
    </div>
    )}
    </>
  )
}

export default MypageOrgInfo
