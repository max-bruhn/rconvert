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
    if (input === '') {
      setState((draft) => {
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

    if (isUnique) {
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

      if (isUnique) {
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
        <input
          onFocus={() => {
            setState((draft) => {
              draft.display = true
            })
          }}
          onClick={() => {
            setState((draft) => {
              draft.display = true
            })
          }}
          onKeyUp={(e) => {
            keyUpHandler(e)
          }}
          onChange={(e) => {
            e.preventDefault()
            filterHandler(e.target.value)
          }}
          className={`rounded-lg border-gray-600 border text-gray-600 w-full bg-gray-900 py-2 px-3 `}
          type="text"
          placeholder="Search"
        />
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
