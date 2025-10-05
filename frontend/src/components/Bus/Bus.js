import React from 'react'
import {Link} from "react-router-dom";
import axios from 'axios';

function Bus(props) {
  const { busId, busNumber, busType, capacity, status } = props.bus;

const deleteHandler = async () => {
  if (window.confirm('Are you sure you want to delete this bus?')) {
    try {
      await axios.delete(`http://localhost:5005/buses/${props.bus._id}`);
      alert('Bus deleted successfully');
      window.location.reload(); // Refresh to update the list
    } catch (error) {
      console.error('Error deleting bus:', error);
      alert('Failed to delete bus');
    }
  }
};

  return (
    <div>
      <br />
      <h3>Bus ID: {busId}</h3>
      <p>Bus Number: {busNumber}</p>
      <p>Bus Type: {busType}</p>
      <p>Capacity: {capacity}</p>
      <p>Status: {status}</p>

      <Link to={`/viewbus/${props.bus._id}`}>
      <button>Update bus details</button>
      </Link>

      <button onClick = {deleteHandler}>Delete</button>

      <br />
      <hr />
    </div>
  )
}

export default Bus
