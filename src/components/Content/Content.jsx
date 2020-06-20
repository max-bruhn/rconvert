import React, { useContext } from 'react'
import StateContext from '../../StateContext'
import DispatchContext from '../../DispatchContext'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'

import Card from '../Card/Card'
import Search from '../Search/Search'

const Content = () => {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  function onDragEnd(result) {
    const { destination, source, draggableId } = result
    if (!destination) {
      return
    }
    if (destination.droppableId === source.draggableId && destination.index === source.index) {
      return
    }

    const newAddedCurrencies = [...appState.addedCurrencies]

    newAddedCurrencies.splice(source.index, 1)
    newAddedCurrencies.splice(destination.index, 0, JSON.parse(draggableId))

    appDispatch({ type: 'updateOrder', value: newAddedCurrencies })
    appDispatch({ type: 'loadedAmountFromStorage', value: false })
  }

  return (
    <>
      <div className="container bg-gray-900 min-h-screen px-4 md:px-8 lg:px-12 lg:py-4 xl:px-16 xl:py-6 sm:rounded-lg">
        <div className="flex flex-wrap py-6">
          <div className="w-full sm:w-1/3  text-gray-600 my-3">
            <span>ADD CURRENCIES</span>
          </div>

          <div className="w-full sm:w-2/3 my-3">
            <Search />
          </div>

          <div className="w-full sm:w-1/3 text-gray-600 my-8">
            <span className="text-base inline-block">CURRENCIES</span> <br />
            <span className="text-sm pt-3 pr-5 inline-block">Drag a currency to the top or click on it, to make it the base currency.</span>
          </div>
          <div className="w-full sm:w-2/3   sm:my-8">
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId={'droppableId1'}>
                {(provided) => {
                  return (
                    <div className="relative" ref={provided.innerRef} {...provided.droppableProps}>
                      {appState.addedCurrencies.map((curr, id) => {
                        return <Card key={curr.value} currency={curr} id={id} />
                      })}
                      {provided.placeholder}
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

export default React.memo(Content)
