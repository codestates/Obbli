import axios from "axios";
import { resolve } from "node:path/win32";
import React, { createRef, useEffect, useState } from "react";
import AdvMapFilterView from "./AdvMapFilterView";
const  kakao  = (window as any).kakao;

export default function AdvMapFilter ({ adverts, setAdverts }: { adverts: any ; setAdverts:any }) {
    const [mapState, setMapState] = useState();
    const [result, setResult] = useState([] as any);
    const [userInfo, setUserInfo] = useState([] as any);
    // useEffect(() => { mapScript() }, [adverts]);
    useEffect(() => setMapState(mapScript()), []);

    const mapScript = () => {
        const container = document.querySelector('.advMapFilter_location');
        const options = { center: new kakao.maps.LatLng(33.450701, 126.570667) };
        const map = new kakao.maps.Map(container, options);
        const clusterer = new kakao.maps.MarkerClusterer({
            map: map, // 마커들을 클러스터로 관리하고 표시할 지도 객체
            averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
            minLevel: 5 // 클러스터 할 최소 지도 레벨
        });
        const bounds = new kakao.maps.LatLngBounds();
        const geocoder = new kakao.maps.services.Geocoder();
        const addressSearch = async function (address: any) {
            return new Promise((resolve, reject) => {
                geocoder.addressSearch(address, function(result: any[], status: any) {
                    if (status === kakao.maps.services.Status.OK) {
                        resolve({ "lat": result[0].y, "lng": result[0].x, "address_name": result[0].address_name });
                    } else {
                        reject(status);
                    }
                });
            });
        };


        const markers: any[] = [];
        adverts.map(async (el: any) => {
            const result = await addressSearch(el.location);
            const position: any[] = [];
            position.push(result);
            const marker = new kakao.maps.Marker({
                map: map,
                position: new kakao.maps.LatLng(position[0].lat, position[0].lng),
                title:el.title,
            });
            el.marker = marker;
            markers.push(marker);
            bounds.extend(new kakao.maps.LatLng(position[0].lat, position[0].lng));
            map.setBounds(bounds);
            await clusterer.addMarkers(markers);
        });

        kakao.maps.event.addListener(map, 'dragend', function()  {
            let inBounds: any[];
            const userView: { uuid: any; }[] = [];

            const bounds = map.getBounds();

            const visibleAdverts = adverts.filter(({ marker }: { marker: any }) => {
              return bounds.contain(marker.getPosition());
            });

            setUserInfo(visibleAdverts);
        });

        return map;
    } // end of mapScript()

    return(
        <div className="advMapFilter">
            <p>{ (mapState as any)?.getDraggable() }</p>
            <div className="advMapFilter_location"></div>
            { userInfo.length===0 ? <AdvMapFilterView userInfo={adverts}/>:<AdvMapFilterView userInfo={userInfo}/> }
       </div>
    );
}
