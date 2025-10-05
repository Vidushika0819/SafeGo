import React from 'react'
import Nav from '../Nav/Nav'
import {useNavigate } from "react-router";
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function UpdateBus() {

    const [inputs, setInputs] = useState({});
    const id = useParams().id;
    const history = useNavigate();

    useEffect(() => {
        const fetchHandler = async () => {
            try {
                const res = await axios.get(`http://localhost:5005/buses/${id}`);
                setInputs(res.data.bus);
            } catch (error) {
                console.error('Error fetching bus:', error);
                alert('Failed to load bus details');
            }
        };
        fetchHandler();
    }, [id]);

    const sendRequest = async () => {
        await axios.put(`http://localhost:5005/buses/${id}`, {
            busId: String(inputs.busId),
            busNumber: String(inputs.busNumber),
            busType: String(inputs.busType),
            capacity: Number(inputs.capacity),
            status: String(inputs.status)
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(inputs);
        try {
            await sendRequest();
            history("/viewbus");
        } catch (error) {
            console.error('Error updating bus:', error);
            alert('Failed to update bus: ' + (error.response?.data?.message || error.message));
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
        <h1>Update Bus</h1>
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

        <button type="submit">Update Bus</button>

      </form>

    </div>
  )
}

export default UpdateBus
