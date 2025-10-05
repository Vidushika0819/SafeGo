import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const StudentLogin = () => {
  const navigate = useNavigate();
  const [studentID, setStudentID] = useState("");

  const handleStudentTypeSelection = (studentType) => {
    if (!studentID.trim()) {
      alert("Please enter a Student ID");
      return;
    }
    navigate(`/seat-reservation?type=${studentType}&studentID=${studentID.trim()}`);
  };

  return (
    <div className="student-login-container">
      <div className="student-login-card">
        <h1 className="student-login-title">
          SafeGo Student Portal
        </h1>
        
        {/* Student ID Input */}
        <div className="form-group">
          <label className="form-label">
            Student ID
          </label>
          <input
            type="text"
            value={studentID}
            onChange={(e) => setStudentID(e.target.value)}
            placeholder="Enter your Student ID"
            className="form-input"
          />
        </div>
        
        <div className="student-type-buttons">
          <button
            onClick={() => handleStudentTypeSelection("Regular")}
            className="login-button regular-button"
          >
            Login as Regular Student
          </button>
          
          <button
            onClick={() => handleStudentTypeSelection("Temporary")}
            className="login-button temporary-button"
          >
            Login as Temporary Student
          </button>
        </div>
        
        <div className="welcome-note">
          <p className="welcome-text">
            <strong>Welcome to SafeGo!</strong> Please enter your Student ID and select your student type to access the bus seat reservation system.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;