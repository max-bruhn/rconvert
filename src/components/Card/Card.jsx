import React, { useEffect, useContext } from 'react'
import StateContext from '../../StateContext'
import { useImmer } from 'use-immer'
import { isEqual } from 'lodash'
import { CSSTransition } from 'react-transition-group'
import { Draggable } from 'react-beautiful-dnd'

import styles from './Card.module.scss'
import transition from './transition.module.scss'

const Card = (props) => {
  const appState = useContext(StateContext)
  // const appDispatch = useContext(DispatchContext)

  const [state, setState] = useImmer({
    currencies: [],
    amount: 0,
    display: false,
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

  useEffect(() => {
    let display = false

    if (appState.addedCurrencies && appState.addedCurrencies.length) {
      appState.addedCurrencies.forEach((el) => {
        if (isEqual(props.currency, el)) {
          display = true
        }
      })
    }

    setState((draft) => {
      draft.display = display
    })

    return
  }, [appState.addedCurrencies])

  // ref for css transition (otherwise throws warning in strict mode)
  const nodeRef = React.createRef()

  return (
    // set id to props.currency as string, so it can easily parsed as obj when drag ends (inside content.jsx onDragEnd handler)
    <Draggable draggableId={JSON.stringify(props.currency)} index={props.id}>
      {(provided, snapshot) => (
        <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
          <CSSTransition nodeRef={nodeRef} in={state.display} timeout={2000} classNames={transition} unmountOnExit>
            <div ref={nodeRef} className={`h-24 mb-6 rounded-lg p-4 text-gray-200 ${styles.gradient} `}>
              <div className="font-bold text-xl pb-2">{props.currency.value}</div>
              <div>{props.currency.label}</div>
            </div>
          </CSSTransition>
        </div>
      )}
    </Draggable>
  )
}

export default Card
