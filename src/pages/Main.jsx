import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import {Select, Delete} from '../Api/firebase'


import Nodata from '../UI/Nodata';
import TextBox from '../UI/TextBox';
import ContentRow from '../UI/ContentRow';
import Spinner from '../UI/Spinner';
import GoogleMap from '../Api/GoogleMap';

const Main = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [tripInfo, setTripInfo] = useState(null);
  const [showSpinner, setShowSpinner] = useState(true);
  const [showMap, setShowMap] = useState(true); //구글맵
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
  const navigate = useNavigate();
  const tripCallback = () =>{
    setTripInfo(null);
  }

  const getUserInfo = async () => {
    const my = await Select('User', {field : 'id', operator : '==', value : sessionId })
    setUserInfo(my[0]);

    const trip = await Select('Trip');
    const tripFilter = trip.filter((param)=>{
      if(param.manager.id === sessionId || param.friends.some((some)=>some.id === sessionId)){
        return param
      }
      return null;
    })
    
    if(tripFilter.length !== 0){
      setTripInfo(tripFilter[0]);
    }
    setShowSpinner(false);
  }

  const calculationAmount = (sort) => {
    switch (sort) {
      case 'all':
        return Math.floor(placePrice + taxPrice);
      case 'one' :
        return Math.floor((placePrice + taxPrice) / (friends.length + 1))
      default:
        return 'error';
    }
  }

  useEffect(()=>{
    getUserInfo();
    setShowMap(true);
    return ()=>{
      setShowMap(false); //화면이 언마운트 되면 구글맵 안보여줌
    }
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
                      <div className="img-thumb" style={{backgroundImage : `url(${userInfo.imgUrl ? userInfo.imgUrl : '../images/img_user.png'})`}}></div>
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
              tripInfo === null && (<Nodata txt="일정이 없어요!"/>)
            }
            {
              tripInfo &&
              (
              <div className="contain" key={sq}>
                  {
                  manager.id === sessionId && 
                  <div className='utill-btn-wrap'>
                    <ul>
                      <li onClick={()=>navigate(`/modify/${sq}`)}>

                      </li>
                      <li onClick={()=>Delete('Trip', sq, tripCallback)}>

                      </li>
                    </ul>
                  </div>
                  }
                  
                  <h2 className="title mt-20">일정</h2>
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
                  <h2 className="title">인원</h2>
                  <ul className="user_list">
                  {
                    <li className='king' key={manager.id}>
                      <div className="img-wrap">
                          <div className="img-thumb" style={{backgroundImage : `url(${manager.imgUrl ? manager.imgUrl : '../images/img_user.png'})`}}></div>
                      </div>
                      <p>{manager.userName}</p>
                    </li>
                  }
                  {
                      friends && friends.map((param) => (
                          <li key={param.id}>
                              <div className="img-wrap">
                                  <div className="img-thumb" style={{backgroundImage : `url(${param.imgUrl ? param.imgUrl : '../images/img_user.png'})`}}></div>
                              </div>
                              <p>{param.userName}</p>
                          </li>
                      ))
                  }
                  </ul>
                  <h2 className="title">숙소</h2>
                  {showMap && <GoogleMap location={{lat,lng}}/>}
                  
                  <ContentRow title={'이름'} text={name}/>
                  <ContentRow title={'주소'} text={address}/>
                  <ContentRow title={'가격'} text={placePrice.toLocaleString()+'원'}/>
                  
                  <h2 className="title">영수증</h2>
                  { TaxImg ? <div className='img-thumb-box'><img src={TaxImg} alt="영수증 이미지"/></div> : <Nodata txt='아직 이미지가 없어요!'/> }
                  <ContentRow title={'금액'} text={taxPrice.toLocaleString()+'원'}/>

                  <TextBox title={'총금액'} text={`${calculationAmount('all').toLocaleString()}원`}/>
                  <TextBox title={'인당금액'} text={`${calculationAmount('one').toLocaleString()}원`}/>
              </div>
            )
          }
      </div>
  )
}

export default Main