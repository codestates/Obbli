import React from "react";
import {Link} from "react-router-dom"

type ItemProps = {
    uuid:string,
    location:string,
    org_name:string,
    title:string,
    active_until:string
}

const AdvListItem: React.FC<ItemProps> =  ({uuid, location, org_name, title, active_until}) => {
    return(
        <tr >
            <td>{location}</td>
            <td>{org_name}</td>
            <td><Link to={`/advert/${uuid}`}>{title}</Link></td>
            <td>{active_until}</td>
            <td></td>
        </tr>


    ) 
    
}



export default AdvListItem;



