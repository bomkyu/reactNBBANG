import React from 'react'
import {Outlet, Navigate} from 'react-router-dom'


/*
  React-route-dom v6부터 하위 컴포넌트를 랜더링 할려면 Outlet을 사용해야함
  Outlet 컴포넌트는 부모 <route> 컴포넌트 안에 있는 자식을 렌더링 할때 사용됨.
*/
// 세션에 ID가 있는지 체크하는 함수
const isAuthenticated = () => {
    return Boolean(sessionStorage.getItem('userID'));
  };
  
// 접근 제어 함수
const PrivateRoute = ({children}) => {
const isAuth = isAuthenticated();
if (!isAuth) {
    return <Navigate to="/" />;
}

return <Outlet/>;
};
export default PrivateRoute