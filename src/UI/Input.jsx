import React, { useState, useEffect } from 'react'

const Input = ({txt, id, onChange, inputType, className, accept, value}) => {
  const [inputFocus,setInputFocus] = useState(false);
  const onfocusHandler = () => {
    setInputFocus(true)
  }

  const onBlurHandler = (e) => {
    if(!e.target.value || e.target.value === ''){
      setInputFocus(false);
    }
  }



   // useEffect를 사용하여 컴포넌트가 마운트될 때 실행되도록 설정
   useEffect(() => {
    // value가 비어있지 않으면 setInputFocus(true) 호출
    if (value !== '') {
      setInputFocus(true);
    }
  }, [value]);

  return (
    <label className={(inputFocus === true ? 'input-st active' : 'input-st')} name={id} >
        <input type={inputType} 
              id={id} 
              className={className && `${className}`}
              accept={accept && `${accept}`}
              onFocus={()=>{onfocusHandler()}}
              onBlur={onBlurHandler}
              onChange={onChange}
              value={value}
        />
        <span>{txt}</span>
    </label>
  )
}

export default Input