import React, { useState, useEffect } from "react";
import axios from "axios";
import AdvPositionAdd from "../components/AdvPositionAdd";
import { useNavigate, useParams } from "react-router-dom";
import AdvMap from "../components/AdvMap";
const kakao = (window as any).kakao;
const daum = (window as any).daum;

const AdvertiseWrite: React.FC = () => {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const [skills, setSkills] = useState([] as any);
  const [position, setPosition] = useState({
    skill_name: "",
    quota: 1,
  });

  const [userInput, setUserInput] = useState({
    location: "",
    positions: [] as any,
    active_until: "",
    event_at: "",
    title: "",
    body: "",
  });

  const controlInput = (e: any, key: string) => {
    setUserInput({ ...userInput, [key]: e.target.value });
  };

  function controlQuota(e) {
    setPosition((prev) => {
      return {
        ...prev,
        quota: e.target.value,
      };
    });
  }

  function addPosition() {
    if (!position.skill_name) {
      return;
    }
    setUserInput((prev) => {
      return {
        ...prev,
        positions: [...prev.positions, { ...position }],
      };
    });
    setPosition({ skill_name: "", quota: 1 });
  }

  
  //주소-좌표 변환 객체를 생성

  function sample5_execDaumPostcode() {
    const mapContainer = document.querySelector(".inputMap"), // 지도를 표시할 div
      mapOption = {
        center: new kakao.maps.LatLng(37.537187, 127.005476), // 지도의 중심좌표
        level: 5, // 지도의 확대 레벨
      };

    //지도를 미리 생성
    const map = new kakao.maps.Map(mapContainer, mapOption);
    const geocoder = new kakao.maps.services.Geocoder();
    //마커를 미리 생성
    const marker = new kakao.maps.Marker({
      position: new kakao.maps.LatLng(37.537187, 127.005476),
      map: map,
    });
    new daum.Postcode({
      oncomplete: function (data: { address: any }) {
        var addr = data.address; // 최종 주소 변수
        setUserInput({...userInput, location:addr})
        // 주소 정보를 해당 필드에 넣는다.
        // document.getElementById("sample5_address").value = addr;
        // 주소로 상세 정보를 검색
        geocoder.addressSearch(
          data.address,
          function (results: any[], status: any) {
            // 정상적으로 검색이 완료됐으면
            if (status === kakao.maps.services.Status.OK) {
              var result = results[0]; //첫번째 결과의 값을 활용

              // 해당 주소에 대한 좌표를 받아서
              var coords = new kakao.maps.LatLng(result.y, result.x);
              // 지도를 보여준다.
              // mapContainer.style.display = "block";
              map.relayout();
              // 지도 중심을 변경한다.
              map.setCenter(coords);
              // 마커를 결과값으로 받은 위치로 옮긴다.
              marker.setPosition(coords);
            }
          })
        }
      }).open({q:userInput.location});
    }
    const fetchAdvertise = () => {
    }

    const onClickWrite = () => {
        const data = {
            location: userInput.location,
            active_until: userInput.active_until,
            event_at: userInput.event_at,
            title: userInput.title,
            body: userInput.body,
            positions: userInput.positions,
        };
        (uuid ? axios.patch : axios.post)(`/advert/${uuid || ''}`, data)
          .then((resp) => { navigate(`/advert/${uuid || resp.data.uuid}`) })
    }

  useEffect(() => {
    if (uuid) {
      axios.get(`/advert/${uuid}`).then((res) => {
        setUserInput((prev) => ({ ...prev, ...res.data }));
      });
    }
    axios.get("/skill").then((resp) => setSkills(resp.data));
  }, []);

  return (
    <div className="advAndsubmit">
      <div className="advertiseWrite">

        <div className="title row">
          <div className="header">
            <p>공고 제목</p>
          </div>
          <div className="controller">
            <input className="InputTitle" value={userInput.title} onChange={(e) => { controlInput(e, "title"); }} />
          </div>
        </div>

        <div className="content row">
          <div className="header">
            <p>상세 내용</p>
          </div>
          <div className="controller">
            <textarea className="InputContent" value={userInput.body} onChange={(e) => { controlInput(e, "body"); }} />
          </div>
        </div>

        <div className="location row">
          <div className="header">
            <p>공연 장소</p>
          </div>
          <div className="controller">
            <div className="addressInput">
              <input className="inputAddress" type="text" id="sample5_address" placeholder="검색을 클릭해주세요" value={userInput.location} onChange={(e) => { controlInput(e, "location"); }} />
              <button className="inputAddressbtn" type="button" value={userInput.location} onClick={() => { sample5_execDaumPostcode(); }}>검색</button>
            </div>
            <div className="inputMap"></div>
          </div>
        </div>
      </div>{/* advWrite */}

      <div className="advWriteSidebar">
      <button className="submitbtn" type="button" onClick={() => { onClickWrite(); }}> 작성하기 </button>
       <div className="dateControllerWrapper">
            <div className="dateController">
              <p className="tiTitle">공연 일시</p>
              <input
                type="datetime-local"
                value={userInput.event_at}
                onChange={(e) => {
                  controlInput(e, "event_at");
                }}
              ></input>
            </div>
            <div className="dateController">
              <p className="tiTitle">모집 기한</p>
              <input
                type="datetime-local"
                value={userInput.active_until}
                onChange={(e) => {
                  controlInput(e, "active_until");
                }}
              ></input>
            </div>
        </div>
        <div className="positionControllerWrapper">
          <select
            className="skillName"
            value={position.skill_name}
            onChange={(e) => setPosition((prev) => ({ ...prev, skill_name: e.target.value, })) }
          >
            <option value="">==== 악기 ====</option>
            {skills.map((each) => (
              <option value={each.name}>{each.name}</option>
            ))}
          </select>
          <input className="Quantity" type="number" value={position.quota} onChange={controlQuota} ></input>
          <div className="skillPlus" onClick={addPosition}>+</div>
        </div>
        <div className="positionListWrapper">
          <div className="header">모집목록</div>
          <ul className="list">
            {userInput.positions.map((each) =>
              <li className="skillelement">
                <span>{each.skill_name}</span>
                <span>{each.quota}</span>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdvertiseWrite;
