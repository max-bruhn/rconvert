import React from 'react'
import 'flag-icon-css/css/flag-icon.css'

const Flag = (props) => {
  return (
    <>
      <span className={`flag-icon flag-icon-${props.value.substring(0, 2).toLowerCase()} mr-2`}></span>
    </>
  )
}

export default Flag
