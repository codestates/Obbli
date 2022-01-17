import React, {useState} from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import TopNavigation from './components/TopNavigation';
import Footer from './components/Footer';
import SignIn from './modal/SignIn';
import SignUp from './modal/SignUp';
import MypagePerson from './pages/MypagePerson';
import MypageOrg from './pages/MypageOrg';
import Home from './pages/Home';
import './App.css';
import Advertise from './pages/Advertise'
import AdvView from './pages/AdvView';
import AdvertiseWrite from './pages/AdvertiseWrite';
import AdvMap from './components/AdvMap';
import axios from 'axios';

export interface UserStateType {
  isSignedIn: boolean,
  accessToken: string
}

function App() {
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    axios.defaults.headers.common.authorization = accessToken;
  }

  const [isSignInVisible, setIsSignInVisible] = useState<boolean>(false)
  const [isSignUpVisible, setIsSignUpVisible] = useState<boolean>(false)
  const navigate = useNavigate();
  const [userState, setUserState] = useState<UserStateType>({
    isSignedIn: Boolean(accessToken),
    accessToken: accessToken ?? '',
  })

  const onClickSignOut = () => {
    axios.post(`/sign-out`, {})
    .then(res => {
      setUserState({
        isSignedIn: false,
        accessToken: '',
      })
    })
    .then(()=> {
      navigate('/')
    })
    }

  return (
    <div className="App">
      <nav>
        <TopNavigation {...{ userState, setUserState, setIsSignInVisible, onClickSignOut}} />
      </nav>
      <div className="body">
        <SignIn {... {isSignInVisible, setIsSignInVisible, setIsSignUpVisible, setUserState}} />
        <SignUp {... {isSignUpVisible, setIsSignUpVisible, setUserState}} />
        <Routes>
          <Route path="/">
            <Route index element={<Home />} />
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
