import { Routes, Route, useLocation  } from 'react-router-dom'
import React from 'react'
import PrivateRoute from './pages/PrivateRoute'
import Header from './include/Header'
import BottomBar from './include/BottomBar'
import Login from './pages/Login';
import Register from './pages/Register';
import Friend from './pages/Friend';
import Write from './pages/Write';
import Main from './pages/Main';


function App() {
  let location = useLocation();
  return (
    <div className="App">
      {location.pathname !== '/' && location.pathname !== '/register' && <Header/>} {/*useLocation을 이용해서 Login, register페이지 header렌더링 안되게 분기처리*/}
        <Routes>
          <Route path='/' element={<Login/>} />
          <Route path='/register' element={<Register/>} />

          {/* 
            PrivateRoute사용할려면 기존 Route컴포넌트에 개별적으로 넣어줬던것에서 <PrivateRouter path="/write" element={<Write />}/>
            react-router-dom V6에서는
            상위 Route컴포넌트에 PrivateRoute 컴포넌트를 선언해주고
            하위에 자식 컴포넌트를 넣어야한다.
          */}
          <Route element={<PrivateRoute/>}>
            <Route path="/main" element={<Main />}/>
            <Route path="/friend" element={<Friend />}/>
            <Route path="/write" element={<Write />}/>
            <Route path="/modify/:sq" element={<Write />}/>
          </Route>
        </Routes>
      {location.pathname !== '/' && location.pathname !== '/register' && <BottomBar/>} {/*useLocation을 이용해서 Login, register페이지 header렌더링 안되게 분기처리*/}
    </div>
  );
}

export default App;
