import React from 'react'
import Header from '../Header/Header'
import { Outlet } from 'react-router-dom'
import MobileFooter from '../MobileFooter/MobileFooter'

const Layout = () => {
  return (
    <div style={{height: "100vh"}}>
      <Header />
      
        <Outlet />
      
      <MobileFooter/>
    </div>
  )
}

export default Layout

