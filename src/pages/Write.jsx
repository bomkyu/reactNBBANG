import React, { useEffect, useState, useRef } from 'react'
import { useNavigate, Link, useParams } from 'react-router-dom';
import { FriendSelect, Insert, imageUpload, Select, Update } from '../Api/firebase';
import { addDays, parseISO } from "date-fns"
import SearchLocationInput from '../Api/googlePlace';

import imageCompression from "browser-image-compression";

import {stringNumberToInt, dateFormant} from "../userFunc"

import Input from '../UI/Input'
import Modal from '../Modal/Modal'
import Nodata from '../UI/Nodata';

const Write = () => {
    const sessionId = sessionStorage.getItem('userID');
    const navigate = useNavigate();
    let { sq } = useParams();

    const [myInfo, setMyInfo] = useState({})
    const [friend, setFriend] = useState([]);
    const [modal, setModal] = useState({isOpen : false, type : ''});
    const [inputs, setInputs] = useState(
        { 
            goDay : dateFormant(new Date()),
            comeDay: dateFormant(addDays(new Date(), 1)),
            friends: '',
            placeSearch: null,
            placePrice: '',
            taxPrice: '0'
        });
    const [previewImage, setPreviewImage] = useState(null); //preivew
    const [saveImage, setSaveImage] = useState(null); //saveImage
    const fileInput = useRef(null); //해당 돔을 선택하는것. javascript로는 querrySelector
    const {goDay, comeDay, friends, placeSearch, placePrice, taxPrice} = inputs;
    
     //데이터 가져오는 함수
     const fetchData = async () => {
    
        const my = await Select('User', {field : 'id', operator : '==', value : sessionId })
        if(!sq){
            const trip = await Select('Trip')
            const tripInfo = trip.filter(param => {
                const hasMyId = param.manager.id === sessionId || (param.friends.some(p => p.id === sessionId));
                return hasMyId;
            });
            if(tripInfo.length != 0 ){
                alert('이미 일정이 있어요');
                return navigate(-1);
            }
        }
        const usersData = await FriendSelect(`${sessionId}`,handleFriendData);
        setMyInfo(my[0]);
        
        if(sq){
          const modifyData = await Select('Trip', {field : 'sq', operator : '==', value : sq })
          const { goDay, comeDay, friends, placeSearch, placePrice, taxPrice, TaxImg } = modifyData[0]
          setInputs(
              {
                  goDay,
                  comeDay,
                  placeSearch,
                  placePrice : placePrice.toLocaleString(),
                  taxPrice : taxPrice.toLocaleString()
              }
          ) //인풋 정보
          setPreviewImage(TaxImg) //Priview이미지
          const filterFriends = usersData
          .filter((param) => param.request?.status === 'accept' && param.request?.status !== null)
          .map((param) => { 
              const isFriendSelected = friends.some((user) => param.id === user.id);
              return {
              ...param,
              selected: isFriendSelected,
              };
          });
          setFriend(filterFriends)
        }else{
          filterFriend(usersData);
        }
      };
      
    //snapShot에서 Event가 있을 경우 콜백되는 함수
    const handleFriendData = (data) => {
        filterFriend(data);
    };

    //친구목록 가져오는 함수
    const filterFriend = (data) => {
        const filterFriends = data
        .filter((param) => param.request?.status === 'accept' && param.request?.status !== null)
        .map((param) => ({ ...param, selected: false}));
        setFriend(filterFriends); //친구 스테이트
    }

    useEffect(()=> {  

        //일정이 있을경우 메인페이지로 이동
        fetchData();
        
    }, [])
    
    const openModal = (type) => {
        setModal((prevState) => ({
            ...prevState,
            type : type,
            isOpen: !prevState.isOpen
        }));
    }

    const closeModal = () => {
        setModal(modal.isOpen = false);
    }

    const onChangeHandler = (e) => {
        const {id, value} = e.target

        let formattedValue = value; //천단위마다 콤마
        if (id === "placePrice" || id === "taxPrice") {
            const numberValue = Number(value.replace(/[^0-9.-]+/g, ""));
            if (!isNaN(numberValue)) {
              formattedValue = numberValue.toLocaleString();
            }
        }

        setInputs({
            ...inputs,
            [id] : formattedValue
        })
    }

    const onClickHandler = (id) => {
        const updatedFriends = friend.map((param) => {
            if (param.id === id) {
              return {
                ...param,
                selected: !param.selected  // selected 프로퍼티를 반전시킴
              };
            }
            return param;
          });
        setFriend(updatedFriends);
        
        const updateFriendsFilter = updatedFriends.filter(param => param.selected === true).map(param=>({id : param.id, userName : param.userName, imgUrl : param.imgUrl}));
        setInputs({...inputs, friends : updateFriendsFilter});
    }

    //달력에서 전달받은 날짜.
    const dateChangeHandler = (date) => {
        
        const { startDate, endDate } = date[0];
        setInputs((param)=>({ ...param, goDay : dateFormant(startDate), comeDay : dateFormant(endDate)}))
    }
    
    //googlePlace에서 받아온 데이터 함수
    const placeInformation = (data) => {
        const {
            formatted_address, 
            geometry: { location },
            name
        } = data
        let lat = location.lat();
        let lng = location.lng();

        const locationObj = {
            address : formatted_address,
            location : {lat, lng},
            name : name
        }
        setInputs((prevParam) => ({...prevParam, placeSearch: locationObj}))
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

    const exceptionHandler = () => {
        if (goDay === '' || comeDay === '') {
            return '날짜를 선택해 주세요.';
        }
        if (friend.length === 0) {
            return '친구를 선택해 주세요.';
        }
        if (placeSearch === '') {
            return '숙소를 선택해 주세요.';
        }
        if (placePrice === '') {
            return '숙소의 금액을 입력해 주세요.';
        }
        if (previewImage !== null){
            if(taxPrice === '0'){
                return '영수증 금액을 입력해 주세요.';
            }
        }
        return null;
    }

    const submit = async (e) => {
        e.preventDefault();
        const exceptionMessage = exceptionHandler();
        if (exceptionMessage) {
            alert(exceptionMessage);
            return;
        }
        const obj = {...inputs,
            placePrice : stringNumberToInt(placePrice),
            taxPrice : stringNumberToInt(taxPrice),
            manager : {
                id : myInfo.id,
                imgUrl : myInfo.imgUrl,
                userName : myInfo.userName,
            },
            TaxImg : null
        }
        if(saveImage !== null){ //이미지가 Null이 아닐때
            imageUpload(saveImage)
            .then(url => {
                obj.TaxImg = url
                if(!sq){
                    return Insert('Trip', obj);
                }else{
                    return Update('Trip', sq , obj);
                }
            })
            .then(()=>{
                navigate('/main', { replace: true });
            })
            .catch((error)=>{return alert(`에러발생! ${error}`)});
          }else{ //이미지가 Null일때
            if(!sq){
                return Insert('Trip', obj)
                .then(()=> {
                    navigate('/main', { replace: true });
                })
                .catch((error)=>{return alert(`에러발생! ${error}`)});
            }else{
                obj.TaxImg = previewImage
                return Update('Trip', sq , obj)
                .then(()=> {
                    navigate('/main', { replace: true });
                })
                .catch((error)=>{return alert(`에러발생! ${error}`)});
            }
            
          }
    }

    //선택된 친구 필터링하는 변수
    const filteredFriends = friend.filter((param) => param.selected);
    return (
        <>
            <div className="content-wrap">
                <form method="post" onSubmit={submit}>
                <ul className="date-selector">
                    <li>
                        <div className="date-selector-contain" onClick={()=>openModal('full')}>
                            <p className="title">가는날</p>
                            <p className="date" id="go-date">{goDay}</p>
                        </div>
                    </li>
                    <li>
                        <div className="date-selector-contain" onClick={()=>openModal('full')}>
                            <p className="title">오는날</p>
                            <p className="date" id="come-date">{comeDay}</p>
                        </div>
                    </li>
                </ul>
                <section className="sec1">
                    <h2 className="title">인원</h2>
                    <a className="btn btn-st1" onClick={()=>openModal('h_80')}><span className="plus"></span></a>
                    {
                        filteredFriends.length > 0 ?
                        <ul className="user_list">
                        {
                            filteredFriends.map((param) => (
                                <li onClick={()=>onClickHandler(param.id)} key={param.id}>
                                    <div className="img-wrap">
                                        <div className="img-thumb" style={{backgroundImage : `url(${param.imgUrl ? param.imgUrl : '../images/img_user.png'})`}}></div>
                                    </div>
                                    <p>{param.userName}</p>
                                </li>
                            ))
                        }
                        </ul>
                        :
                        <Nodata txt='친구를 추가해 주세요!'/>
                    }
                </section>
                <section className="sec2">
                    <h2 className="title">숙소</h2>
                    <SearchLocationInput onChange={() => null} queryCallback={placeInformation}/>
                    {
                        placeSearch != null ?
                        <div className='lodging-list'>
                            <p className='title'>{placeSearch.name}</p>
                            <p className='address'>{placeSearch.address}</p>
                        </div>
                        :
                        <Nodata txt='숙소를 선택해 주세요!'/>
                    }
                    <div className="input-st-wrap">
                        <Input txt="숙소가격" id="placePrice" name="placePrice" onChange={onChangeHandler} inputType="text" value={placePrice}/>
                    </div>
                </section>
                <section className="sec3">
                    <h2 className="title">영수증</h2>
                    <div className="file-upload" onClick={fileUploadHandler}>
                        <div className="tax-img">
                            <input type="file" className="real-upload" onChange={fileChangeHandler} ref={fileInput} accept="image/*" style={{ display: 'none' }} /> {/* onChangeHandler에서 file이 있을경우 setPreviewImage에 이미지담고  */}
                        </div>
                        {
                            previewImage && <div className='img-thumb-box'><img src={previewImage} alt="영수증 이미지 입니다."/></div>
                        }
                    </div>
                    <div className="input-st-wrap">
                        <Input txt="구매 물품 가격" id="taxPrice" onChange={onChangeHandler} inputType="text" value={taxPrice}/>
                    </div>
                </section>
                <button className="btn btn-st1" type="submit"><p>{sq ? '수정' : '등록'}</p></button>
                <Link className="btn btn-st1" to='/main'><p>취소</p></Link>
            </form>
            </div>
            
            {<Modal value={modal} data={friend} close={closeModal} onClick={onClickHandler} dateChange={dateChangeHandler} date={[{startDate:parseISO(goDay), endDate:parseISO(comeDay), key:'selection'}]}/>}
        </>
    )
}

export default Write