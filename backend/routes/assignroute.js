import express from 'express';
import * as controllers from '../controllers/assigncontroller.js';

console.log('📦 Available controllers in assignrouter:', Object.keys(controllers));

const assignrouter = express.Router();

assignrouter.post('/assingvehicle',controllers.assignVehicle)
assignrouter.get('/getAssignedVehicle',controllers.getAssignedVehicle)
assignrouter.put('/assigned-fuel',controllers.EditAssign)


export default assignrouter;