import React, {useState}from 'react'
import Nav from '../Nav/Nav'
import {useNavigate } from "react-router";
import axios from 'axios';

function AddDriver() {

 const history = useNavigate()
 const [inputs,setInputs] = useState ({
            name: '',
            licenseNumber: '',
            phoneNumber: '',
            vehicleType: '',
            vehicleNumber: '',
            age: '',
            experienceYears: '',
            email: '',
            address: '',
            password: ''
 });


 const handleChange = (e) => {
    setInputs((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value
    }));
 };


 const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(inputs);
    try {
        await sendRequest();
        history("/viewdriver");
    } catch (error) {
        console.error('Error adding driver:', error);
        alert('Failed to add driver: ' + (error.response?.data?.message || error.message));
    }
 }
 

 const sendRequest = async () => {
    await axios.post ("http://localhost:5005/drivers", {

        name: String(inputs.name),
        licenseNumber: String(inputs.licenseNumber),
        phoneNumber: String(inputs.phoneNumber),
        vehicleType: String(inputs.vehicleType),
        vehicleNumber: String(inputs.vehicleNumber),
        age: Number(inputs.age),
        experienceYears: Number(inputs.experienceYears),
        email: String(inputs.email),
        address: String(inputs.address),
        password: String(inputs.password)

      });
  }

  return (
    <div>
      <Nav />
      <h1>Add Driver</h1>
      <form onSubmit={handleSubmit}>

        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            onChange={handleChange}
            value={inputs.name} required />
        </div><br/>

        <div>
          <label>License Number:</label>
          <input
            type="text"
            name="licenseNumber"
            onChange={handleChange}
            value={inputs.licenseNumber} required />
        </div><br/>

        <div>
          <label>Phone Number:</label>
          <input
            type="text"
            name="phoneNumber"
            onChange={handleChange}
            value={inputs.phoneNumber} required />
        </div><br/>

        <div>
          <label>Vehicle Type:</label>
          <input
            type="text"
            name="vehicleType"
            onChange={handleChange}
            value={inputs.vehicleType} required />
        </div><br/>

        <div>
          <label>Vehicle Number:</label>
          <input
            type="text"
            name="vehicleNumber"
            onChange={handleChange}
            value={inputs.vehicleNumber} required />
        </div><br/>

        <div>
          <label>Age:</label>
          <input
            type="text"
            name="age"
            onChange={handleChange}
            value={inputs.age} required />
        </div><br/>

        <div>
          <label>Years of Experience:</label>
          <input
            type="text"
            name="experienceYears"
            onChange={handleChange}
            value={inputs.experienceYears} required />
        </div><br/>

        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            onChange={handleChange}
            value={inputs.email} required />
        </div><br/>

        <div>
          <label>Address:</label>
          <input 
            type="text" 
            name="address"
            onChange={handleChange}  
            value={inputs.address} required />
        </div><br/>

        <div>
          <label>Password:</label>
          <input 
            type="password" 
            name="password"
            onChange={handleChange}
            value={inputs.password} required />
        </div><br/>

        <button type="submit">Add Driver</button>        
           
      </form>    
    </div>
  )
}

export default AddDriver
