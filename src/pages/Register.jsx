import React, {useState, useRef, useEffect} from 'react'
import Input from '../UI/Input'
import {useNavigate} from "react-router-dom";
import {imageUpload, Insert, Select} from '../Api/firebase';
import imageCompression from "browser-image-compression";

const Register = () => {
  const [previewImage, setPreviewImage] = useState(null); //preivew
  const [saveImage, setSaveImage] = useState(null); //save
  const fileInput = useRef(null); //해당 돔을 선택하는것. javascript로는 querrySelector
  const [user, setUser] = useState(null); //필드 검사할 State
  const navigate = useNavigate();
  const [formFields, setFormFields] = useState([
    { sq: 0, id: 'id', txt:'아이디', ex:'영어와 숫자를 조합하여 9글자이상', value: '', type:'text' },
    { sq: 1, id: 'password1', txt:'패스워드', ex:'영어, 숫자, 특수문자를 조합하여 9글자 이상', value: '', type:'password' },
    { sq: 2, id: 'password2', txt:'패스워드', ex:'패스워드를 다시 입력해 주세요.', value: '', type:'password' },
    { sq: 3, id: 'name', txt:'이름', ex:'', value: '', type:'text' },
    { sq: 4, id: 'nickname', txt:'닉네임', ex:'영어만 사용할 수 있고 특수문자는 언더스코어만 사용가능', value: '', type:'text' },
  ]);

  //정규식
  const validationRules = {
    id:/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
    password1:/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/,
    name:/^[a-zA-Z가-힣]+$/,
    nickname:/^[A-Za-z][_A-Za-z]{3,}$/
  }
  const fetchData = async () => {
    const data = await Select('User');
    const filteredData = data.map((param) => param.id);

    setUser(filteredData);
  }
  useEffect(() => {
    fetchData();
  }, []);
  
  const onChangeHandler = async (e) => {
    const {id, value} = e.target;

    setFormFields((prevFormFields) =>
      prevFormFields.map((field) => {
        if (field.id === id) {
          const regex = validationRules[id];
          const error = regex && regex.test(value); // 해당 필드의 정규식이 있을 경우에만 검사
          
          //id필드인지 확인
          if(id === 'id') {
            if(user.includes(value)){
              return {
                ...field,
                value,
                check: false, // password1과 password2가 일치하는 경우에만 check: true를 추가합니다.
              };
            }
          }

          // password2 필드인지 확인합니다.
          if (id === 'password2') {
            // password1 필드를 찾습니다.
            const password1Field = prevFormFields.find((f) => f.id === 'password1');

            // 값을 비교
            const check = password1Field.value === value;

            return {
              ...field,
              value,
              check: check ? true : false, // password1과 password2가 일치하는 경우에만 check: true를 추가합니다.
            };
          }

          return {
            ...field,
            value,
            check : error,
          };
        }
        return field;
      })
    );
  }
  //이미지 정보를 얻는 핸들러.
  const fileChangeHandler = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const options = {
        maxSizeMB: 0.2, // 이미지 최대 용량
        maxWidthOrHeight: 1920, // 최대 넓이(혹은 높이)
        useWebWorker: true,
      };
      try {
        const compressedFile = await imageCompression(file, options);
        setSaveImage(compressedFile);
        const promise = imageCompression.getDataUrlFromFile(compressedFile);
        promise.then((result) => {
          setPreviewImage(result);
        })
      } catch (error) {
        alert(error+'발생!');
      }
    }
  }
  //type file인 input을 실행
  const fileUploadHandler = () => {
    fileInput.current.click();
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formFieldsCheck = formFields.every((param)=> param.check === true);
    if(!formFieldsCheck){
      alert('입력폼을 확인해 주세요.');
      return
    }
    const userJson = {
        "id": formFields[0].value.trim(),
        "passWord": formFields[1].value.trim(),
        "userName": formFields[3].value.trim(),
        "userNickName": formFields[4].value.trim(),
        "imgUrl" : null,
    }
    if(saveImage !== null){ //이미지가 Null이 아닐때
      imageUpload(saveImage)
      .then(url => {
        userJson.imgUrl = url
        
        Insert('User', userJson);
      })
      .catch((error) => {
        return alert(`에러발생!${error}`)
      });
    }else{ //이미지가 Null일때
      Insert('User', userJson);
    }
    sessionStorage.setItem('userID', formFields[0].value.trim());
    navigate('/main', { replace: true });
  }
  return (
    <div className="login-wrap">
        <form method="post" onSubmit={handleSubmit}>
            <h1 className="login-tit">회원가입</h1>
            <div className="file-upload">
                <div className="img-wrap" onClick={fileUploadHandler}>
                  <input type="file" className="real-upload" onChange={fileChangeHandler} ref={fileInput} accept="image/*" style={{ display: 'none' }} /> {/* onChangeHandler에서 file이 있을경우 setPreviewImage에 이미지담고  */}
                  <div className="img-thumb" style={{backgroundImage : `url(${previewImage ? previewImage : './images/img_user.png'})`}}></div> {/* 여기서 previewImage가 있을경우 bash64로 이미지 preview 해주거나 기본 이미지 보여줌. */}
                </div>
            </div>
            {formFields.map((filed)=> (
              <div key={filed.sq} className="input-st-wrap">
                <Input txt={filed.txt} id={filed.id} inputType={filed.type} onChange={onChangeHandler}/>
                {filed.ex && <p className='ex'>{filed.ex}</p>}
                {<span className={`check ${filed.check === true ? 'true' : filed.check === false ? 'false' : ''}`}></span>}
              </div>
            ))}
            <button className="btn btn-st1" type="submit"><p>회원가입</p></button>
        </form>
    </div>
  )
}

export default Register