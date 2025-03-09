import React from 'react'
import "../Home/home.css";
import { useUser } from '../Context/UserContext';
import { useMenu } from '../Context/MenuContext';
import { useNavigate } from 'react-router-dom';
const Home = () => {

  const {user} = useUser();
  const { menuItems, loading, error } = useMenu();

  const navigate = useNavigate();

  const handleOnclick = ()=>{
    navigate('/search');
  }
  return (
    <div className='home'>
  <h2 className='hero-heading'>Order Online, Skip the Line!</h2>
  <div className='hero-section'>
  
    {/* Delivery Card */}
    <div className='card delivery-card' onClick={handleOnclick} >
   
      <div className="card-content" >
        <h3>Snackers@Hostel</h3>
        <p className='card-description'>
          Deliver your favorites straight to your hostel. Fast & fresh!
        </p>
        <div className="cta-section">
          <button className='cta-btn delivery-cta'>
            Order to Hostel →
          </button>
          <div className="card-image ">
            <div className='delivery-image '>
              <img width={250} src="https://i.pinimg.com/originals/ca/8c/e0/ca8ce0e32164abfeb314767e919120ee.jpg" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Pickup Card */}
    <div className='card pickup-card' onClick={handleOnclick}>
      <div className="card-content">
        <h3>Snackers Quick Pickup ⚡</h3>
        <p className='card-description'>
        Your order will be prepared. We'll notify you when it's ready for pickup.
        </p>
        <div className="cta-section">
          <button className='cta-btn pickup-cta'>
            Reserve & Pickup →
          </button>
          <div className="card-image ">
            <div className='pickup-image '>
              <img width={300} src="https://images.ctfassets.net/trvmqu12jq2l/2fJeVuQu2dnsTUVgZ7fP5W/87f77ed7850a9acc96dba69c52e1b346/Copy_of_Untitled_Design.png?w=1200&h=1073&fm=png&f=faces&fit=fill" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <hr className='hr'></hr>
  <div className="random"></div>
</div>

  )
}

export default Home
