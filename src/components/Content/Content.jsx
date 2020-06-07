import React, { useEffect, useContext } from 'react'
import StateContext from '../../StateContext'
import data from '../../data/data.json'
import { useImmer } from 'use-immer'

import Card from '../Card/Card'

const Content = () => {
  const appState = useContext(StateContext)

  const [state, setState] = useImmer({
    tempCurr: [],
  })

  useEffect(() => {
    setState((draft) => {
      draft.tempCurr = [...data]
    })
  }, [])

  return (
    <>
      <div className="container bg-gray-900 min-h-screen px-8">
        <div class="flex flex-wrap py-6">
          <div class="w-full sm:w-1/3  text-gray-600 my-3">
            <span>ADD CURRENCIES</span>
          </div>

          <div class="w-full sm:w-2/3  bg-gray-400 my-3">
            <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username" />
          </div>

          <div class="w-full sm:w-1/3 text-gray-600 my-8">
            <span className="text-base inline-block">CURRENCIES</span> <br />
            <span className="text-sm pt-3 pr-5 inline-block">Drag a currency to the top to make it the base currency.</span>
          </div>
          <div class="w-full sm:w-2/3   my-8">
            {state.tempCurr.map((curr, id) => {
              return <Card key={curr.value} currency={curr} id={id} />
            })}
          </div>
        </div>
      </div>
    </>
  )
}

export default Content
