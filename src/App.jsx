
import { BrowserRouter,Routes,Route } from 'react-router-dom';

import Home from './components/Home/Home';
import Layout from './components/pages/Layout';
import { Search } from 'lucide-react';
import SearchIteam from './components/Search/Search';
import { MenuProvider } from './components/Context/MenuContext';
import { CartProvider } from './components/Context/CartContext';
import { AddressProvider } from './components/Context/AddressContext';
import { UserProvider } from './components/Context/UserContext';
import { AdminProvider } from './components/Context/AdminContext';
import { CanteenProvider } from './components/Context/CanteenSettingsContext';
import Menu from './components/Menu/Menu';
import Checkout from './components/Checkout/Checkout';
import Payment from './components/payment/Payment';
import Profile from './components/Profile/Profile';
import Admin from './components/Admin/Admin';
import { OrderProvider } from './components/Context/OrderContaxt';
import DeliveryAddressPage from './components/DeliveryAddressPage';

function App() {
  

  return (
    <>
     <div>
     <BrowserRouter>
      <MenuProvider>
     <AddressProvider>
     <UserProvider>
      <CartProvider>
        <AdminProvider>
       <OrderProvider> 
       <CanteenProvider>
       <Routes>
        <Route path='/admin' element= {<Admin/>}/> 
        <Route path='/' element= {<Layout/>}> 
        
          <Route path='/' element= {<Home/>}/>
          
          <Route path='/search' element= {<SearchIteam/>}/>
          <Route path='/menu' element= {<Menu/>}/>
          <Route path='/checkout' element= {<Checkout/>}/>
          <Route path='/payment' element={<Payment/>}/>
          <Route path='/profile' element={<Profile/>}/>
          <Route path="/profile/orders" element={<Profile />} />
          <Route path="/profile/delivery-address" element={<DeliveryAddressPage />} />
        </Route>
      </Routes> 
       </CanteenProvider>
       </OrderProvider>
        </AdminProvider>
      </CartProvider>
      </UserProvider>
     </AddressProvider>
     </MenuProvider>
      </BrowserRouter>
     </div>
  
    
   

    </>
  )
}

export default App
