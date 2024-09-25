const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const PORT = process.env.PORT || 5001;
const app = express();

app.use(cors());
app.use(express.json());

const url = process.env.ATLAS_URL; // MongoDB URL

// Connect to MongoDB
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch((error) => console.error('MongoDB connection failed:', error));

// Define schema for contact form
const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, required: true }
});

const Contact = mongoose.model('Contact', contactSchema);

// API route for submitting contact form
app.post('/api/contact', async (req, res) => {
    const { name, email, phone, message } = req.body;

    // Basic validation
    if (!name || !email || !phone || !message) {
        return res.status(400).send({ error: 'All fields are required' });
    }

    try {
        const newContact = new Contact({ name, email, phone, message });
        await newContact.save(); 
        res.status(201).send({ message: 'Information saved successfully!' });
    } catch (error) {
        res.status(500).send({ error: 'Failed to save information' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});
