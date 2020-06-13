import React, { useEffect, useContext, useRef } from 'react'
import StateContext from '../../StateContext'
import DispatchContext from '../../DispatchContext'
import { useImmer } from 'use-immer'
import { isEqual } from 'lodash'
import { CSSTransition } from 'react-transition-group'
import { Draggable } from 'react-beautiful-dnd'

import styles from './Card.module.scss'
import transition from './transition.module.scss'

function useTraceUpdate(props) {
  const prev = useRef(props)
  useEffect(() => {
    const changedProps = Object.entries(props).reduce((ps, [k, v]) => {
      if (prev.current[k] !== v) {
        ps[k] = [prev.current[k], v]
      }
      return ps
    }, {})
    if (Object.keys(changedProps).length > 0) {
      console.log('Changed props:', changedProps)
    }
    prev.current = props
  })
}

const Card = (props) => {
  useTraceUpdate(props)
  console.log(props + ' ' + Date.now())

  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  const [state, setState] = useImmer({
    currencies: [],
    amount: 0,
    display: false,
    isDragging: false,
    underneathDragged: false,
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

  function Input() {
    return <input type="number" className="float-right bg-opacity-25 bg-white rounded-lg text-right align-bottom  font-bold text-xl " />
  }

  function Amount() {
    return <span className="float-right align-bottom leading-10 font-bold text-xl ">300</span>
  }

  return (
    // set id to props.currency as string, so it can easily parsed as obj when drag ends (inside content.jsx onDragEnd handler)
    <Draggable draggableId={JSON.stringify(props.currency)} index={props.id}>
      {(provided, snapshot) => (
        <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef} className={`mb-6 ${snapshot.isDragging ? 'border-2 border-white rounded-lg' : ''}`}>
          <CSSTransition nodeRef={nodeRef} in={state.display} timeout={2000} classNames={transition} unmountOnExit>
            <div ref={nodeRef} className={`h-24  rounded-lg p-4 text-gray-200 ${styles.gradient} `}>
              <div className="font-bold text-xl pb-2">{props.currency.value}</div>
              <div className="w-full">
                <span className="float-left align-bottom leading-10">{props.currency.label}</span>
                {props.id == 0 ? <Input /> : <Amount />}
              </div>
            </div>
          </CSSTransition>
        </div>
      )}
    </Draggable>
  )
}

export default Card
