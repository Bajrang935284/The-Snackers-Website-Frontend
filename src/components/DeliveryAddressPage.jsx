import React from 'react';
import DeliveryAddressSelector from './address/DeliveryAddress';
import './address/deliveryAddress.css';

const DeliveryAddressPage = () => {
  return (
    <div className="delivery-address-page">
      <h1>Delivery Address</h1>
      <DeliveryAddressSelector />
    </div>
  );
};

export default DeliveryAddressPage;
