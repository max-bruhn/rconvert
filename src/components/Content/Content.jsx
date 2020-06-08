import React, { useEffect, useContext } from 'react'
import StateContext from '../../StateContext'
import data from '../../data/data.json'
import { useImmer } from 'use-immer'

import Card from '../Card/Card'
import Search from '../Search/Search'

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
      <div className="container bg-gray-900 min-h-screen px-4 md:px-8 lg:px-12 lg:py-4 xl:px-16 xl:py-6">
        <div className="flex flex-wrap py-6">
          <div className="w-full sm:w-1/3  text-gray-600 my-3">
            <span>ADD CURRENCIES</span>
          </div>

          <div className="w-full sm:w-2/3  bg-gray-400 my-3">
            <Search />
          </div>

          <div className="w-full sm:w-1/3 text-gray-600 my-8">
            <span className="text-base inline-block">CURRENCIES</span> <br />
            <span className="text-sm pt-3 pr-5 inline-block">Drag a currency to the top to make it the base currency.</span>
          </div>
          <div className="w-full sm:w-2/3   sm:my-8">
            {appState.addedCurrencies.map((curr, id) => {
              return <Card key={curr.value} currency={curr} id={id} />
            })}
          </div>
        </div>
      </div>
    </>
  )
}

export default Content
