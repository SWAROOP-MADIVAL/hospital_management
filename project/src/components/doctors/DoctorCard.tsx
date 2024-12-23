import React, { useState } from 'react';
import { Doctor } from '../../types';
import { AppointmentForm } from '../appointments/AppointmentForm';
import { createAppointment } from '../../api';
import { Calendar, Clock, Award } from 'lucide-react';

interface DoctorCardProps {
  doctor: Doctor;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);

  const handleBookAppointment = async (date: string, time: string) => {
    try {
      await createAppointment({
        doctorId: doctor.id,
        date,
        time,
      });
      setShowAppointmentForm(false);
      // You might want to show a success message here
    } catch (error) {
      console.error('Failed to book appointment:', error);
      // You might want to show an error message here
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{doctor.name}</h3>
        <div className="space-y-2 mb-4">
          <p className="flex items-center text-gray-600">
            <Award className="w-4 h-4 mr-2" />
            {doctor.specialization}
          </p>
          <p className="flex items-center text-gray-600">
            <Clock className="w-4 h-4 mr-2" />
            {doctor.experience} years experience
          </p>
          <div className="flex items-start text-gray-600">
            <Calendar className="w-4 h-4 mr-2 mt-1" />
            <div>
              <p className="font-medium">Available Times:</p>
              <ul className="list-disc list-inside pl-4">
                {doctor.availability.map((time) => (
                  <li key={time}>{time}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        <button
          onClick={() => setShowAppointmentForm(!showAppointmentForm)}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          Book Appointment
        </button>

        {showAppointmentForm && (
          <div className="mt-4">
            <AppointmentForm doctor={doctor} onSubmit={handleBookAppointment} />
          </div>
        )}
      </div>
    </div>
  );
};