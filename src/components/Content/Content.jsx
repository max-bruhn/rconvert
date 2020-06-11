import React, { useEffect, useContext, useState } from 'react'
import StateContext from '../../StateContext'
import DispatchContext from '../../DispatchContext'
import data from '../../data/data.json'
import { useImmer } from 'use-immer'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'

import Card from '../Card/Card'
import Search from '../Search/Search'

const queryAttr = 'data-rbd-drag-handle-draggable-id'

const Content = () => {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const [placeholderProps, setPlaceholderProps] = useState({})

  const [state, setState] = useImmer({
    tempCurr: [],
  })

  useEffect(() => {
    setState((draft) => {
      draft.tempCurr = [...data]
    })
  }, [])

  function onDragEnd(result) {
    const { destination, source, draggableId } = result
    if (!destination) {
      return
    }
    if (destination.droppableId === source.draggableId && destination.index === source.index) {
      return
    }

    setPlaceholderProps({})

    const newAddedCurrencies = [...appState.addedCurrencies]

    newAddedCurrencies.splice(source.index, 1)
    newAddedCurrencies.splice(destination.index, 0, JSON.parse(draggableId))

    appDispatch({ type: 'updateOrder', value: newAddedCurrencies })
  }

  const onDragUpdate = (update) => {
    if (!update.destination) {
      return
    }
    const draggableId = update.draggableId
    const destinationIndex = update.destination.index

    const domQuery = `[${queryAttr}='${draggableId}']`
    const draggedDOM = document.querySelector(domQuery)
    if (!draggedDOM) {
      return
    }
    const { clientHeight, clientWidth } = draggedDOM

    const clientY =
      parseFloat(window.getComputedStyle(draggedDOM.parentNode).paddingTop) +
      [...draggedDOM.parentNode.children].slice(0, destinationIndex).reduce((total, curr) => {
        const style = curr.currentStyle || window.getComputedStyle(curr)
        // based on 1.5 rem == 24 px. 1.5 rem sued as bottom margin for each card
        const marginBottom = 24
        // const marginBottom = parseFloat(style.marginBottom)
        console.log(parseFloat(total))
        return total + curr.clientHeight + marginBottom
      }, 0)

    setPlaceholderProps({
      clientHeight,
      clientWidth,
      clientY,
      clientX: parseFloat(window.getComputedStyle(draggedDOM.parentNode).paddingLeft),
    })
  }

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
            <DragDropContext onDragEnd={onDragEnd} onDragUpdate={onDragUpdate}>
              <Droppable droppableId={'droppableId1'}>
                {(provided) => {
                  return (
                    <div className="relative" ref={provided.innerRef} {...provided.droppableProps}>
                      {appState.addedCurrencies.map((curr, id) => {
                        return <Card key={curr.value} currency={curr} id={id} />
                      })}
                      {provided.placeholder}
                      {/* <CustomPlaceholder snapshot={snapshot} /> */}
                      <div
                        style={{
                          position: 'absolute',
                          top: placeholderProps.clientY,
                          left: placeholderProps.clientX,
                          height: placeholderProps.clientHeight,
                          background: 'tomato',
                          width: placeholderProps.clientWidth,
                          marginBottom: '2rem',
                          // paddn
                        }}
                      />
                    </div>
                  )
                }}
              </Droppable>
            </DragDropContext>
          </div>
        </div>
      </div>
    </>
  )
}

export default Content
