import React, {useState, useEffect} from 'react'
import Nav from '../Nav/Nav'
import {useNavigate } from "react-router";
import axios from 'axios';
import { useParams } from 'react-router-dom';

function UpdateTrip() {

 const [inputs,setInputs] = useState ({
            Trip_ID: '',
            date: '',
            start_time: '',
            end_time: '',
            start_location: '',
            route: '',
            status: 'scheduled'
 });

 const id = useParams().id;
 const history = useNavigate();

 useEffect(() => {
    const fetchHandler = async () => {
        try {
            const res = await axios.get(`http://localhost:5005/trips/${id}`);
            setInputs(res.data.trip);
        } catch (error) {
            console.error('Error fetching trip:', error);
            alert('Failed to load trip details');
        }
    };
    fetchHandler();
 }, [id]);

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
        console.error('Error updating trip:', error);
        alert('Failed to update trip: ' + (error.response?.data?.message || error.message));
    }
 }

 const sendRequest = async () => {
    await axios.put (`http://localhost:5005/trips/${id}`, {
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
      <h1>Update Trip</h1>
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

        <button type="submit">Update Trip</button>

      </form>
    </div>
  )
}

export default UpdateTrip
