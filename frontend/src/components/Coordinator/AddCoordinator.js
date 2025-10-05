import React, {useState}from 'react'
import Nav from '../Nav/Nav'
import {useNavigate } from "react-router";
import axios from 'axios';

function AddCoordinator() {

 const history = useNavigate()
 const [inputs,setInputs] = useState ({
            coordinatorId: '',
            fullName: '',
            phoneNumber: '',
            DOB: '',
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
        history("/viewcoordinator");
    } catch (error) {
        console.error('Error adding coordinator:', error);
        alert('Failed to add coordinator: ' + (error.response?.data?.message || error.message));
    }
 }


 const sendRequest = async () => {
    await axios.post ("http://localhost:5005/coordinators", {

        coordinatorId: String(inputs.coordinatorId),
        fullName: String(inputs.fullName),
        phoneNumber: String(inputs.phoneNumber),
        DOB: inputs.DOB,
        email: String(inputs.email),
        address: String(inputs.address),
        password: String(inputs.password)

      });
  }

  return (
    <div>
      <Nav />
      <h1>Add Coordinator</h1>
      <form onSubmit={handleSubmit}>

        <div>
          <label>Coordinator ID:</label>
          <input
            type="text"
            name="coordinatorId"
            onChange={handleChange}
            value={inputs.coordinatorId} required />
        </div><br/>

        <div>
          <label>Full Name:</label>
          <input
            type="text"
            name="fullName"
            onChange={handleChange}
            value={inputs.fullName} required />
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
          <label>Date of Birth:</label>
          <input
            type="date"
            name="DOB"
            onChange={handleChange}
            value={inputs.DOB} required />
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

        <button type="submit">Add Coordinator</button>

      </form>
    </div>
  )
}

export default AddCoordinator
