import React, {useEffect} from "react";
const  kakao  = (window as any).kakao;

type PageProps = {
    postsPerPage:number,
    totalPosts:number,
    paginate:React.Dispatch<React.SetStateAction<number>>,
}


const Pagination: React.FC<PageProps> =  ({postsPerPage, totalPosts, paginate} : number | any ) => {
    const pageNumbers:number[] = [];
    for(let i=1; i<= Math.ceil(totalPosts/postsPerPage); i++){
        const result = i
        pageNumbers.push(result)

    }

    return(
        <div className="pagination">
            {pageNumbers.map((el, key)=>{
                
                return (
                    <ul>
                        <li className="page-link" onClick={()=>{paginate(el)}}><span key={key} >{el}</span></li>
                    </ul>
                )
            })}
            
       </div>
        
        

    ) 
    
}



export default Pagination;



