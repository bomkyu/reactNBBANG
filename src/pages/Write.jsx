import React, { useEffect, useState } from 'react'
import Input from '../UI/Input'
import Modal from '../Modal/Modal'
const Write = () => {
    const [modal, setModal] = useState({isOpen : false, type : ''});
    const [inputs, setInputs] = useState({ goDay : "2023-07-05", comeDay: "2023-08-05", friends: '', placeSearch: '', placePrice: '', taxPrice: ''});
    const {goDay, comeDay, friends, placeSearch, placePrice, taxPrice} = inputs
    
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
    
    const placeSearchClick = () => {
        if(placeSearch === ''){
            return alert('검색어를 입력해주세요. 제발..')
        }
    }

    


    const submit = (e) => {
        e.preventDefault();
        alert(`goDay : ${goDay}, comeDay : ${comeDay}, friends : ${friends}, placeSearch : ${placeSearch}, placePrice : ${placePrice}, taxPrice : ${taxPrice}`);
    }

     
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
                    <ul className="user_list mt-20">
                        
                    </ul>
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
            <Modal value={modal} close={closeModal}/>
        </>
    )
}

export default Write