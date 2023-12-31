import React from 'react'
import Calendar from '../UI/Calendar'
const Modal = ({value : { isOpen, type }, close, data, onClick, dateChange, date}) => {
  return (
    <div className={`modal-wrap ${isOpen && 'active'} ${type}`}>
        <div className="modal-contain">
            <div className="modal-header" onClick={close}>
              <>{type === 'full' && <p className='title'>달력</p>}</>
            </div>
            <div className="modal-content">
              { 
                type === 'h_80' ? 
                data && (
                  data.map((param)=> 
                    <dl className={`friend-list ${param.selected ? 'active': ''}`} key={param.id} onClick={()=>onClick(param.id)}>
                      <dt>
                        <div className="img-wrap">
                          <div className="img-thumb" style={{backgroundImage : `url(${param.imgUrl ? param.imgUrl : '../images/img_user.png'})`}}></div>
                        </div>
                      </dt>
                      <dd>
                        <p className="nick-name">{param.userName}</p>
                        <p className="user-name">{param.userNickName}</p>
                      </dd>
                    </dl>
                  )
                  
                )
                :
                <Calendar dateChange={dateChange} date={date}/>
              }
            </div>
      </div>
    </div>
  )
}

export default Modal