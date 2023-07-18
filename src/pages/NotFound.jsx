
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();
    const session = sessionStorage.getItem('userID');
    useEffect(()=> {
        alert('접근이 허용되지 않은 페이지 입니다.');
        
        if(session){
            navigate(-1)
        }else{
            navigate('/')
        }
        
    })
    return (
        <div>
            없는페이지에요
        </div>
    )
}

export default NotFound