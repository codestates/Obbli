import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import TopNavigation from './components/TopNavigation';
// import Footer from './components/Footer';
import SignIn from './modal/SignIn';
import SignUp from './modal/SignUp';
import MypagePerson from './pages/MypagePerson';
import MypageOrg from './pages/MypageOrg';
import AdvFilter from './pages/AdvFilter';
import Home from './pages/Home';
import './App.css';
import Advertise from './pages/Advertise'
import AdvView from './pages/AdvView';
import AdvertiseWrite from './pages/AdvertiseWrite';
import AdvMap from './components/AdvMap';
import axios from 'axios';

interface UserState {
  uuid: string,
}


function App() {
  const navigate = useNavigate();
  const auth = JSON.parse(localStorage.getItem('auth') ?? null as unknown as string);
  if (auth) {
    axios.defaults.headers.common['Authorization'] = `${auth.token_type} ${auth.access_token}`;
  }

  const [isSignInVisible, setIsSignInVisible] = useState<boolean>(false)
  const [isSignUpVisible, setIsSignUpVisible] = useState<boolean>(false)
  const [isReviewVisible, setIsReviewVisible] = useState<boolean>(false)
  const [userState, setUserState] = useState(JSON.parse(localStorage.getItem('auth') as string));

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
        <TopNavigation {...{ userState, setUserState, setIsSignInVisible}} />
      </nav>
      <div className="body">
        <SignIn {... {isSignInVisible, setIsSignInVisible, setIsSignUpVisible, setUserState}} />
        <SignUp {... {isSignUpVisible, setIsSignUpVisible, setUserState}} />
        <Routes>
          <Route index element={<Home {... { userState, setUserState, setIsSignInVisible, setIsSignUpVisible, onClickSignOut }} />} />
          <Route path="/mypage/person" element={<MypagePerson {... {userState, setUserState }}/>} />
          <Route path="/mypage/org" element={<MypageOrg {... {userState, setUserState }}/>} />
          <Route path="advert" element={<Advertise/>}></Route>
          <Route path="advert/:uuid" element={<AdvView />} />
          <Route path="advert/write" element={<AdvertiseWrite />} />
          <Route path="advert/edit/:uuid" element={<AdvertiseWrite />} />
          <Route path="filter" element={<AdvFilter />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
