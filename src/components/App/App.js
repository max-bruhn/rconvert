import React, { useEffect, useCallback } from 'react'
import { useImmerReducer } from 'use-immer'
import Axios from 'axios'

import StateContext from '../../StateContext'
import DispatchContext from '../../DispatchContext'

import './App.css'

import data from '../../data/data.json'
import Container from '../Container/Container'

function App() {
  const initialState = {
    addedCurrencies: [],
    baseCurr: '',
    baseAmount: 1,
    rates: {},
    lastUpdate: 0,
    loadedAmountFromStorage: false,
    isFetching: false,
  }

  const ourReducer = (draft, action) => {
    switch (action.type) {
      case 'addCurrency':
        for (let i = 0; i < data.length; i++) {
          if (data[i].value === action.value) {
            // draft.addedCurrencies.push(data[i])
            draft.addedCurrencies.splice(1, 0, data[i])

            break
          }
        }

        return
      case 'isFetching':
        draft.isFetching = action.value
        return
      case 'updateOrder':
        draft.addedCurrencies = [...action.value]
        return
      case 'updateBaseCurr':
        draft.baseCurr = action.value
        return
      case 'updateBaseAmount':
        draft.baseAmount = action.value
        return
      case 'clearLocalStorage':
        localStorage.removeItem('addedCurrencies')
        localStorage.removeItem('searchCurrencies')
        draft.addedCurrencies = []
        draft.baseCurr = ''
        draft.baseAmount = 1
        return
      case 'updateRates':
        draft.rates = { ...action.value }
        draft.lastUpdate = Date.now()
        draft.timeUntilUpdate = initialState.updateInterval
        return
      case 'updateTimeUntilUpdate':
        draft.timeUntilUpdate = action.value
        return
      case 'loadedAmountFromStorage':
        // set to false when item is dragged or aadded or data cleared
        // true if fresh loaded from storage
        // neccessary to prevent [0] card loading default amount if baseAmount is included in local storage
        draft.loadedAmountFromStorage = action.value
        return
      default:
        return
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState)

  // populate from localStorage
  useEffect(() => {
    if (localStorage.getItem('addedCurrencies') && localStorage.getItem('addedCurrencies').split(',').length) {
      let value = JSON.parse(localStorage.getItem('addedCurrencies'))
      dispatch({ type: 'updateOrder', value })
    } else {
      ;['EUR', 'USD', 'GBP', 'CHF'].forEach((curr) => {
        dispatch({ type: 'addCurrency', value: curr })
      })
    }

    if (localStorage.getItem('baseAmount')) {
      let value = localStorage.getItem('baseAmount')
      dispatch({ type: 'updateBaseAmount', value })
      dispatch({ type: 'loadedAmountFromStorage', value: true })
    }
  }, [dispatch])

  // updates rates
  const getLatestRates = useCallback(
    async (base) => {
      dispatch({ type: 'isFetching', value: true })
      // call this function with state.addedCurrencies[0].value

      if (state.addedCurrencies && state.addedCurrencies.length) {
        const ourRequest = Axios.CancelToken.source()

        let response = await Axios.get(`https://api.exchangeratesapi.io/latest?base=${base}`, { cancelToken: ourRequest.token }).catch((error) => {
          return console.error('an error occurred fetching latest rates.')
        })
        dispatch({ type: 'isFetching', value: false })

        if (response && response.data && response.data.rates) {
          dispatch({
            type: 'updateRates',
            value: response.data.rates,
          })
        } else {
          // call again if got no rates
          setTimeout(() => {
            getLatestRates(state.addedCurrencies[0].value)
          }, 5000)
        }

        return () => ourRequest.cancel()
      }
    },
    [state.addedCurrencies, dispatch]
  )

  // updates localStorage
  useEffect(() => {
    if (state.addedCurrencies && state.addedCurrencies.length) {
      localStorage.setItem('addedCurrencies', JSON.stringify(state.addedCurrencies))
      localStorage.setItem('baseAmount', state.baseAmount)
    }
  }, [state.addedCurrencies, state.baseAmount])

  useEffect(() => {
    if (state.addedCurrencies && state.addedCurrencies.length && Date.now() - state.lastUpdate >= state.updateInterval) {
      getLatestRates(state.addedCurrencies[0].value)
    }
  }, [state.addedCurrencies, getLatestRates, state.lastUpdate, state.updateInterval])

  // make api call and update base curr if first item in addedCurr array has been changed
  useEffect(() => {
    if (state.addedCurrencies && state.addedCurrencies.length && state.addedCurrencies[0].value !== state.baseCurr) {
      dispatch({ type: 'updateBaseCurr', value: state.addedCurrencies[0].value })
      getLatestRates(state.addedCurrencies[0].value)
    }
  }, [state.addedCurrencies, dispatch, getLatestRates, state.baseCurr])

  return (
    <>
      <StateContext.Provider value={state}>
        <DispatchContext.Provider value={dispatch}>
          <Container />
        </DispatchContext.Provider>
      </StateContext.Provider>
    </>
  )
}

export default App
