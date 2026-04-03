import dotenv from 'dotenv';
dotenv.config(); // This loads your .env file
import express from 'express';
import cors from 'cors';
import con from './db/db.js'; // Ensure this is imported for database connection
import userrouter from './routes/userroute.js';
import vehiclesrouter from './routes/vehiclesroutes.js';
import assignrouter from './routes/assignroute.js';
import accessrouter from './routes/accesRightroute.js'




const app = express();
const port = process.env.PORT || 5000; // ✅ FIXED: Use process.env.PORT, not VITE_API_URL

// CORS configuration - combine into one
app.use(cors({
    origin: 'http://localhost:5173', // Your frontend Vite port
    credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/auth', userrouter); 
app.use('/vehicles', vehiclesrouter); 
app.use('/assign',assignrouter)
app.use('/access',accessrouter)

// Test route
app.get('/', (req, res) => {
    res.send('Hello from the backend!');
});


app.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
    console.log(`📝 Auth routes available at http://localhost:${port}/auth`);
    console.log(`📊 Database connected:`, !!con);
});