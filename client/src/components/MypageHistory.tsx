import axios from 'axios';
import React, {useState, useEffect} from 'react';

interface mypageInfoType {
    user_id?: string,
    name: string,
    professional: boolean,
    skill: string,
    history: string
}

interface historyType {
    mypageInfo: mypageInfoType
    setMypageInfo: React.Dispatch<React.SetStateAction<mypageInfoType>>
}

function MypageHistory(props:historyType):JSX.Element {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [pwChange, setPwChange] = useState({
    pw:'',
    pw_cheke:'',
  })

  const controlInputValue = (key:string) => (e:any) => {
    props.setMypageInfo({ ...props.mypageInfo, [key]: e.target.value });
  };

  const controlInputPw = (key:string) => (e:any) => {
    setPwChange({ ...pwChange, [key]: e.target.value});
  };

  const onClickUpdate = () => {
    // TODO: axios fetch 정보 수정
    if(pwChange.pw !== pwChange.pw_cheke){
      alert('비밀번호가 다릅니다.')
      return;
    }
    axios.patch(`/person`)
    .then((res)=> {
      props.setMypageInfo({
        name:props.mypageInfo.name,
        professional: props.mypageInfo.professional,
        skill:props.mypageInfo.skill,
        history: props.mypageInfo.history
      })
      setIsEditing(false)
    })
  }

  const onClickCancel = () => {
    // TODO: axios로 수정하기 않고 닫기
    setIsEditing(false);
  }

  useEffect(() => {
    
  }, [])

  return (
    <>
    {isEditing ? (
    <div>
      <div className="userInfoWrap">
        <div>
          <div className="mypageInfoName">아이디</div>
          <div className="mypageInfo">{props.mypageInfo.user_id}</div>
          <div className="mypageInfoName">이름</div>
          <input type="text" value={props.mypageInfo.name} onChange={controlInputValue('realname')} />
        </div>
        <div>
          <div className="mypageInfoName">악기</div>
          <input type="text" value={props.mypageInfo.skill} onChange={controlInputValue('skill')} />
          <div className="mypageInfoName">전공 여부</div>
          <div className="mypageInfo">{props.mypageInfo.professional ? '전공' : null}</div>
        </div>
        <div className="pwChangeWrap">
          <div className="mypageInfoName">비밀번호</div>
          <input type="password" value={pwChange.pw} onChange={controlInputPw('pw')} />
          <div className="mypageInfoName">비밀번호 확인</div>
          <input type="password" value={pwChange.pw_cheke} onChange={controlInputPw('pw_cheke')} />
        </div>
      </div>
      <div className="userHistory">
        {/* 엔터로 구분?? */}
        {props.mypageInfo.history}
        
      </div>
      <div className="btu" onClick={onClickUpdate}>확인</div>
      <div className="btu" onClick={onClickCancel}>취소하기</div>
    </div>
    ) : (
    <div>
      <div className="userInfoWrap">
        <div>
          <div className="mypageInfoName">아이디</div>
          <div className="mypageInfo">{props.mypageInfo.user_id}</div>
          <div className="mypageInfoName">이름</div>
          <div className="mypageInfo">{props.mypageInfo.name}</div>
        </div>
        <div>
          <div className="mypageInfoName">악기</div>
          <div className="mypageInfo">{props.mypageInfo.skill}</div>
          <div className="mypageInfoName">전공 여부</div>
          <div className="mypageInfo">{props.mypageInfo.professional ? '전공' : null}</div>
        </div>
      </div>
      <div className="userHistory">
        {/* 엔터로 구분?? */}
        {props.mypageInfo.history}
      </div>
      <div className="btu" onClick={() => setIsEditing(true)}>수정하기</div>
    </div>
    )}
      
    </>
  )
}

export default MypageHistory