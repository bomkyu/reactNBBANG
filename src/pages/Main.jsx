import React, { useEffect, useState } from 'react'
import {Select} from '../Api/firebase'

import NoData from '../UI/Nodata'
import Nodata from '../UI/Nodata';
import TextBox from '../UI/TextBox';
import ContentRow from '../UI/ContentRow';
import Spinner from '../UI/Spinner';
import GoogleMap from '../Api/GoogleMap';
/*
  firebase Cloud
  1. collection 구분 (firebase/firestore)
*/
const Main = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [tripInfo, setTripInfo] = useState(null);
  const [showSpinner, setShowSpinner] = useState(true);
  const { 
          sq,
          goDay, 
          comeDay,
          friends = [],
          manager = {},
          placeSearch : { address, location : {lat, lng} = {}, name } = {},
          placePrice = 0,
          taxPrice = 0,
          TaxImg 
        } = tripInfo || {}
  const sessionId = sessionStorage.getItem('userID');
  
  const getUserInfo = async () => {
    const my = await Select('User', {field : 'id', operator : '==', value : sessionId })
    setUserInfo(my[0]);

    const trip = await Select('Trip');
    const tripFilter = trip.filter((param)=>{
      if(param.manager.id === sessionId || param.friends.some((some)=>some.id === sessionId)){
        return param
      }
      return null
    })
    setTripInfo(tripFilter[0]);
    setShowSpinner(false);
  }

  const calculationAmount = (sort) => {
    switch (sort) {
      case 'all':
        return placePrice + taxPrice;
      case 'one' :
        return (placePrice + taxPrice) / (friends.length + 1)
      default:
        return 'error';
    }
  }

  useEffect(()=>{
    getUserInfo();
  },[])


  return (
    <div className="content-wrap">
        <>
          {showSpinner && (<Spinner/>)}
        </>
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
              tripInfo &&

              tripInfo === null ? (<Nodata/>)
              :
              (
              <div className="contain" key={sq}>
                  {
                  manager === sessionId && 
                  <div className='utill-btn-wrap'>
                    
                  </div>
                  }
                  
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
                  <ul className="user_list">
                  {
                    <li className='king' key={manager.id}>
                      <div className="img-wrap">
                          <div className="img-thumb" style={{backgroundImage : `url(${manager.imgUrl ? manager.imgUrl : './images/img_user.png'})`}}></div>
                      </div>
                      <p>{manager.userName}</p>
                    </li>
                  }
                  {
                      friends && friends.map((param) => (
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
                  <GoogleMap location={{lat,lng}}/>
                  <ContentRow title={'이름'} text={name}/>
                  <ContentRow title={'주소'} text={address}/>
                  <ContentRow title={'가격'} text={placePrice.toLocaleString()+'원'}/>
                  
                  <h2 className="title">영수증</h2>
                  { TaxImg ? <img src={TaxImg} alt="영수증 이미지"/> : <Nodata txt='아직 이미지가 없어요!'/> }

                  <TextBox title={'총금액'} text={`${calculationAmount('all').toLocaleString()}원`}/>
                  <TextBox title={'인당금액'} text={`${calculationAmount('one').toLocaleString()}원`}/>
              </div>
            )
          }
      </div>
  )
}

export default Main