import React, { useEffect, useState } from 'react'

import styles from './Scroll.module.scss'

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

  return (
    <>
      <div id={styles.round}>
        <div id={styles['relative-wrapper']}>
          <div id={`${styles.wrapper}`}>
            <div className={styles.arrow} id={styles['top-arrow']}></div>
            <div className={styles.arrow} id={styles['bottom-arrow']}></div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Scroll
