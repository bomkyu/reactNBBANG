import React from 'react'

const ContentRow = ({title, text}) => {
  return (
    <dl className="location-info">
        <dt>{title} : </dt>
        <dd>{text}</dd>
    </dl>
  )
}

export default ContentRow