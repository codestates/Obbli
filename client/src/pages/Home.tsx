import { useNavigate } from 'react-router-dom';


function Home() {
const navigate = useNavigate();

  return(
    <div>
      hello
      <div onClick={()=>navigate('/advList')}>공고 보러 가기</div>
    </div>
  )
}

export default Home