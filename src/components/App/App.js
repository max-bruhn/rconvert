import React, { useEffect } from 'react'
import { useImmerReducer } from 'use-immer'
import Axios from 'axios'

import StateContext from '../../StateContext'
import DispatchContext from '../../DispatchContext'

import './App.css'
import Header from '../Header/Header'
import Content from '../Content/Content'
import data from '../../data/data.json'

function App() {
  const initialState = {
    addedCurrencies: [],
    baseCurr: '',
    baseAmount: 1,
    rates: {},
    lastUpdate: 0,
    timeUntilUpdate: 0,
    updateInterval: 60000,
    dragging: {
      isActive: false,
      index: 0,
    },
  }

  const ourReducer = (draft, action) => {
    switch (action.type) {
      case 'addCurrency':
        for (let i = 0; i < data.length; i++) {
          if (data[i].value === action.value) {
            draft.addedCurrencies.push(data[i])
            console.log(data[i])
            break
          }
        }

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
      case 'removeCurrency':
        console.log('remove curr')
        return
      case 'setCurrFromLocal':
        draft.addedCurrencies = [...action.value]
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
      default:
        return console.log('default')
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState)

  const clearLocalStorage = () => {
    return dispatch({ type: 'clearLocalStorage' })
  }

  // sets currency array with localStorage
  useEffect(() => {
    if (localStorage.getItem('addedCurrencies') && localStorage.getItem('addedCurrencies').split(',').length) {
      let value = JSON.parse(localStorage.getItem('addedCurrencies'))

      return dispatch({ type: 'setCurrFromLocal', value })
    }
  }, [])

  // updates localStorage
  useEffect(() => {
    if (state.addedCurrencies && state.addedCurrencies.length) {
      localStorage.setItem('addedCurrencies', JSON.stringify(state.addedCurrencies))
    }
  }, [state.addedCurrencies])

  useEffect(() => {
    if (state.addedCurrencies && state.addedCurrencies.length && Date.now() - state.lastUpdate >= state.updateInterval) {
      getLatestRates(state.addedCurrencies[0].value)
    }
  }, [state.addedCurrencies])

  // make api call and update base curr if first item in addedCurr array has been changed
  useEffect(() => {
    if (state.addedCurrencies && state.addedCurrencies.length && state.addedCurrencies[0].value !== state.baseCurr) {
      dispatch({ type: 'updateBaseCurr', value: state.addedCurrencies[0].value })
      getLatestRates(state.addedCurrencies[0].value)
    }
  }, [state.addedCurrencies])

  // updates rates
  async function getLatestRates(base) {
    console.log(base)
    // call this function with state.addedCurrencies[0].value
    if (state.addedCurrencies && state.addedCurrencies.length) {
      const ourRequest = Axios.CancelToken.source()

      let response = await Axios.get(`https://api.exchangeratesapi.io/latest?base=${base}`, { cancelToken: ourRequest.token }).catch((error) => {
        return console.error('an error occurred fetching latest rates.')
      })

      if (response && response.data && response.data.rates) {
        console.log(response.data.rates)
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
  }

  useEffect(() => {
    // if lastUpdate was updated (successful rates update) then check every state.updateInterval ms if lastUpdate was state.updateInterval ms ago, if it was, update
    const interval = setInterval(() => {
      if (state.addedCurrencies && state.addedCurrencies.length && Date.now() - state.lastUpdate >= state.updateInterval) {
        getLatestRates(state.addedCurrencies[0].value)
      }
    }, state.updateInterval)
    return () => clearInterval(interval)
  }, [state.lastUpdate])

  // set percentage for loading icon
  // useEffect(() => {
  //   let timeUntilUpdate = state.updateInterval
  //   let updateCycle = 500
  //   const interval = setInterval(() => {
  //     timeUntilUpdate = timeUntilUpdate - updateCycle

  //     dispatch({
  //       type: 'updateTimeUntilUpdate',
  //       value: timeUntilUpdate,
  //     })
  //   }, updateCycle)
  //   return () => clearInterval(interval)
  // }, [state.lastUpdate])

  return (
    <>
      <StateContext.Provider value={state}>
        <DispatchContext.Provider value={dispatch}>
          <div className="container  mx-auto lg:px-4 xl:px-32">
            <Header />
            <Content />
          </div>
        </DispatchContext.Provider>
      </StateContext.Provider>
    </>
  )
}

export default App
