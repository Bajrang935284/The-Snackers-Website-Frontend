import React from 'react'
import Header from '../Header/Header'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div style={{height: "100vh"}}>
      <Header />
      
        <Outlet />
      
      <footer >
       
      </footer>
    </div>
  )
}

export default Layout

