import axios from 'axios';
import React, {useState, useEffect} from 'react';

interface mypageInfoType{
  uuid: string,
  name: string,
  description: string,
  since: string,
  headcount: number
}

interface historyType {
    mypageInfo: mypageInfoType
    setMypageInfo: React.Dispatch<React.SetStateAction<mypageInfoType>>
}

function MypageOrgInfo(props:historyType):JSX.Element {
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
    axios.patch(`/org`)
    .then((res)=> {
      props.setMypageInfo({
        uuid: props.mypageInfo.uuid,
        name:props.mypageInfo.name,
        description: props.mypageInfo.description,
        since:props.mypageInfo.since,
        headcount: props.mypageInfo.headcount
      })
      setIsEditing(false)
    })
  }

  const onClickCancel = () => {
    // TODO: axios로 수정하기 않고 닫기
    setIsEditing(false);
  }

  // TODO: axios get 기관 정보 가져오기

  useEffect(() => {
  
  }, [])

  return (
    <>
    {isEditing ? (
    <div>
      <div className="userInfoWrap">
        <div>
          <div className="mypageInfoName">단체 이름</div>
          <input type="name" value={props.mypageInfo.name} onChange={controlInputValue('name')} />
          <div className="mypageInfoName">단체인원수</div>
          <input type="headcount" value={props.mypageInfo.headcount} onChange={controlInputValue('headcount')} />
        </div>
        <div>
          <div className="mypageInfoName">단체설립일</div>
          <input type="since" value={props.mypageInfo.since} onChange={controlInputValue('since')} />
        </div>
      </div>
      <div className="pwChangeWrap">
          <div className="mypageInfoName">비밀번호</div>
          <input type="password" value={pwChange.pw} onChange={controlInputPw('pw')} />
          <div className="mypageInfoName">비밀번호 확인</div>
          <input type="password" value={pwChange.pw_cheke} onChange={controlInputPw('pw_cheke')} />
        </div>
      <div className="userHistory">
        {/* 엔터로 구분?? */}
        {props.mypageInfo.description}
        
      </div>
      <div className="btu" onClick={onClickUpdate}>확인</div>
      <div className="btu" onClick={onClickCancel}>취소하기</div>
    </div>
    ) : (
    <div>
      <div className="userInfoWrap">
        <div>
          <div className="mypageInfoName">단체 이름</div>
          <div className="mypageInfo">{props.mypageInfo.name}</div>
          <div className="mypageInfoName">단체인원수</div>
          <div className="mypageInfo">{props.mypageInfo.headcount}</div>
        </div>
        <div>
          <div className="mypageInfoName">단체설립일</div>
          <div className="mypageInfo">{props.mypageInfo.since}</div>
        </div>
      </div>
      <div className="userHistory">
        {/* 엔터로 구분?? */}
        {props.mypageInfo.description}
      </div>
      <div className="btu" onClick={() => setIsEditing(true)}>수정하기</div>
    </div>
    )}
      
    </>
  )
}

export default MypageOrgInfo