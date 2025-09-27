import React from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./components/Home/Home";
import AddDriver from "./components/AddDriver/AddDriver";
import Drivers from "./components/DriverDetails/Drivers";
import UpdateDriver from "./components/updateDriver/updateDriver";
import CreateTrip from "./components/CreateTrip/CreateTrip";
import ViewTrips from "./components/ViewTrips/ViewTrips";
import UpdateTrip from "./components/UpdateTrip/UpdateTrip";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mainhome" element={<Home />} />
        <Route path="/adddriver" element={<AddDriver />} />
        <Route path="/viewdriver" element={<Drivers />} />
        <Route path="/viewdriver/:id" element={<UpdateDriver />} />
        <Route path="/createtrip" element={<CreateTrip />} />
        <Route path="/viewtrips" element={<ViewTrips />} />
        <Route path="/updatetrip/:id" element={<UpdateTrip />} />
      </Routes>
    </div>
  );
}

export default App;
