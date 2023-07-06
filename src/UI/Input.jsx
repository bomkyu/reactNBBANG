import React, { useState } from 'react'

const Input = ({txt, id, onChange, inputType, className, accept, ipStyle}) => {
  const [inputFocus,setInputFocus] = useState(false);
  const onfocusHandler = () => {
    setInputFocus(true)
  }

  const onBlurHandler = (e) => {
    if(!e.target.value || e.target.value === ''){
      setInputFocus(false);
    }
  }

  return (
    <label className={inputFocus === true ? 'input-st active' : 'input-st'} name={id} >
        <input type={inputType} 
              id={id} 
              className={className && `${className}`}
              accept={accept && `${accept}`}
              onFocus={()=>{onfocusHandler()}}
              onBlur={onBlurHandler}
              onChange={onChange}
        />
        <span>{txt}</span>
    </label>
  )
}

export default Input