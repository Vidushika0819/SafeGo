import React, {useState, useEffect} from 'react'
import Nav from '../Nav/Nav'
import axios from 'axios';
import Coordinator from './Coordinator'

const URL = "http://localhost:5005/coordinators"

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
}

function Coordinators() {

 const [coordinators, setCoordinators] = useState([]);

 useEffect(() => {
  fetchHandler().then((data) => setCoordinators(data.coordinators));
 }, []);

  return (
    <div>
      <Nav/>
      <h1>Coordinator Details</h1>
      <div>
        {coordinators && coordinators.map((coordinator, i) => (
          <div key={i}>
            <Coordinator coordinator={coordinator} />
          </div>
        ))}
      </div>

    </div>
  )
}

export default Coordinators
