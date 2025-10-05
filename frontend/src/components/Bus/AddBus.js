import React, {useState}from 'react'
import Nav from '../Nav/Nav'
import {useNavigate } from "react-router";
import axios from 'axios';

function AddBus() {

 const history = useNavigate()
 const [inputs,setInputs] = useState ({
            busId: '',
            busNumber: '',
            busType: '',
            capacity: '',
            status: 'active'
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
        history("/viewbus");
    } catch (error) {
        console.error('Error adding bus:', error);
        alert('Failed to add bus: ' + (error.response?.data?.message || error.message));
    }
 }


 const sendRequest = async () => {
    await axios.post ("http://localhost:5005/buses", {

        busId: String(inputs.busId),
        busNumber: String(inputs.busNumber),
        busType: String(inputs.busType),
        capacity: Number(inputs.capacity),
        status: String(inputs.status)

      });
  }

  return (
    <div>
      <Nav />
      <h1>Add Bus</h1>
      <form onSubmit={handleSubmit}>

        <div>
          <label>Bus ID:</label>
          <input
            type="text"
            name="busId"
            onChange={handleChange}
            value={inputs.busId} required />
        </div><br/>

        <div>
          <label>Bus Number/Plate:</label>
          <input
            type="text"
            name="busNumber"
            onChange={handleChange}
            value={inputs.busNumber} required />
        </div><br/>

        <div>
          <label>Bus Type:</label>
          <select
            name="busType"
            onChange={handleChange}
            value={inputs.busType} required>
            <option value="">Select Type</option>
            <option value="Van">Van</option>
            <option value="Mini Bus">Mini Bus</option>
            <option value="Coach">Coach</option>
          </select>
        </div><br/>

        <div>
          <label>Capacity:</label>
          <input
            type="number"
            name="capacity"
            onChange={handleChange}
            value={inputs.capacity} required />
        </div><br/>

        <div>
          <label>Status:</label>
          <select
            name="status"
            onChange={handleChange}
            value={inputs.status} required>
            <option value="active">Active</option>
            <option value="under maintenance">Under Maintenance</option>
            <option value="inactive">Inactive</option>
          </select>
        </div><br/>

        <button type="submit">Add Bus</button>

      </form>
    </div>
  )
}

export default AddBus
