import React, { useEffect, useContext } from 'react'
import StateContext from '../../StateContext'
// import DispatchContext from '../../DispatchContext'
import data from '../../data/data.json'
import { useImmer } from 'use-immer'
import { isEqual } from 'lodash'

import styles from './Card.module.scss'

const Card = (props) => {
  const appState = useContext(StateContext)
  // const appDispatch = useContext(DispatchContext)

  const [state, setState] = useImmer({
    currencies: [],
    amount: 0,
  })

  function clickHandler(curr) {
    setState((draft) => {
      draft.edit.isEditing = true
      draft.edit.editingWhat = curr
    })
  }

  function changeHandler(amount) {
    setState((draft) => {
      draft.amount = amount
    })
  }

  function inputForm() {
    return <></>
  }

  return (
    <>
      <div className={`h-24 mb-6 rounded-lg p-4 text-gray-200 ${styles.gradient} `}>
        <div className="font-bold text-xl pb-2">{props.currency.value}</div>
        <div>{props.currency.label}</div>
      </div>
    </>
  )
}

export default Card
