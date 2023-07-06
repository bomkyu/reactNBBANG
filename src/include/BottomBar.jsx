import React from 'react'
import { NavLink } from 'react-router-dom' //NavLink를 사용하면 path에 따라서 class를 추가해 줄 수 있다.
const BottomBar = () => {
  return (
    <div className="bt_bar">
      <ul>
          <li>
          <NavLink
            to="/main"
            className={({isActive, isPending}) => {
              return isPending ? 'link-home' : isActive ? 'link-home active' : 'link-home';
            }}
          />
          </li>
          <li>
            <NavLink to="/write" className={({isActive, isPending}) => {
              return isPending ? 'link-write' : isActive ? 'link-write active' : 'link-write'
            }} >
            </NavLink>
          </li>
          <li>
            <NavLink to="/friend" className={({isActive, isPending}) => {
              return isPending ? 'link-friend' : isActive ? 'link-friend active' : 'link-friend'
            }} >
            </NavLink>
          </li>
      </ul>
    </div>
  )
}

export default BottomBar