import React from 'react'

const Modal = ({value : { isOpen, type }, close}) => {
  return (
    <div className={`modal-wrap ${isOpen && 'active'} ${type}`}>
        <div className="modal-contain">
            <div className="modal-header" onClick={close}></div>
            <div className="modal-content">
                
            </div>
      </div>
    </div>
  )
}

export default Modal