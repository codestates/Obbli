import React from "react";
import AdvListItem from "./AdvListItem";

const AdvList = ({ adverts,dummy }: { adverts: any, dummy:any }) => {
  return (
    <div >
      <div className="Listhead">
        <p className="Listhead col1">모집기한</p>
        <p className="Listhead col2">제목</p>
        <p className="Listhead col3">행사장소</p>
        <p className="Listhead col4">단체명</p>
      </div>
    <div className="advList">
        {dummy.map((el: any) => {
          return (
            <AdvListItem
              uuid={el.uuid}
              location={el.location}
              org_name={el.org_name}
              title={el.title}
              active_until={el.active_until}
            ></AdvListItem>
          );
        })}
    </div>
    </div>
  );
};

export default AdvList;
