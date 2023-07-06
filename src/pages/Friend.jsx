import React, { useEffect, useState } from 'react'
import FriendAdd from './FriendAdd';
import FriendList from './FriendList';
import {Insert, FriendSelect, Update, Delete } from '../Api/firebase';

const Friend = () => {
  const [tab, setTab] = useState('친구목록'); //탭
  const [allUser, setAllUser] = useState([]); //모든유저 정보
  const [inputValue, setInputValue] = useState(null); // input의 value값
  const [saerchData, setSearchData] = useState(null); // 검색결과 값
  const sessionId = sessionStorage.getItem('userID');

  //탭 
  const tabClickHandler = (v) => {
    setTab(v);
  }

  //onChange
  const onchangeInput = (e) => {
    const {value} = e.target;
    const friendRequestFilter = allUser.filter((param)=>{
      return(
        param.userName.includes(value) ||
        param.userNickName.includes(value) ||
        param.id.includes(value)
      )
    })
    setSearchData(friendRequestFilter);
  }

  //요청을 보낼 함수
  const RequestHandler = async (sort,id) => {
    switch (sort) {
      
      case 'send':
        const SendRequestObj = {
          sendFriend: sessionId,
          status: 'wait',
          requestFriend: id
        };
        await Insert('FriendRequest', SendRequestObj); // 문서 추가

        break;
      
      case 'accept':
        Update('FriendRequest', id, {status : 'accept'})
        break;

      case 'refusal':
        Delete('FriendRequest', id)
        break;
      default:
        break;
    }
  }

  //snapShot에서 Event가 있을 경우 콜백되는 함수
  const handleFriendData = (data) => {
   setAllUser(data);
  };

  const fetchData = async () => {
    let usersData = await FriendSelect(`${sessionId}`,handleFriendData);
    setAllUser(usersData);
  };



  useEffect(()=>{
    fetchData();
  }, [])


  const onClickRequestFunc = (v, id) => {
   switch (v) {
      case 'accept':
        RequestHandler(`${v}`,`${id}`);
        break;
      
      case 'send' : 
        RequestHandler(`${v}`,`${id}`);
        break;
      
      case 'refusal' : 
        RequestHandler(`${v}`,`${id}`);
      break;
      default:
        alert('에러발생!');
        break;
    }
    setSearchData(null);
  }


  return (
    <div className="content-wrap">
        <ul className="friend-tab">
            <li onClick={()=>tabClickHandler('친구목록')} className={tab === '친구목록' ? 'active' : ''}><p>친구목록</p></li>
            <li onClick={()=>tabClickHandler('친구추가')} className={tab === '친구추가' ? 'active' : ''}><p>친구추가</p></li>
        </ul>

        <div className="my-friend">
            {
              tab === '친구목록' ?
              <FriendList data={allUser} onClickRequestFunc={onClickRequestFunc}/> 
              :
              <FriendAdd onChange={onchangeInput} data={allUser} txt={inputValue} onClickRequestFunc={onClickRequestFunc} saerchData={saerchData}/> 
            }
        </div>
    </div>
  )
}

export default Friend