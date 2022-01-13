import React, {useEffect} from "react";
const  kakao  = (window as any).kakao;

type AddressProps = {
    org_address:string
}


const AdvMap: React.FC<AddressProps> =  (props:AddressProps) => {

    useEffect(() => {
        var infowindow = new kakao.maps.InfoWindow({zIndex:1});
        const container = document.querySelector('.location');
		const options = {
			center: new kakao.maps.LatLng(33.450701, 126.570667),
			level: 3
		};
        const map = new kakao.maps.Map(container, options);

        var ps = new kakao.maps.services.Places(); 

        ps.keywordSearch(props.org_address, placesSearchCB); 
        
        function placesSearchCB (data:any, status:any, pagination:any) {
            if (status === kakao.maps.services.Status.OK) {
        
                // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
                // LatLngBounds 객체에 좌표를 추가합니다
                var bounds = new kakao.maps.LatLngBounds();
        
                for (var i=0; i<data.length; i++) {
                    displayMarker(data[i]);    
                    bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
                }       
        
                // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
                map.setBounds(bounds);
            } 
        }
        
        // 지도에 마커를 표시하는 함수입니다
        function displayMarker(place:any) {
            
            // 마커를 생성하고 지도에 표시합니다
            var marker = new kakao.maps.Marker({
                map: map,
                position: new kakao.maps.LatLng(place.y, place.x) 
            });
        
            // 마커에 클릭이벤트를 등록합니다
            kakao.maps.event.addListener(marker, 'click', function() {
                // 마커를 클릭하면 장소명이 인포윈도우에 표출됩니다
                infowindow.setContent('<div style="padding:5px;font-size:12px;">' + place.place_name + '</div>');
                infowindow.open(map, marker);
            });
        }



        
    }, []);

    console.log(props.org_address)

    return(
        <div className="advMap">
            <div><span>공연 장소 : {props.org_address}</span></div>
            <div  className="location"></div>
       </div>
        
        

    ) 
    
}



export default AdvMap;



