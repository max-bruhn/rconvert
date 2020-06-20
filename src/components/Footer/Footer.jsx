import React from 'react'

import styles from './Footer.module.scss'

const Footer = () => {
  return (
    <>
      <div className={`${styles['flex-shrink']} h-16 my-4 px-4 md:px-8 lg:px-12 xl:px-16 text-gray-600 `}>
        <div className="float-left">
          <span className="block">R&#183;CONVERT &#169; {new Date().getFullYear()}</span>
          <span className="block">
            Powered by <a href="https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html">European Central Bank</a>
          </span>
        </div>

        <div className="float-right ">
          <span className="block">Designed &amp; Developed by</span>
          <a className="block float-right " href="https://maxbruhn.com">
            Max Bruhn
          </a>
        </div>
      </div>
    </>
  )
}

export default React.memo(Footer)
