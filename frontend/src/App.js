import { CssVarsProvider } from '@mui/joy';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import sunDownBg from './assets/images/afternoon.jpg';
import dayBg from './assets/images/day.jpg';
import nightBg from './assets/images/night.jpg';
import Navbar from './components/navbar/Navbar';
import { GeneralState } from './contexts/GeneralContext';
import Home from './pages/Home';
import LoginForm from './pages/LoginForm';
import Profile from './pages/Profile';
import Success from './pages/Seccess';
import SignupForm from './pages/SignupForm';
import CompletionForm from './pages/completeGoogleProfile';
import { getSocket, initSocket } from './socket';
import theme from './theme';

function App() {
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);
  const [sunDetails, setSunDetails] = useState({});
  const [currentTime, setCurrentTime] = useState(null);
  const [daySituation, setDaySituation] = useState('');
  const time = new Date();
  const formatedTime = time.toLocaleString(
    'en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false }
  );
  const {
    msgs, setMsgs,
    setSocketConnected,
    notification, setNotification,
    fetchAgain, setFetchAgain,
    selectedChatCompare } = GeneralState();
  const user = JSON.parse(localStorage.getItem('user'));
  const [hideNav, setHideNav] = useState(false);
  const [scrollData, setScrollData] = useState({
    y: 0,
    lastY: 0
  });

  useEffect(() => {
    if (user) {
      initSocket()
      var socket = getSocket();
      socket.on('connected', () => {
        setSocketConnected(true);
      });
    }
  }, []);

  // useEffect(() => {
  //   if (user) {
  //     const socket = getSocket()
  //     socket.on('msgRecieved', (newMsgRevieved) => {
  //       // console.log(newMsgRevieved);
  //       if (!selectedChatCompare || selectedChatCompare._id !== newMsgRevieved.chat._id) {
  //         if (!notification.includes(newMsgRevieved)) {
  //           setNotification([newMsgRevieved, ...notification]);
  //           setFetchAgain(!fetchAgain);
  //         }
  //       } else {
  //         setMsgs([...msgs, newMsgRevieved])
  //       }
  //     });
  //   }
  // });

  const getLocation = () => {
    // navigator.geolocation.getCurrentPosition(
    //   (position) => {
    //     setLat(position.coords.latitude);
    //     setLon(position.coords.longitude);
    //     // console.log(position);
    //   },
    //   (error) => {
    //     console.error('Error getting geolocation:', error);
    //     console.error('Error getting geolocation:', error);
    //     console.log('Error code:', error.code);
    //     console.log('Error message:', error.message);
    //   }
    // );
  };

  const getSun = async () => {
    if (lat && lon) {
      try {
        const { data } = await axios.get(`https://api.sunrisesunset.io/json?lat=${lat}&lng=${lon}`)
        setSunDetails(data.results)
        // console.log(data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    getLocation();
    const handleScroll = () => {
      setScrollData(lastState => {
        return {
          y: window.scrollY,
          lastY: lastState.y
        }
      })
    }
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (scrollData.lastY === scrollData.y) { // this fixes the trembling
      return;
    }

    if (scrollData.y > 500 && scrollData.y - scrollData.lastY > 0) { // scrollData.y - scrollData last > 0  this means we are scrolling UP
      setHideNav(true);
    } else {
      setHideNav(false);
    }
  }, [scrollData]);

  useEffect(() => {
    getSun();
  }, [lat, lon]);

  // const sunFind = () => {
  //   if (sunDetails && formatedTime) {
  //     const sunrise = moment(`2013-01-01 ${sunDetails.sunrise}`, 'YYYY-MM-DD HH:mm:ss');
  //     const sunset = moment(`2013-01-01 ${sunDetails.sunset}`, 'YYYY-MM-DD HH:mm:ss');
  //     const dawn = moment(`2013-01-01 ${sunDetails.dawn}`, 'YYYY-MM-DD HH:mm:ss');
  //     const dusk = moment(`2013-01-01 ${sunDetails.dusk}`, 'YYYY-MM-DD HH:mm:ss');

  //     const formatted = moment(`2013-01-01 ${formatedTime}`, 'YYYY-MM-DD HH:mm:ss A');

  //     console.log(formatted);
  //     console.log(sunrise);
  //     console.log(sunset);
  //     console.log(formatted.isBetween(sunset, dawn));

  //     if (formatted.isBetween(sunrise, sunset)) {
  //       console.log('is day');
  //       setDaySituation('day');
  //     } else if (formatted.isBetween(sunset, dawn)) {
  //       console.log('is night');
  //       setDaySituation('night');
  //     } else if (formatted.isBetween(dawn, sunrise)) {
  //       console.log('no sun');
  //       setDaySituation('no sun');
  //     } else if (formatted.isBetween(sunset, dusk)) {
  //       console.log('no sun');
  //       setDaySituation('no sun');
  //     }
  //   }
  // };

  const sunFind = () => {
    if (sunDetails && formatedTime) {
      const sunriseUnformated = new Date("1/1/2013 " + sunDetails.sunrise);
      const sunrise = sunriseUnformated.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false });

      const sunsetUnformated = new Date("1/1/2013 " + sunDetails.sunset);
      const sunset = sunsetUnformated.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false });

      const dawnUnformated = new Date("1/1/2013 " + sunDetails.dawn);
      const dawn = dawnUnformated.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false });

      const duskUnformated = new Date("1/1/2013 " + sunDetails.dusk);
      const dusk = duskUnformated.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false });

      // console.log(formatedTime)
      // console.log('sunrise', sunrise)
      // console.log('sunset', sunset)
      // console.log('dawn', dawn)
      // console.log('dusk', dusk)
      // console.log('formatedTime < sunset', formatedTime < sunset)
      // console.log('formatedTime > sunrise', formatedTime > sunrise)
      // console.log('formatedTime < sunrise', formatedTime < sunrise)
      // console.log('formatedTime > sunset', formatedTime > sunset)
      // console.log('formatedTime > dawn', formatedTime > dawn)
      // console.log('formatedTime < dusk', formatedTime < dusk)

      if (formatedTime < sunset && formatedTime > sunrise) {
        // console.log('is day');
        setDaySituation('day')
      } else if (formatedTime < sunrise && formatedTime > sunset || formatedTime < sunset && formatedTime < dawn) {
        // console.log('is night');
        setDaySituation('night')
      } else if (formatedTime < sunrise && formatedTime > dawn) {
        // console.log('no');
        setDaySituation('no sun')
      } else if (formatedTime < dusk && formatedTime > sunset) {
        // console.log('no');
        setDaySituation('no sun')
      };
    }
  }
  useEffect(() => {
    if (sunDetails && formatedTime) {
      sunFind()
    };
    // console.log(daySituation);
  }, [sunDetails, formatedTime])


  return (
    <CssVarsProvider theme={theme} defaultMode='system'>

      <div className="App" style={{ backgroundImage: daySituation && daySituation === 'day' ? `url(${dayBg})` : (daySituation === 'night' ? `url(${nightBg})` : (daySituation === 'no sun' ? `url(${sunDownBg})` : null)), backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundAttachment: 'fixed', backgroundPosition: 'center', minWidth: '100vw', minHeight: '100vh' }}>
        <BrowserRouter>
          <nav className={hideNav ? 'navbar hideNav' : 'navbar'} style={{ zIndex: 1 }}><Navbar /* socket={socket} */ /></nav>
          <div className="pages">
            <Routes>
              <Route path='/' element={!user ? <Navigate to="user/auth/login" /> : <Navigate to='/home' />} />
              <Route path='/' element={user && user.phoneNumber !== 999999999 ? <Navigate to='/home' /> : <Navigate to="user/auth/google/googleComplete" />} />
              <Route path='user/auth/login' element={!user ? <LoginForm /> : <Navigate to='/home' />} />
              {/* <Route path='user/auth/signup/avatar' element={user ? <AvatarUploadForm /> : <Navigate to='user/auth/login' />} /> */}
              <Route path='user/auth/signup' element={!user ? <SignupForm /> : <Navigate to='/home' />} />
              <Route path='/home' element={!user ? <LoginForm /> : <Home />} />
              <Route path='user/auth/google/success' element={<Success />} />
              <Route path='user/auth/google/googleComplete' element={<CompletionForm />} />
              <Route path='/:username' element={<Profile />} />
            </Routes>
          </div>
        </BrowserRouter>
      </div>
    </CssVarsProvider>
  );
}

export default App;
