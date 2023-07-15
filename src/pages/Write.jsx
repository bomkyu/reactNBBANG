import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom';
import { FriendSelect, Insert, imageUpload, Select, Update } from '../Api/firebase';
import SearchLocationInput from '../Api/googlePlace';
import imageCompression from "browser-image-compression";
import {stringNumberToInt} from "../userFunc"

import {useNavigate} from "react-router-dom";
import Input from '../UI/Input'
import Modal from '../Modal/Modal'
import Nodata from '../UI/Nodata';

const Write = () => {
    const sessionId = sessionStorage.getItem('userID');
    const [myInfo, setMyInfo] = useState({})
    const [friend, setFriend] = useState([]);
    const [modal, setModal] = useState({isOpen : false, type : ''});
    const [inputs, setInputs] = useState(
        { 
            goDay : "2023-07-05",
            comeDay: "2023-08-05",
            friends: '',
            placeSearch: '',
            placePrice: '',
            taxPrice: ''
        });
    const [previewImage, setPreviewImage] = useState(null); //preivew
    const [saveImage, setSaveImage] = useState(null); //preivew
    const fileInput = useRef(null); //해당 돔을 선택하는것. javascript로는 querrySelector
    const {goDay, comeDay, friends, placeSearch, placePrice, taxPrice} = inputs;
    
    const navigate = useNavigate();

    let { sq } = useParams();

    //친구목록 가져오기
    const fetchData = async () => {
    
      const my = await Select('User', {field : 'id', operator : '==', value : sessionId })
      setMyInfo(my[0]);
      
      if(sq){
        const modifyData = await Select('Trip', {field : 'sq', operator : '==', value : sq })
        const { goDay, comeDay, friends, placeSearch, placePrice, taxPrice } = modifyData[0]
        setInputs({goDay, comeDay, placeSearch, placePrice, taxPrice})
        setFriend(friends.map((param)=>({...param, selected : true})))
      }else{
        const usersData = await FriendSelect(`${sessionId}`,handleFriendData);
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

    const submit = async (e) => {
        e.preventDefault();
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
                            <p className="date" id="go-date">06.20일</p>
                        </div>
                    </li>
                    <li>
                        <div className="date-selector-contain" onClick={()=>openModal('full')}>
                            <p className="title">오는날</p>
                            <p className="date" id="come-date">06.20일</p>
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
                                        <div className="img-thumb" style={{backgroundImage : `url(${param.imgUrl ? param.imgUrl : './images/img_user.png'})`}}></div>
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
                <button className="btn btn-st1" type="submit"><p>등록</p></button>
            </form>
            </div>  
            <Modal value={modal} data={friend} close={closeModal} onClick={onClickHandler}/>
        </>
    )
}

export default Write