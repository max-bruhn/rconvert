import React, { useEffect, useContext } from 'react'
import DispatchContext from '../../DispatchContext'
import Spinner from '../Spinner/Spinner'
import StateContext from '../../StateContext'
import { useImmer } from 'use-immer'

import styles from './Header.module.scss'

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
  }, [appState.lastUpdate])

  return (
    <>
      <div className="h-20 px-4 md:px-8 lg:px-12 xl:px-16">
        <div className="float-left text-gray-200 font-bold text-xl pt-6">RCONVERT</div>
        <div className={`float-right `}>
          {appState.isFetching ? <Spinner /> : ''}
          <div className={`hidden sm:inline-block text-gray-500 mr-4 font-thin  origin-right `}>Last Update: {state.timeString}</div>

          <div className={`${styles.tooltip}`}>
            <button
              onClick={clearLocalStorage}
              className="
              mt-4
              px-6
          bg-transparent hover:bg-gray-700 text-gray-500 font-thin  py-2 px-4 border border-gray-500 rounded-lg
          "
            >
              Clear All
            </button>
            <span className={`mt-16 -ml-24 text-gray-200 bg-gray-600 p-1 rounded ${styles['tooltip-text']}`}>Remove All!</span>
          </div>
        </div>
      </div>
    </>
  )
}

export default Header
