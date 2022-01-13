import React, {useState} from 'react';

interface mypageInfoType{
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

  const controlInputValue = (key:string) => (e:any) => {
    props.setMypageInfo({ ...props.mypageInfo, [key]: e.target.value });
  };

  const onClickUpdate = () => {
    // TODO: axios fetch 정보 수정
    setIsEditing(false);
  }

  // TODO: axios get 기관 정보 가져오기

  return (
    <>
    {isEditing ? (
    <div>
      <div className="userInfoWrap">
        <div>
          <div className="mypageInfoName">단체 이름</div>
          <input type="id" value={props.mypageInfo.name} onChange={controlInputValue('name')} />
          <div className="mypageInfoName">단체인원수</div>
          <input type="name" value={props.mypageInfo.headcount} onChange={controlInputValue('headcount')} />
        </div>
        <div>
          <div className="mypageInfoName">단체설립일</div>
          <input type="instrument" value={props.mypageInfo.since} onChange={controlInputValue('since')} />
        </div>
      </div>
      <div className="userHistory">
        {/* 엔터로 구분?? */}
        {props.mypageInfo.description}
        
      </div>
      <div className="btu" onClick={onClickUpdate}>확인</div>
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