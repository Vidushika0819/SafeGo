import React from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios';

function Trip(props) {
  const { Trip_ID, date, start_time, end_time, start_location, route, status, _id } = props.trip;

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      try {
        await axios.delete(`http://localhost:5005/trips/${_id}`);
        alert('Trip deleted successfully');
        window.location.reload(); // Refresh to update the list
      } catch (error) {
        console.error('Error deleting trip:', error);
        alert('Failed to delete trip');
      }
    }
  };

  return (
    <div>
      <br />
      <h3>Trip ID: {Trip_ID}</h3>
      <p>Date: {new Date(date).toLocaleDateString()}</p>
      <p>Start Time: {start_time}</p>
      <p>End Time: {end_time}</p>
      <p>Start Location: {start_location}</p>
      <p>Route: {route}</p>
      <p>Status: {status}</p>

      <Link to={`/updatetrip/${_id}`}>
        <button>Update Trip</button>
      </Link>
      <button onClick={handleDelete}>Delete Trip</button>

      <br />
      <hr />
    </div>
  )
}

export default Trip
