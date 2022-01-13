import React, {useState} from 'react';

interface mypageInfoType {
    user_id: string,
    name: string,
    professional: boolean,
    instrument: string,
    history: string
}

interface historyType {
    mypageInfo: mypageInfoType
    setMypageInfo: React.Dispatch<React.SetStateAction<mypageInfoType>>
}

function MypageHistory(props:historyType):JSX.Element {
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
          <div className="mypageInfoName">아이디</div>
          <input type="id" value={props.mypageInfo.user_id} onChange={controlInputValue('user_id')} />
          <div className="mypageInfoName">이름</div>
          <input type="name" value={props.mypageInfo.name} onChange={controlInputValue('realname')} />
        </div>
        <div>
          <div className="mypageInfoName">악기</div>
          <input type="instrument" value={props.mypageInfo.instrument} onChange={controlInputValue('instrument')} />
          <div className="mypageInfoName">전공 여부</div>
          <div className="mypageInfo">{props.mypageInfo.professional ? '전공' : null}</div>
        </div>
      </div>
      <div className="userHistory">
        {/* 엔터로 구분?? */}
        {props.mypageInfo.history}
        
      </div>
      <div className="btu" onClick={onClickUpdate}>확인</div>
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
          <div className="mypageInfo">{props.mypageInfo.instrument}</div>
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