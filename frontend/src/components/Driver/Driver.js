import React from 'react'
import {Link} from "react-router-dom";
import axios from 'axios';

function Driver(props) {
  const { name, licenseNumber, phoneNumber, vehicleType, vehicleNumber, age, experienceYears, email, address, password } = props.driver;

const deleteHandler = async () => {
  if (window.confirm('Are you sure you want to delete this driver?')) {
    try {
      await axios.delete(`http://localhost:5005/drivers/${props.driver._id}`);
      alert('Driver deleted successfully');
      window.location.reload(); // Refresh to update the list
    } catch (error) {
      console.error('Error deleting driver:', error);
      alert('Failed to delete driver');
    }
  }
};

  return (
    <div>
      <br />
      <h3>Driver Name: {name}</h3>
      <p>License Number: {licenseNumber}</p>
      <p>Phone Number: {phoneNumber}</p>
      <p>Vehicle Type: {vehicleType}</p>
      <p>Vehicle Number: {vehicleNumber}</p>
      <p>Age: {age}</p>
      <p>Years of Experience: {experienceYears}</p>
      <p>Email: {email}</p>
      <p>Address: {address}</p>
      <p>Password: {password}</p>

      <Link to={`/viewdriver/${props.driver._id}`}>
      <button>Update driver details</button>
      </Link>

      <button onClick = {deleteHandler}>Delete</button>

      <br />
      <hr />      
    </div>
  )
}

export default Driver
