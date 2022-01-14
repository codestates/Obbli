import { Link } from 'react-router-dom';

interface Links {
    to:string,
    text: string
}

function MenuItem({ to, text }:Links):JSX.Element {
    return (
        <Link {...{ to }}>{text}</Link>
    );
  }

  export default MenuItem