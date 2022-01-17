import axios from "axios";
import React, {useEffect} from "react";
const  kakao  = (window as any).kakao;




const AdvMapFilter =  ({ adverts }: { adverts: any }) => {

    useEffect(() => {
        mapScript();
        
    }, [adverts]);

    const mapScript = () => {
        const container = document.querySelector('.location');
		const options = {
			center: new kakao.maps.LatLng(33.450701, 126.570667),
			level: 10
		};
        const map = new kakao.maps.Map(container, options);
        
        
        // var clusterer = new kakao.maps.MarkerClusterer({
        //     map: map, // 마커들을 클러스터로 관리하고 표시할 지도 객체 
        //     averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정 
        //     minLevel: 10 // 클러스터 할 최소 지도 레벨 
        // });

        // var positions = [
        //     {
        //         title: '카카오', 
        //         latlng: new kakao.maps.LatLng(33.450705, 126.570677)
        //     },
        //     {
        //         title: '생태연못', 
        //         latlng: new kakao.maps.LatLng(33.450936, 126.569477)
        //     },
        //     {
        //         title: '텃밭', 
        //         latlng: new kakao.maps.LatLng(33.450879, 126.569940)
        //     },
        //     {
        //         title: '근린공원',
        //         latlng: new kakao.maps.LatLng(33.451393, 126.570738)
        //     }
        // ];
        
        //axios call을 통해 주소지 목록화 
        const location = adverts.map((el: { location: any; })=>{
            return [el.location]
        })
        console.log(location)

        //가져온 주소지를 통해 위도와 경도를 나타내기
        var ps = new kakao.maps.services.Places();  
        location.map((el:any)=>{
            ps.keywordSearch(el, (data:any)=>{
                data.map((latLng:any)=>{
                    var bounds = new kakao.maps.LatLngBounds();
                    new kakao.maps.Marker({
                              //마커가 표시 될 지도
                              map: map,
                              //마커가 표시 될 위치
                              position: new kakao.maps.LatLng(latLng.y, latLng.x),
                              //마커에 hover시 나타날 title
                              title: latLng.address_name,
                              level: 10
                    });
                    bounds.extend(new kakao.maps.LatLng(latLng.y, latLng.x),);
                    map.setBounds(bounds);
                })
                
            })
        })

        
        

        const locatinLatLng = location.map((el: any)=>{
            return console.log(ps.keywordSearch(el, ))
        })

    
        
        var positions = [
            {
                title: '카카오', 
                latlng: new kakao.maps.LatLng(33.450705, 126.570677)
            },
            {
                title: '생태연못', 
                latlng: new kakao.maps.LatLng(33.450936, 126.569477)
            },
            {
                title: '텃밭', 
                latlng: new kakao.maps.LatLng(33.450879, 126.569940)
            },
            {
                title: '근린공원',
                latlng: new kakao.maps.LatLng(33.451393, 126.570738)
            }
        ];

       
        
    }
        


    return(
        <div className="advMapFilter">
            <div><span>공연 장소 : </span></div>
            <div  className="advMapFilter location"></div>
       </div>
        
        

    ) 
    
}



export default AdvMapFilter;



