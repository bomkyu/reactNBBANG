import React, {useState} from 'react'
import Input from '../UI/Input'
import { Link, useNavigate } from 'react-router-dom' //Script로 path지정해줄려면 useNavigate Hook을 써야함
import { collection, query, where, getDocs } from "firebase/firestore";
import {db} from '../Api/firebase'

const Login = () => {
  const navigate = useNavigate();
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(id === '' || password === ''){
      alert('얘! 아이디나 패스워드좀 확인하렴!')
      return;
    }

    try {
      const myCollection = collection(db, "User");
      const q = query(myCollection, where("id", "==", id));
    
      const querySnapshot = await getDocs(q);
    
      querySnapshot.forEach((doc) => {
        // 각 문서에 대한 처리 로직
        if(doc.data().id === id && doc.data().passWord === password){
          sessionStorage.setItem('userID', doc.data().id);
          navigate('/main', { replace: true });
        }else{
          alert('얘! 아이디나 패스워드좀 확인하렴!');
        }
      });
    } catch (error) {
      alert(`에러발생${error} 관리자에게 문의하세요.`)
    }
  };

  const onChangeHandler = (e) => {
    if(e.target.id === 'id'){
      setId(e.target.value);
    }else{
      setPassword(e.target.value);
    }
    
  }

  return (
    <>
      <div className="login-wrap">
          <form method="post" onSubmit={handleSubmit}>
              <h1 className="login-tit">로그인</h1>
              <div className="input-st-wrap">
                <Input txt="아이디" id="id" inputType="text" onChange={onChangeHandler}/>
              </div>

              <div className="input-st-wrap">
                <Input txt="패스워드" id="pw" inputType="password" onChange={onChangeHandler}/>
              </div>

              <button className="btn btn-st1" type="submit"><p>로그인</p></button>
              <Link className="btn btn-st1" to='/register'><p>회원가입</p></Link>
          </form>
      </div>
    </>
  )
}

export default Login