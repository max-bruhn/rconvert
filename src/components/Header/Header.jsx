import React, { useEffect } from 'react'

const Header = () => {
  return (
    <>
      <div className="h-20 px-8">
        <div className="float-left text-gray-200 font-bold text-xl pt-6">RCONVERT</div>
        <button
          className="
          mt-4
      float-right 
      bg-transparent hover:bg-gray-700 text-gray-500 font-thin  py-2 px-4 border border-gray-500 rounded
      "
        >
          Clean Data
        </button>
      </div>
    </>
  )
}

export default Header
