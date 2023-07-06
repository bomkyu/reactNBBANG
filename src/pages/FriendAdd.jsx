import React from 'react'

const FriendAdd = ({data, onChange, onClickRequestFunc, saerchData}) => {
  return (
    <div className="friend-request">
      <div className="search-friend">
        <div className="input-st-wrap">
            <label className="input-st search" onChange={onChange}>
              <input type="text"  placeholder="검색"/>
              <a className="search-btn"></a>
            </label>
        </div>
        <div className="search-friend-result">
        {(!saerchData || saerchData === null ? data : saerchData).map((param) => (
          <dl className="friend-list" key={param.id}>
            <dt>
              <div className="img-wrap">
                <div className="img-thumb" style={{backgroundImage : `url(${param.imgUrl ? param.imgUrl : './images/img_user.png'})`}}></div>
              </div>
            </dt>
            <dd>
              <p className="nick-name">{param.userName}</p>
              <p className="user-name">{param.userNickName}</p>
              <div className='request-wrap'>
              {
                param.request.sortation === 'none' || param.request.status === 'refusal' 
                ? 
                  <p className='request-friend request' onClick={() => onClickRequestFunc('send', param.id)}>요청</p> 
                :
                param.request.sortation === 'send' && param.request.status === 'wait' 
                ?
                <p className='request-friend'>대기중</p>
                :
                param.request.sortation === 'request' && param.request.status === 'wait'
                ?
                <>
                  <p className='request-friend accept' onClick={() => onClickRequestFunc('accept', param.request.sq)}>수락</p>
                  <p className='request-friend accept' onClick={() => onClickRequestFunc('refusal', param.request.sq)}>거절</p>
                </>
                :
                ''
              }
              </div>
            </dd>
          </dl>
        ))}
        </div>
      </div>
    </div>
  )
}

export default FriendAdd