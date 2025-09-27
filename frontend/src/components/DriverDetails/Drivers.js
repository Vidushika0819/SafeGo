import React, {useState, useEffect} from 'react'
import Nav from '../Nav/Nav'
import axios from 'axios';
import Driver from '../Driver/Driver'

const URL = "http://localhost:5005/drivers"

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
}  

function Drivers() {

 const [drivers, setDrivers] = useState([]);

 useEffect(() => {
  fetchHandler().then((data) => setDrivers(data.drivers));
 }, []);

  return (
    <div>
      <Nav/>
      <h1>Driver Details</h1>
      <div>
        {drivers && drivers.map((driver, i) => (
          <div key={i}>
            <Driver driver={driver} />
          </div>
        ))}
      </div>
      
    </div>
  )
}

export default Drivers
