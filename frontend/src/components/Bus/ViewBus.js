import React, {useState, useEffect} from 'react'
import Nav from '../Nav/Nav'
import axios from 'axios';
import Bus from './Bus'

const URL = "http://localhost:5005/buses"

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
}

function ViewBus() {

 const [buses, setBuses] = useState([]);

 useEffect(() => {
  fetchHandler().then((data) => setBuses(data.buses));
 }, []);

  return (
    <div>
      <Nav/>
      <h1>Bus Details</h1>
      <div>
        {buses && buses.map((bus, i) => (
          <div key={i}>
            <Bus bus={bus} />
          </div>
        ))}
      </div>

    </div>
  )
}

export default ViewBus
