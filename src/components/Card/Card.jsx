import React, { useEffect, useContext, useRef } from 'react'
import StateContext from '../../StateContext'
import DispatchContext from '../../DispatchContext'
import { useImmer } from 'use-immer'
import { isEqual } from 'lodash'
import { CSSTransition } from 'react-transition-group'
import { Draggable } from 'react-beautiful-dnd'

import styles from './Card.module.scss'
import transition from './transition.module.scss'
import icon from '../../assets/icons/delete.svg'

const Card = (props) => {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  // const inputRef = useRef()

  const [state, setState] = useImmer({
    currencies: [],
    amount: 1,
    display: false,
    isDragging: false,
    underneathDragged: false,
    type: 'number',
  })

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

  // update amount if baseAmount has been changed and is not base currency
  useEffect(() => {
    const rate = appState.rates[props.currency.value]

    if (props.id !== 0 && !appState.isFetching) {
      setState((draft) => {
        draft.amount = parseFloat(appState.baseAmount * rate).toFixed(2)
      })
    }

    // get amount from appState if it's freshly loaded from storage
    if (props.id == 0 && appState.loadedAmountFromStorage) {
      setState((draft) => {
        draft.amount = appState.baseAmount
      })
      appDispatch({ type: 'loadedAmountFromStorage', value: false })
    }
  }, [appState.baseAmount, appState.rates])

  // update base currency if this card was dragged to the top
  useEffect(() => {
    if (props.id == 0 && !appState.loadedAmountFromStorage) {
      appDispatch({ type: 'updateBaseAmount', value: state.amount })
    }
  }, [appState.addedCurrencies])

  function inputHandler(e) {
    e.preventDefault()

    if (props.id != 0) {
      return
    }

    // only allow digits, - in front and one dot. remove trailing 0
    let value = e.target.value
      .replace(/[^0-9.-]/g, '')
      .replace(/(\..*)\./g, '$1')
      .replace(/(?!^)-/g, '')
      .replace(/^0+/, '')

    setState((draft) => {
      draft.amount = value
    })

    appDispatch({ type: 'updateBaseAmount', value })
  }

  // if input is clicked, all is selected
  const inputRef = useRef()

  function clickHandler(e) {
    e.preventDefault()

    inputRef.current.selectionStart = 0
    inputRef.current.selectionEnd = inputRef.current.value.length
  }

  function deleteHandler() {
    setState((draft) => {
      draft.display = false
    })
    // set timeout so transition can happen before card is remove from .map
    setTimeout(() => {
      let addedCurrencies = [...appState.addedCurrencies]
      addedCurrencies.splice(props.id, 1)

      appDispatch({ type: 'updateOrder', value: addedCurrencies })

      if (addedCurrencies.length === 0) {
        appDispatch({ type: 'clearLocalStorage' })
      }
    }, 200)
  }

  function enterHandler(e) {
    console.log('enter')
    if (e.key == 'Enter') {
      e.target.blur()
    }
  }

  // ref for css transition (otherwise throws warning in strict mode)
  const nodeRef = React.createRef()

  function Amount() {
    return <span className="float-right align-bottom leading-10 font-bold text-xl ">{isNaN(state.amount) ? '-' : state.amount}</span>
  }

  return (
    // set id to props.currency as string, so it can easily parsed as obj when drag ends (inside content.jsx onDragEnd handler)
    <Draggable draggableId={JSON.stringify(props.currency)} index={props.id}>
      {(provided, snapshot) => (
        <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef} className={`mb-4 lg:mb-6 ${snapshot.isDragging ? 'border-2 border-white rounded-lg' : ''}`}>
          <CSSTransition nodeRef={nodeRef} in={state.display} timeout={200} classNames={transition} unmountOnExit>
            <div ref={nodeRef} className={`h-24 overflow-hidden rounded-lg p-4 text-gray-200 ${styles.gradient} `}>
              <div className="font-bold text-xl pb-2 w-2/4 inline">{props.currency.value}</div>
              <div className="inline float-right ">
                <div onClick={deleteHandler} className={`w-3 h-3 cursor-pointer ${styles.tooltip}`}>
                  <svg className={`w-3 h-3 fill-current `} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496.096 496.096">
                    <path d="M259.41 247.998L493.754 13.654a8 8 0 000-11.312 8 8 0 00-11.312 0L248.098 236.686 13.754 2.342A8 8 0 002.442 13.654l234.344 234.344L2.442 482.342a8 8 0 00-.196 11.312 8 8 0 0011.508 0L248.098 259.31l234.344 234.344a8 8 0 0011.312-.196 8 8 0 000-11.116L259.41 247.998z" />
                  </svg>
                  <span className={`-mt-12 -ml-20 bg-grey-600 p-1 rounded ${styles['tooltip-text']}`}>Remove Me!</span>
                </div>
              </div>
              <div className="w-full">
                <span className="float-left align-bottom leading-10 w-6/12">{props.currency.label}</span>
                {props.id == 0 ? (
                  <input
                    key={props.currency.value}
                    ref={inputRef}
                    type="text"
                    inputMode="numeric"
                    onClick={clickHandler}
                    onChange={(e) => inputHandler(e)}
                    onKeyUp={enterHandler}
                    value={state.amount}
                    className="float-right w-6/12 pr-1
 bg-opacity-25 bg-white rounded-lg text-right align-bottom font-bold text-xl outline-none border border-transparent focus:border-white "
                  />
                ) : (
                  <Amount />
                )}
              </div>
            </div>
          </CSSTransition>
        </div>
      )}
    </Draggable>
  )
}

export default Card
