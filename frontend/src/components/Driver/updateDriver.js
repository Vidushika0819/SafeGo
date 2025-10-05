import React from 'react'
import Nav from '../Nav/Nav'
import {useNavigate } from "react-router";
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function UpdateDriver() {

    const [inputs, setInputs] = useState({});
    const id = useParams().id;
    const history = useNavigate();

    useEffect(() => {
        const fetchHandler = async () => {
            try {
                const res = await axios.get(`http://localhost:5005/drivers/${id}`);
                setInputs(res.data.driver);
            } catch (error) {
                console.error('Error fetching driver:', error);
                alert('Failed to load driver details');
            }
        };
        fetchHandler();
    }, [id]);

    const sendRequest = async () => {
        await axios.put(`http://localhost:5005/drivers/${id}`, {
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
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(inputs);
        try {
            await sendRequest();
            history("/viewdriver");
        } catch (error) {
            console.error('Error updating driver:', error);
            alert('Failed to update driver: ' + (error.response?.data?.message || error.message));
        }
    }

    const handleChange = (e) => {
        setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    };



  return (
    <div>
        <h1>Update Driver</h1> 
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

        <button type="submit">Update Driver</button>
           
      </form>   
      
    </div>
  )
}

export default UpdateDriver
