import React, {useState, useEffect} from 'react'
import Nav from '../Nav/Nav'
import axios from 'axios';
import Trip from '../Trip/Trip'

const URL = "http://localhost:5005/trips"

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
}

function ViewTrips() {

 const [trips, setTrips] = useState([]);

 useEffect(() => {
  fetchHandler().then((data) => setTrips(data.trips));
 }, []);

  return (
    <div>
      <Nav/>
      <h1>Trip Details</h1>
      <div>
        {trips && trips.map((trip, i) => (
          <div key={i}>
            <Trip trip={trip} />
          </div>
        ))}
      </div>

    </div>
  )
}

export default ViewTrips
