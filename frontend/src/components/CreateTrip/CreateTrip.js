import React, {useState} from 'react'
import Nav from '../Nav/Nav'
import {useNavigate } from "react-router";
import axios from 'axios';

function CreateTrip() {

 const history = useNavigate()
 const [inputs,setInputs] = useState ({
            Trip_ID: '',
            date: '',
            start_time: '',
            end_time: '',
            start_location: '',
            route: '',
            status: 'scheduled'
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
        history("/viewtrips");
    } catch (error) {
        console.error('Error creating trip:', error);
        alert('Failed to create trip: ' + (error.response?.data?.message || error.message));
    }
 }


 const sendRequest = async () => {
    await axios.post ("http://localhost:5005/trips", {
        Trip_ID: String(inputs.Trip_ID),
        date: inputs.date,
        start_time: String(inputs.start_time),
        end_time: String(inputs.end_time),
        start_location: String(inputs.start_location),
        route: String(inputs.route),
        status: String(inputs.status)
      });
  }

  return (
    <div>
      <Nav />
      <h1>Create Trip</h1>
      <form onSubmit={handleSubmit}>

        <div>
          <label>Trip ID:</label>
          <input
            type="text"
            name="Trip_ID"
            onChange={handleChange}
            value={inputs.Trip_ID} required />
        </div>

        <div>
          <label>Date:</label>
          <input
            type="date"
            name="date"
            onChange={handleChange}
            value={inputs.date} required />
        </div>

        <div>
          <label>Start Time:</label>
          <input
            type="time"
            name="start_time"
            onChange={handleChange}
            value={inputs.start_time} required />
        </div>

        <div>
          <label>End Time:</label>
          <input
            type="time"
            name="end_time"
            onChange={handleChange}
            value={inputs.end_time} required />
        </div>

        <div>
          <label>Start Location:</label>
          <input
            type="text"
            name="start_location"
            onChange={handleChange}
            value={inputs.start_location} required />
        </div>

        <div>
          <label>Route:</label>
          <input
            type="text"
            name="route"
            onChange={handleChange}
            value={inputs.route} required />
        </div>

        <div>
          <label>Status:</label>
          <select
            name="status"
            onChange={handleChange}
            value={inputs.status} required>
            <option value="scheduled">Scheduled</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>

        <button type="submit">Create Trip</button>

      </form>
    </div>
  )
}

export default CreateTrip
