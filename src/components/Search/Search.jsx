import React, { useEffect, useContext, useRef } from 'react'
import { useImmer } from 'use-immer'
import DispatchContext from '../../DispatchContext'
import StateContext from '../../StateContext'
import data from '../../data/data.json'
import { isEqual } from 'lodash'
import { CSSTransition } from 'react-transition-group'

import styles from './Search.module.scss'
import transition from './transition.module.scss'

const Search = () => {
  const appDispatch = useContext(DispatchContext)
  const appState = useContext(StateContext)

  const [state, setState] = useImmer({
    display: false,
    options: [],
    filteredOptions: [],
    search: '',
    dropdown: {
      selected: 0,
      usesArrows: false,
    },
  })

  useEffect(() => {
    let temp = [...data]

    if (appState.addedCurrencies && appState.addedCurrencies.length) {
      appState.addedCurrencies.forEach((el) => {
        let index = temp.findIndex((x) => isEqual(x, el))
        temp.splice(index, 1)
      })
    }

    setState((draft) => {
      draft.options = [...temp]
      draft.filteredOptions = [...temp]
    })
    return
  }, [appState.addedCurrencies])

  // ref to search div
  const searchDiv = useRef()

  // add event listener to watch for any clicks
  useEffect(() => {
    // add when mounted
    document.addEventListener('mousedown', handleClickOutside)
    // return function to be called when unmounted
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  //
  function handleClickOutside(e) {
    if (searchDiv.current.contains(e.target)) {
      // inside click
      return
    }
    // outside click
    setState((draft) => {
      draft.display = false
      draft.dropdown.selected = 0
    })
  }

  function filterHandler(input) {
    if (input && input !== '') {
      setState((draft) => {
        draft.display = true
      })
    }

    if (input === '') {
      setState((draft) => {
        draft.display = false
        draft.filteredOptions = [...state.options]
      })
      return
    }

    const filterRegex = new RegExp(input, 'i')
    const resultOptions = state.options.filter((option) => option.label.match(filterRegex))

    setState((draft) => {
      draft.filteredOptions = [...resultOptions]
    })
  }

  function selectHandler() {
    console.log('selected')
  }

  function hoverHandler(id) {
    setState((draft) => {
      draft.dropdown.selected = id
    })
  }

  function clickHandler() {
    let isUnique = true

    state.addedCurrencies ||
      [].forEach((curr) => {
        if (curr.value === state.filteredOptions[state.dropdown.selected].value) {
          isUnique = false
        }
      })

    if (isUnique && state.filteredOptions && state.filteredOptions.length) {
      appDispatch({ type: 'addCurrency', value: state.filteredOptions[state.dropdown.selected].value })
      appDispatch({ type: 'loadedAmountFromStorage', value: false })
      setState((draft) => {
        draft.display = false
        draft.dropdown.selected = 0
      })
    }
  }

  function keyUpHandler(e) {
    // hide dropdown & clear selected
    if (e.key === 'Escape') {
      setState((draft) => {
        draft.display = false
        draft.dropdown.selected = 0
      })
    } else if (e.key === 'ArrowDown' && state.display && state.dropdown.selected < state.filteredOptions.length - 1) {
      setState((draft) => {
        draft.dropdown.selected++
      })
    } else if (e.key === 'ArrowUp' && state.dropdown.selected > 0) {
      setState((draft) => {
        draft.dropdown.selected--
      })
    } else if (e.key === 'Enter') {
      // check if an entry with same value is already part of state.addedCurrencie
      // if not, than add it
      let isUnique = true

      state.addedCurrencies ||
        [].forEach((curr) => {
          if (curr.value === state.filteredOptions[state.dropdown.selected].value) {
            isUnique = false
          }
        })

      if (isUnique && state.filteredOptions && state.filteredOptions.length) {
        appDispatch({ type: 'addCurrency', value: state.filteredOptions[state.dropdown.selected].value })
        setState((draft) => {
          draft.display = false
          draft.dropdown.selected = 0
        })
      }
    } else if (e.key === 'ArrowDown' && !state.display) {
      setState((draft) => {
        draft.display = true
      })
    }
  }

  function SelectItem(item) {
    return (
      <li
        onMouseEnter={() => {
          hoverHandler(item.id)
        }}
        onClick={() => {
          clickHandler(item.id)
        }}
        className={`w-full leading-loose px-5  px-3 h-12 py-2 md:py-0 md:h-8 border-gray-800 border  cursor-pointer ${state.dropdown.selected === item.id ? ' bg-gray-700 ' : ''}`}
      >
        {item.item.label}
      </li>
    )
  }

  // ref for css transition (otherwise throws warning in strict mode)
  const nodeRef = React.createRef()

  return (
    <>
      <div ref={searchDiv} className={`${styles.input} w-full bg-gray-900 text-gray-600`}>
        <div className={`${styles['max-height']} px-3 flex border rounded-lg border-gray-600 text-gray-600 w-full bg-gray-900`}>
          <svg className="fill-current w-4 hj-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path class="heroicon-ui" d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z" />
          </svg>
          <input
            onKeyUp={(e) => {
              keyUpHandler(e)
            }}
            onChange={(e) => {
              e.preventDefault()
              filterHandler(e.target.value)
            }}
            className={`outline-none py-2 px-3 bg-gray-900 w-full`}
            type="text"
            placeholder="Search"
          />
        </div>
        <CSSTransition nodeRef={nodeRef} in={state.display} timeout={2000} classNames={transition} unmountOnExit>
          <div ref={nodeRef} className={`${styles.dropdown} border rounded-lg bg-gray-900 border-gray-800 w-full`}>
            <ul className={`w-full `}>
              {state.filteredOptions.map((item, id) => {
                return <SelectItem key={item.value} id={id} item={item} />
              })}
            </ul>
          </div>
        </CSSTransition>
      </div>
    </>
  )
}

export default Search
