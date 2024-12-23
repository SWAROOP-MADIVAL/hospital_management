import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import User from './models/User.js';
import Appointment from './models/Appointment.js';

dotenv.config();

const app = express();
// app.use(cors());
app.use(cors({
  origin: 'http://localhost:5173', // Frontend's URL
}));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Auth middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) throw new Error();
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) throw new Error();
    
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate' });
  }
};

// Auth routes
app.post('/api/signup', async (req, res) => {
  try {
    console.log("Signup Backend");
    
    const user = new User(req.body); // Create user
    console.log("User Created");
    await user.save(); // Save to database
    console.log("Saved to Db");
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET); // Generate JWT
    console.log("Token Generated");CDATASection
    res.status(201).json({ user, token }); // Send response
    console.log("Response sent");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      throw new Error('Invalid login credentials');
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Doctor routes
app.get('/api/doctors', async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' });
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Appointment routes
app.post('/api/appointments', auth, async (req, res) => {
  try {
    const { doctorEmail, date, time } = req.body;

    // Find the doctor by email
    const doctor = await User.findOne({ email: doctorEmail, role: 'doctor' });
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    // Create the appointment
    const appointment = new Appointment({
      patientId: req.user._id,
      doctorId: doctor._id,
      date,
      time,
    });

    await appointment.save();
    res.status(201).json(appointment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});




app.get('/api/appointments', auth, async (req, res) => {
  try {
    const appointments = await Appointment.find({
      $or: [
        { patientId: req.user._id },
        { doctorId: req.user._id }
      ]
    }).populate('doctorId patientId');
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));