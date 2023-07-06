import React from 'react'

const FriendList = ({data, onClickRequestFunc}) => {
  return (
    <div className="friend-list-wrap">
      {
        data && (
          <>
            <p className='title'>친구요청</p>
            {!data.some(param => param.request.sortation === 'request' && param.request.status === 'wait') && (
              <p>친구요청이 없어요</p>
            )}
            {
              data.map((param) => {
                const { sortation, status } = param.request;
                if (sortation === 'request' && status === 'wait') {
                  return (
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
                          <p className='request-friend accept' onClick={() => onClickRequestFunc('accept', param.request.sq)}>수락{param.request.sq}</p>
                          <p className='request-friend accept' onClick={() => onClickRequestFunc('refusal', param.request.sq)}>거절</p>
                        </div>
                      </dd>
                    </dl>
                  );
                }
                return null;
              })
            }
            <p className='title'>친구목록</p>
            {!data.some(param => param.request.status === 'accept') && (
              <p>친구가 없어요</p>
            )}
            {data.map((param) => {
              const { sortation, status } = param.request;
              if (status === 'accept') {
                return (
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
                        <p className='request-friend accept' onClick={() => onClickRequestFunc('refusal', param.request.sq)}>삭제</p>
                      </div>
                    </dd>
                  </dl>
                );
              }
              return null;
            })}
          </>
        )
      }
    </div>
  )
}

export default FriendList