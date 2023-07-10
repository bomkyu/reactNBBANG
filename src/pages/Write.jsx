import React, { useEffect, useState } from 'react'
import Input from '../UI/Input'
import Modal from '../Modal/Modal'
import {FriendSelect } from '../Api/firebase';
const Write = () => {
    const sessionId = sessionStorage.getItem('userID');
    const [friend, setFriend] = useState([]);
    const [selectFriend, setSelectFriend] = useState([]);
    const [modal, setModal] = useState({isOpen : false, type : ''});
    const [inputs, setInputs] = useState({ goDay : "2023-07-05", comeDay: "2023-08-05", friends: '', placeSearch: '', placePrice: '', taxPrice: ''});
    const {goDay, comeDay, friends, placeSearch, placePrice, taxPrice} = inputs;

    const fetchData = async () => {
      let usersData = await FriendSelect(`${sessionId}`,handleFriendData);
      filterFriend(usersData);
    };

    //snapShot에서 Event가 있을 경우 콜백되는 함수
    const handleFriendData = (data) => {
        filterFriend(data);
    };

    const filterFriend = (data) => {
        const filterFriends = data
        .filter((param) => param.request?.status === 'accept' && param.request?.status !== null)
        .map((param) => ({ ...param, selected: false}));
        setFriend(filterFriends);
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
        console.log(value);
        setInputs({
            ...inputs,
            [id] : value
        })
    }

    const onClickHandler = (id) => {
        console.log(id);
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
    }
    
    const placeSearchClick = () => {
        if(placeSearch === ''){
            return alert('검색어를 입력해주세요.')
        }
    }

    const submit = (e) => {
        e.preventDefault();
        alert(`goDay : ${goDay}, comeDay : ${comeDay}, friends : ${friends}, placeSearch : ${placeSearch}, placePrice : ${placePrice}, taxPrice : ${taxPrice}`);
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
                            <input type="text" id="goDay" name="goDay" style={{display:'none'}} />
                        </div>
                    </li>
                    <li>
                        <div className="date-selector-contain" onClick={()=>openModal('full')}>
                            <p className="title">오는날</p>
                            <p className="date" id="come-date">06.20일</p>
                            <input type="text" id="comeDay" name="comeDay" style={{display:'none'}}/>
                        </div>
                    </li>
                </ul>
                <section className="sec1">
                    <h2 className="title">인원</h2>
                    <a className="btn btn-st1" onClick={()=>openModal('h_80')}><span className="plus"></span></a>
                    {
                        filteredFriends.length > 0 ?
                        <ul class="user_list" style={{marginTop:'20px'}}>
                        {
                            filteredFriends.map((param) => (
                                <li onClick={()=>onClickHandler(param.id)}>
                                    <div className="img-wrap">
                                        <div className="img-thumb" style={{backgroundImage : `url(${param.imgUrl ? param.imgUrl : './images/img_user.png'})`}}></div>
                                    </div>
                                    <p>{param.userName}</p>
                                </li>
                            ))
                        }
                        </ul>
                        :
                        <p>친구를 추가해 주세요!</p>
                    }
                    <input type="text" id="friends" name="friends" style={{display:'none'}}/>
                </section>
                <section className="sec2">
                    <h2 className="title">숙소</h2>
                    <label className="input-st search" name="placeSearch">
                        <input type="text" id="placeSearch" name="placeSearch" onChange={onChangeHandler} placeholder='검색어를 입력해 주세요.'/>
                        <a className="search-btn" onClick={placeSearchClick}></a>
                    </label>
                    <div className="input-st-wrap">
                        <Input txt="숙소가격" id="placePrice" name="placePrice" onChange={onChangeHandler} inputType="text"/>
                    </div>
                    <div id="results"></div>
                </section>
                <section className="sec3">
                    <h2 className="title">영수증</h2>
                    <div className="file-upload">
                        <div className="tax-img">
                            <input type="file" className="real-upload" accept="image/*" style={{display:'none'}}/>
                            <div className="img-thumb"></div>
                        </div>
                    </div>
                    <div className="input-st-wrap">
                        <Input txt="구매 물품 가격" id="taxPrice" onChange={onChangeHandler} inputType="tel"/>
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