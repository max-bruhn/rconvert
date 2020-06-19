import React, { useEffect, useContext } from 'react'
import DispatchContext from '../../DispatchContext'
import Spinner from '../Spinner/Spinner'
import StateContext from '../../StateContext'
import { useImmer } from 'use-immer'

const Header = () => {
  const appDispatch = useContext(DispatchContext)
  const appState = useContext(StateContext)

  const clearLocalStorage = () => {
    return appDispatch({ type: 'clearLocalStorage' })
  }

  const [state, setState] = useImmer({
    timeString: '-',
  })

  useEffect(() => {
    let time = '-'
    if (appState.lastUpdate > 0) {
      // it would show briefly 0 (7am) if no if statement
      const date = new Date(appState.lastUpdate)
      time = date.toLocaleTimeString()
    }

    setState((draft) => {
      draft.timeString = time
    })
  }, [appState.lastUpdate, setState])

  return (
    <>
      <div className="h-20 px-4 md:px-8 lg:px-12 xl:px-16">
        {/* <div className="float-left text-gray-200 font-bold text-xl pt-6">RCONVERT</div> */}
        <div className=" inline-block float-left text-gray-200 font-bold text-xl pt-6">
          <svg className="h-8 w-auto inline-block mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 57.11 50.83">
            <g data-name="Layer 2">
              <g data-name="Layer 1">
                <ellipse cx="28.56" cy="25.42" rx="10.27" ry="27.56" transform="rotate(-30 28.551 25.41)" fill="none" stroke="#7b5ba6" strokeMiterlimit="10" strokeWidth="2" />
                <ellipse cx="28.56" cy="25.42" rx="27.56" ry="10.27" transform="rotate(-60 28.559 25.414)" fill="none" stroke="#7b5ba6" strokeMiterlimit="10" strokeWidth="2" />
                <ellipse cx="28.56" cy="25.42" rx="27.56" ry="10.27" fill="none" stroke="#7b5ba6" strokeMiterlimit="10" strokeWidth="2" />
                <path d="M24.3 25.8a5.18 5.18 0 015.18-5.19 6 6 0 011 .09 5.18 5.18 0 10-3.77 9.45 5.18 5.18 0 01-2.41-4.35z" fill="#7b5ba6" />
                <path d="M30.44 20.7a5.18 5.18 0 01-2.81 9.54 5 5 0 01-1-.09 5.18 5.18 0 103.77-9.45z" fill="#7b5ba6" />
                <path d="M29.05 20.65a.44.44 0 00.16-.57l-.72-1.51 1.1 1.11 1.09 1.12-1.51.39-1.51.39zM28 30.76a.44.44 0 01.15-.57l1.37-1-1.5.42-1.51.41 1.12 1.1 1.11 1.09z" fill="#7b5ba6" />
              </g>
            </g>
          </svg>
          <span className="align-bottom">R&#183;CONVERT</span>
        </div>
        <div className={`float-right `}>
          {appState.isFetching ? <Spinner /> : ''}
          <div className={`hidden sm:inline-block text-gray-500 mr-4 font-thin  origin-right `}>Last Update: {state.timeString}</div>

          <div className="inline-block">
            <button
              onClick={clearLocalStorage}
              className="
              mt-4
              px-6
          bg-transparent hover:bg-gray-700 text-gray-500 font-thin  py-2 px-4 border border-gray-600 rounded-lg
          "
            >
              Remove All
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Header
