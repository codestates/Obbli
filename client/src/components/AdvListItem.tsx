import React from "react";
import { Link } from "react-router-dom";

type ItemProps = {
  uuid: string;
  location: string;
  org_name: string;
  title: string;
  active_until: string;
};

const AdvListItem: React.FC<ItemProps> = ({
  uuid,
  location,
  org_name,
  title,
  active_until,
}) => {
  return (
    <div className="Listele" >
      <p className='Advele advcol1'>{active_until}</p>
      <p className='Advele advcol2'>
        <Link className='advTitle' to={`/advert/${uuid}`}>{title}</Link>
      </p>
      <p className='Advele advcol3'>{location}</p>
      <p className='Advele advcol4'>{org_name}</p>
    </div>
  );
};

export default AdvListItem;
