import React, {useState} from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Topnavigation from './components/topNavigation';
import Footer from './components/footer';
import SignIn from './modal/signIn';
import SignUp from './modal/signUp';
// import ReviewModal from './modal/ReviewModal';
import MypagePerson from './pages/MypagePerson';
import MypageOrg from './pages/MypageOrg';
import './App.css';
import Advertise from './pages/Advertise'
import AdvView from './pages/AdvView';
import AdvertiseWrite from './pages/AdvertiseWrite';
import AdvMap from './components/AdvMap';

interface UserStateType {
  isSignedIn: boolean,
  accessToken: string,
  uuid: string,
}

function App() {
  const [isSignInVisible, setIsSignInVisible] = useState<boolean>(false)
  const [isSignUpVisible, setIsSignUpVisible] = useState<boolean>(false)
  const [isReviewVisible, setIsReviewVisible] = useState<boolean>(false)
  const [userState, setUserState] = useState<UserStateType>({
    isSignedIn: false,
    accessToken:'',
    uuid: '',
  })

  return (
    <div className="App">
      <nav>
        <Topnavigation {...{ userState, setUserState, setIsSignInVisible}} />
      </nav>
      <div className="body">
        <SignIn {... {isSignInVisible, setIsSignInVisible, setIsSignUpVisible, setUserState}} />
        <SignUp {... {isSignUpVisible, setIsSignUpVisible, setUserState}} />
        <Routes>
          <Route path="/">
            <Route path="/mypageperson" element={<MypagePerson {... {userState, setUserState }}/>} />
            <Route path="/mypageorg" element={<MypageOrg {... {userState, setUserState }}/>} />
            <Route path="advert" element={<Advertise/>}></Route>
            <Route path="advert/:uuid" element={<AdvView />} />
            <Route path="advert/write" element={<AdvertiseWrite />} />
          </Route>
        </Routes>
      </div>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default App;
