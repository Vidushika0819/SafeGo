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
            status: 'scheduled',
            busId: '',
            driverId: '',
            coordinatorId: ''
 });

 const [buses, setBuses] = useState([]);
 const [drivers, setDrivers] = useState([]);
 const [coordinators, setCoordinators] = useState([]);

 const id = useParams().id;
 const history = useNavigate();

 useEffect(() => {
    const fetchData = async () => {
      try {
        const [tripRes, busesRes, driversRes, coordinatorsRes] = await Promise.all([
          axios.get(`http://localhost:5005/trips/${id}`),
          axios.get("http://localhost:5005/buses"),
          axios.get("http://localhost:5005/drivers"),
          axios.get("http://localhost:5005/coordinators")
        ]);
        setInputs(tripRes.data.trip);
        setBuses(busesRes.data.buses || []);
        setDrivers(driversRes.data.drivers || []);
        setCoordinators(coordinatorsRes.data.coordinators || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
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
        status: String(inputs.status),
        busId: inputs.busId,
        driverId: inputs.driverId,
        coordinatorId: inputs.coordinatorId
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

        <div>
          <label>Select Bus:</label>
          <select
            name="busId"
            onChange={handleChange}
            value={inputs.busId} required>
            <option value="">Select a Bus</option>
            {buses.map((bus) => (
              <option key={bus._id} value={bus._id}>
                {bus.busId} - {bus.busNumber} ({bus.busType})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Select Driver:</label>
          <select
            name="driverId"
            onChange={handleChange}
            value={inputs.driverId} required>
            <option value="">Select a Driver</option>
            {drivers.map((driver) => (
              <option key={driver._id} value={driver._id}>
                {driver.name} - {driver.licenseNumber}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Select Coordinator:</label>
          <select
            name="coordinatorId"
            onChange={handleChange}
            value={inputs.coordinatorId} required>
            <option value="">Select a Coordinator</option>
            {coordinators.map((coordinator) => (
              <option key={coordinator._id} value={coordinator._id}>
                {coordinator.fullName} - {coordinator.coordinatorId}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">Update Trip</button>

      </form>
    </div>
  )
}

export default UpdateTrip
