import React from 'react'
import { useAdmin } from '../Context/AdminContext'
import AdminHeader from './Header/AdminHeader'
import AdminHero from './Hero/AdminHero'

const Admin = () => {
  const { admin, logout, signIn } = useAdmin();
  
  return (
    <div>
      <AdminHeader/>
      {admin ? <AdminHero/> : <p>please log in</p>}
    </div>
  )
}

export default Admin
