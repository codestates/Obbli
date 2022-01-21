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
  const [skills, setSkills] = useState([]);
  const [positions, setPositions] = useState([]);

  const [userInput, setUserInput] = useState({
    location: "",
    positions: [{}],
    active_until: "",
    event_at: "",
    title: "",
    body: "",
  });

  const [userLocation, setUserLocation] = useState();

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
        setUserLocation(addr);
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
          }
        );
      },
    }).open();
  }

  const controlInputValue = (e: any, key: string) => {
    setUserInput({ ...userInput, [key]: e.target.value });
  };
  const fetchAdvertise = () => {
    axios.get(`/advert/${uuid}`).then((res) => {
      console.log(res.data);
      setUserInput((prev) => ({ ...prev, ...res.data }));
    });
  };

  const [addPosition, setaddPosition] = useState([1]);
  const [position, setPosition] = useState([]);

  const onClickWrite = () => {
    const data = {
      location: userLocation,
      active_until: userInput.active_until,
      event_at: userInput.event_at,
      title: userInput.title,
      body: userInput.body,
      positions: position,
    };

    console.log(data);

    (uuid ? axios.patch : axios.post)(`/advert/${uuid || ""}`, data).then(
      (resp) => {
        navigate(`/advert/${uuid || resp.data.uuid}`);
      }
    );
    ///Users/jeonghun/Desktop/project/Obbli/server/build/Util.js:15
    //const target = token.split(' ')[1]; 오류 발생했습니다....아마 액세스 토큰 문제인것 같아요...
    //
  };

  useEffect(() => {
    if (uuid) {
      fetchAdvertise();
    }
    axios.get("/skill").then((resp) => setSkills(resp.data));
  }, []);

  return (
    <div className="advertiseWrite">
      <div className="PostTitle">
        <div>
          <p>공고 제목</p>
        </div>
        <input
          className="InputTitle"
          value={userInput.title}
          onChange={(e) => {
            controlInputValue(e, "title");
          }}
        ></input>
      </div>
      <div className="PostContent">
        <p>공고 상세 내용</p>
        <div>
          <textarea
            className="InputContent"
            value={userInput.body}
            onChange={(e) => {
              controlInputValue(e, "body");
            }}
          ></textarea>
        </div>
      </div>
      <div className="advLocation">
        <div className="advLocationTit">
          <p className="locTitle">공연 장소</p>
          <input
            className="inputAddress"
            type="text"
            id="sample5_address"
            placeholder="주소"
            value={userLocation}
          />
          <button
            className="inputAddressbtn"
            type="button"
            value="주소 검색"
            onClick={() => {
              sample5_execDaumPostcode();
            }}
          >
            검색
          </button>
          <br />
        </div>
        <div className="inputMap"></div>
        {/* <tr>
        <td>
          <AdvMap location={userInput.location} />
        </td>
      </tr> */}
      </div>
      <div className="time_skill_Select">
        <div className="advTime">
          <div className="atSelect">
            <p className="timeTitle">공연 일시</p>
            <input
              type="datetime-local"
              value={userInput.event_at}
              onChange={(e) => {
                controlInputValue(e, "event_at");
              }}
            ></input>
          </div>
          <div className="untillSelect">
            <p className="timeTitle">모집 기한</p>
            <input
              type="datetime-local"
              value={userInput.active_until}
              onChange={(e) => {
                controlInputValue(e, "active_until");
              }}
            ></input>
          </div>
                </div>
          <div className="advSkill">
            <p>모집 악기</p>
            <p>모집 인원</p>
            <div>
              {addPosition.map((el, key) => {
                return (
                  <AdvPositionAdd
                    key={key}
                    userPosition={userInput.positions}
                    addPosition={addPosition}
                    setaddPosition={setaddPosition}
                    position={position}
                    setPosition={setPosition}
                  />
                );
              })}
          </div>
        </div>
      </div>
      <div>
        <button
          className="advwritebtn"
          type="button"
          onClick={() => {
            onClickWrite();
          }}
        >
          작성 하기
        </button>
      </div>
    </div>
  );
};

export default AdvertiseWrite;
