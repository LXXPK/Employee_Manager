const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());



app.get('/', (req, res) => {
    res.send('Welcome to the MERN Employee Management System API');
});

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log('MongoDB connection error:', err));


app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/uploads', express.static('uploads'));



app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
