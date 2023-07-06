import React, { useEffect, useState } from 'react'
import { collection, query, getDocs, where } from "firebase/firestore";
import {db} from '../Api/firebase'
/*
  firebase Cloud
  1. collection 구분 (firebase/firestore)
*/
const Main = () => {
  const [userInfo, setUserInfo] = useState(null);
  const sessionId = sessionStorage.getItem('userID');
  
  const getUserInfo = async () => {
    const q = query(collection(db, 'User'), where("id", "==", sessionId));
    const querrySelector = await getDocs(q)
    querrySelector.forEach(doc => {
      setUserInfo(doc.data())
    });
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
        <div className="contain">
          
        </div>
    </div>
  )
}

export default Main