import React from 'react'
import Nav from '../Nav/Nav'
import {useNavigate } from "react-router";
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function UpdateCoordinator() {

    const [inputs, setInputs] = useState({});
    const id = useParams().id;
    const history = useNavigate();

    useEffect(() => {
        const fetchHandler = async () => {
            try {
                const res = await axios.get(`http://localhost:5005/coordinators/${id}`);
                setInputs(res.data.coordinator);
            } catch (error) {
                console.error('Error fetching coordinator:', error);
                alert('Failed to load coordinator details');
            }
        };
        fetchHandler();
    }, [id]);

    const sendRequest = async () => {
        await axios.put(`http://localhost:5005/coordinators/${id}`, {
            coordinatorId: String(inputs.coordinatorId),
            fullName: String(inputs.fullName),
            phoneNumber: String(inputs.phoneNumber),
            DOB: inputs.DOB,
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
            history("/viewcoordinator");
        } catch (error) {
            console.error('Error updating coordinator:', error);
            alert('Failed to update coordinator: ' + (error.response?.data?.message || error.message));
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
        <h1>Update Coordinator</h1>
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

        <button type="submit">Update Coordinator</button>

      </form>

    </div>
  )
}

export default UpdateCoordinator
