import React, { useEffect, useState } from 'react'
import { CSSTransition } from 'react-transition-group'

import styles from './Scroll.module.scss'
import transition from './transition.module.scss'

const Scroll = () => {
  const [showScroll, setShowScroll] = useState(false)

  const handleScroll = () => {
    if (!showScroll && window.pageYOffset > 200) {
      console.log('show')

      setShowScroll(true)
    } else if (showScroll && window.pageYOffset <= 200) {
      setShowScroll(false)
    }
  }

  window.addEventListener('scroll', handleScroll)
  const nodeRef = React.createRef()

  return (
    <>
      <CSSTransition nodeRef={nodeRef} in={showScroll} timeout={500} classNames={transition} unmountOnExit>
        <div ref={nodeRef} id={styles.round}>
          <div id={styles['relative-wrapper']}>
            <div id={`${styles.wrapper}`}>
              <div className={styles.arrow} id={styles['top-arrow']}></div>
              <div className={styles.arrow} id={styles['bottom-arrow']}></div>
            </div>
          </div>
        </div>
      </CSSTransition>
    </>
  )
}

export default Scroll
