import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';  // Assuming you have a context to manage user authentication
import { useNavigate } from 'react-router-dom';

export const Home = () => {
  const { user } = useAuth();  // Assuming 'useAuth' provides the logged-in user
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch appointments if the user is a doctor
    if (user?.role === 'doctor') {
      fetchAppointments();
    }
  }, [user]);

  const fetchAppointments = async () => {
    try {
      const response = await fetch('/api/appointments', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const handleAppointment = () => {
    try {
      navigate("/appointments")
    } catch (error) {
      console.log("Could Not Book Appointments");
      
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Welcome to the Hospital Management System</h1>

      {user ? (
        <>
          <h2 className="text-xl font-semibold mb-2">Hello, {user.name}!</h2>
          <p className="text-lg mb-4">You are logged in as a {user.role}.</p>

          {user.role === 'doctor' && appointments.length > 0 ? (
            <div>
              <h3 className="text-lg font-semibold mb-2">Upcoming Appointments:</h3>
              <ul className="list-disc pl-5">
                {appointments.map((appointment) => (
                  <li key={appointment._id} className="mb-2">
                    <strong>Patient:</strong> {appointment.patientId.name} - <strong>Time:</strong> {appointment.date}
                  </li>
                ))}
              </ul>
            </div>
          ) : user.role === 'doctor' ? (
            <p>You have no upcoming appointments.</p>
          ) : (
            <>
              <p>You are a patient. Please view your appointments in the Patient Dashboard.</p>
              <button onClick={handleAppointment}  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Appointments</button>
            </>
            
          )}
        </>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};
