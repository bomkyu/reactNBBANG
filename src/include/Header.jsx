import React from 'react'
import { useNavigate } from 'react-router-dom'
const Header = () => {
  const navigate = useNavigate();

  const logOut = () => {
    sessionStorage.removeItem('userID');
    navigate('/', { replace: false });
  }
  return (
    <header>
      <h1>
        <img src="../images/ic_logo.svg" alt="로고"/>
      </h1>
      <p className="logout" onClick={logOut}>
        <img src="../images/ic_logout.png" alt="로그아웃 아이콘"/>
      </p>
    </header>
  )
}

export default Header