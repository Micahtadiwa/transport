import express from 'express';
import * as controllers from '../controllers/vehiclescontroller.js';


console.log('📦 Available controllers in vehicleRoutes:', Object.keys(controllers));

const vehiclesrouter = express.Router();

// Auth routes
vehiclesrouter.post('/add-vehicle', controllers.addVehicle);
vehiclesrouter.get('/get-vehicles', controllers.getVehicles);
vehiclesrouter.get('/vehicle-select',controllers.vehicleSelect)


export default vehiclesrouter;