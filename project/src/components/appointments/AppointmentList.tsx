import React, { useEffect, useState } from 'react';
import { getAppointments } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { Appointment } from '../../types';
import { Calendar, Clock, AlertCircle } from 'lucide-react';

export const AppointmentList = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const { bookAppointment } = useAuth();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const data = await getAppointments();
        setAppointments(data);
        setError('');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch appointments');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const addAppointment = async () => {
    try {
      const doctorEmail = prompt('Enter Doctor Email:');
      const date = prompt('Enter Date (YYYY-MM-DD):');
      const time = prompt('Enter Time (HH:mm):');
      if (!doctorEmail || !date || !time) return alert('All fields are required.');

      await bookAppointment({ doctorEmail, date, time });
      alert('Appointment booked successfully!');
      // Refresh appointments after booking
      const updatedAppointments = await getAppointments();
      setAppointments(updatedAppointments);
    } catch (error) {
      alert('Failed to book appointment: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
        <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Your Appointments</h2>
      {appointments.length === 0 ? (
        <>
          <p className="text-gray-500">No appointments found.</p>
          <button
            onClick={addAppointment}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Book an Appointment
          </button>
        </>
      ) : (
        <>
          <div className="grid gap-4">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-gray-700">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">
                    {new Date(appointment.date).toLocaleDateString(undefined, {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-gray-700">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span>{appointment.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      appointment.status === 'confirmed'
                        ? 'bg-green-100 text-green-800'
                        : appointment.status === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
            onClick={addAppointment}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Book an Appointment
          </button>
        </>
        
      )}
    </div>
  );
};
