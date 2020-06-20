import React from 'react'
import Header from '../Header/Header'
import Content from '../Content/Content'
import Scroll from '../Scroll/Scroll'
import Footer from '../Footer/Footer'

const Container = () => {
  return (
    <>
      <div className="container mx-auto lg:px-4 xl:px-32">
        <Header />
        <Content />
        <Scroll />
        <Footer />
      </div>
    </>
  )
}

export default Container
