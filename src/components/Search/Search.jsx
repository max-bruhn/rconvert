import React, { useEffect, useContext } from 'react'
import { useImmer } from 'use-immer'
import DispatchContext from '../../DispatchContext'
import StateContext from '../../StateContext'
import data from '../../data/data.json'
import { isEqual } from 'lodash'

import styles from './Search.module.scss'

const Search = () => {
  const appDispatch = useContext(DispatchContext)
  const appState = useContext(StateContext)

  const [state, setState] = useImmer({
    display: false,
    options: [],
    filteredOptions: [],
    search: '',
  })

  useEffect(() => {
    let temp = [...data]
    console.log('added ccc')
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

  function SelectItem(item) {
    return <li className="w-full leading-loose px-3 h-8 border-gray-800 border  hover:bg-gray-700 cursor-pointer">{item.item.label}</li>
  }

  return (
    <>
      <div className={`${styles.dropdown} w-full bg-gray-900 text-gray-600`}>
        <input
          onFocus={() => {
            setState((draft) => {
              draft.display = true
            })
          }}
          onBlur={() => {
            setState((draft) => {
              draft.display = false
            })
          }}
          className={`rounded-lg border-gray-600 border text-gray-600 w-full bg-gray-900 py-2 px-3 `}
          type="text"
          placeholder="Search"
        />

        <div className={state.display ? `${styles.block} ${styles['dropdown-content']} border rounded-lg bg-gray-900 border-gray-800 w-full` : `${styles.none}`}>
          <ul className="w-full">
            {state.filteredOptions.map((item, id) => {
              // console.log(item.label)
              return <SelectItem key={item.value} item={item} />
            })}
          </ul>
        </div>
      </div>
    </>
  )
}

export default Search
