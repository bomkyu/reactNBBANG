import React, { useEffect, useState } from 'react'
import {Select} from '../Api/firebase'

import NoData from '../UI/Nodata'
import Nodata from '../UI/Nodata';
/*
  firebase Cloud
  1. collection 구분 (firebase/firestore)
*/
const Main = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [tripInfo, setTripInfo] = useState(null);
  const { 
          sq,
          goDay, 
          comeDay,
          friends,
          manager,
          placeSearch : {address, location : {lat, lng}, name},
          placePrice,
          TaxImg 
        } = tripInfo
  const sessionId = sessionStorage.getItem('userID');
  
  const getUserInfo = async () => {
    const my = await Select('User', {field : 'id', operator : '==', value : sessionId })
    setUserInfo(my[0]);

    const trip = await Select('Trip');
    const tripFilter = trip.filter((param)=>{
      if(param.manager === sessionId || param.friends.some((some)=>some.id === sessionId)){
        return param
      }
      return null
    })
    setTripInfo(tripFilter[0]);
  }

  useEffect(()=>{
    getUserInfo();
  },[])


  return (
    <div className="content-wrap">
        <div className="user-info">
        {userInfo && (
          <dl>
              <dt>
                  <div className="img-wrap">
                      <div className="img-thumb" style={{backgroundImage : `url(${userInfo.imgUrl ? userInfo.imgUrl : './images/img_user.png'})`}}></div>
                  </div>
              </dt>
              <dd>
                  <p>
                      안녕하세요. {userInfo.userName}님,<br/>
                      친구들과 신나게 놀아봐요!
                  </p>
              </dd>
          </dl>
          )}
        </div>
        
          {
            tripInfo === null ?
            <NoData txt="일정을 추가해봐요!"/>
            :
            
            <div className="contain" key={sq}>
                <h2 class="title mt-20">일정</h2>
                <ul className="date-selector">
                  <li>
                      <div className="date-selector-contain">
                          <p className="title">가는날</p>
                          <p className="date">{goDay}</p>
                      </div>
                  </li>
                  <li>
                      <div className="date-selector-contain">
                          <p className="title">오는날</p>
                          <p className="date">{comeDay}</p>
                      </div>
                  </li>
                </ul>
                <h2 class="title">인원</h2>
                <ul className="user_list" style={{marginTop:'20px'}}>
                {
                    friends.map((param) => (
                        <li key={param.id}>
                            <div className="img-wrap">
                                <div className="img-thumb" style={{backgroundImage : `url(${param.imgUrl ? param.imgUrl : './images/img_user.png'})`}}></div>
                            </div>
                            <p>{param.userName}</p>
                        </li>
                    ))
                }
                </ul>
                <h2 className="title">숙소</h2>
                <p>{lat}</p>
                <p>{lng}</p>
                <dl className="location-info">
                    <dt>이름 : </dt>
                    <dd>{name}</dd>
                </dl>
                <dl className="location-info">
                    <dt>주소 : </dt>
                    <dd>{address}</dd>
                </dl>
                <dl className="location-info">
                    <dt>가격 : </dt>
                    <dd>{placePrice}</dd>
                </dl>
                <h2 className="title">영수증</h2>
                { TaxImg ? <img src={TaxImg} alt="영수증 이미지"/> : <Nodata txt='아직 이미지가 없어요!'/> }
                <h2 class="txt-box1">총금액 : {}원</h2>
                <h2 class="txt-box1">인당금액 : {}원</h2>
            </div>
          }
      </div>
  )
}

export default Main