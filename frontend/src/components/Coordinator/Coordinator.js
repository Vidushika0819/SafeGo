import React from 'react'
import {Link} from "react-router-dom";
import axios from 'axios';

function Coordinator(props) {
  const { coordinatorId, fullName, phoneNumber, DOB, email, address, password } = props.coordinator;

const deleteHandler = async () => {
  if (window.confirm('Are you sure you want to delete this coordinator?')) {
    try {
      await axios.delete(`http://localhost:5005/coordinators/${props.coordinator._id}`);
      alert('Coordinator deleted successfully');
      window.location.reload(); // Refresh to update the list
    } catch (error) {
      console.error('Error deleting coordinator:', error);
      alert('Failed to delete coordinator');
    }
  }
};

  return (
    <div>
      <br />
      <h3>Coordinator ID: {coordinatorId}</h3>
      <p>Full Name: {fullName}</p>
      <p>Phone Number: {phoneNumber}</p>
      <p>Date of Birth: {DOB}</p>
      <p>Email: {email}</p>
      <p>Address: {address}</p>
      <p>Password: {password}</p>

      <Link to={`/viewcoordinator/${props.coordinator._id}`}>
      <button>Update coordinator details</button>
      </Link>

      <button onClick = {deleteHandler}>Delete</button>

      <br />
      <hr />
    </div>
  )
}

export default Coordinator
