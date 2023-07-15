import { Routes, Route, Navigate, useLocation  } from 'react-router-dom'
import React from 'react'
import Header from './include/Header'
import BottomBar from './include/BottomBar'
import Login from './pages/Login';
import Register from './pages/Register';
import Friend from './pages/Friend';
import View from './pages/View';
import Write from './pages/Write';
import Main from './pages/Main';
// 사용자 인증 여부를 확인하는 함수
const isAuthenticated = () => {
  return false;
};

// 프라이빗 라우트 컴포넌트
function PrivateRoute({ path, element }) {
  return isAuthenticated() ? (
    <Route path={path} element={element} />
  ) : (
    <Navigate to="/login" replace={true} />
  );
}

function App() {
  let location = useLocation();
  return (
    <div className="App">
      {location.pathname !== '/' && location.pathname !== '/register' && <Header/>} {/*useLocation을 이용해서 Login, register페이지 header렌더링 안되게 분기처리*/}
        <Routes>
          <Route path='/' element={<Login/>} />
          <Route path='/register' element={<Register/>} />
          <Route path='/main' element={<Main/>} />
          <Route path='/friend' element={<Friend/>} />
          <Route path='/view' element={<View/>} />
          <Route path='/write' element={<Write/>} />
          <Route path="/modify/:sq" element={<Write/>} />
        </Routes>
      {location.pathname !== '/' && location.pathname !== '/register' && <BottomBar/>} {/*useLocation을 이용해서 Login, register페이지 header렌더링 안되게 분기처리*/}
    </div>
  );
}

export default App;
