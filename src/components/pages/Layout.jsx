import React from 'react'
import Header from '../Header/Header'
import { Outlet , useLocation} from 'react-router-dom'
import MobileFooter from '../MobileFooter/MobileFooter'
import MobileCheckoutBar from '../MobileCheckout/MobileCheckoutBar'

const Layout = () => {

  const location = useLocation();
  const hideMobileBar = location.pathname === "/checkout" || location.pathname === "/payment";
 
  const isMobile = window.innerWidth <= 768;

  const hideHeader =  isMobile && location.pathname === "/profile" || isMobile && location.pathname === "/profile/edit-profile";
  return (
    <div style={{height: "100vh"}}>
         {!hideHeader && <Header />}
      
        <Outlet />
       
        {!hideMobileBar && <MobileCheckoutBar />}

       { !hideMobileBar && <MobileFooter />}
    </div>
      
   
  )
}

export default Layout


