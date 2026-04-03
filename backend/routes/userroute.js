import express from 'express';
import * as controllers from '../controllers/usercontroller.js';
import { verifyToken, authorizeRoles, ROLES } from "../middleware/auth.js";


console.log('📦 Available controllers in userRoutes:', Object.keys(controllers));

const userrouter = express.Router();

// Auth routesx``
userrouter.post('/signup', controllers.signup);
userrouter.post('/login', controllers.login);
userrouter.get(
  '/users',
  verifyToken,
  authorizeRoles(ROLES.ADMIN, ROLES.MANAGER),
  controllers.getUsers
);
userrouter.get('/userslist',
  verifyToken,
  authorizeRoles(ROLES.ADMIN, ROLES.MANAGER),
  controllers.userList);
userrouter.put(
  '/update-user/:id',
  verifyToken,
  authorizeRoles(ROLES.ADMIN, ROLES.MANAGER),
  controllers.updateUser
);
userrouter.put('/update-user/:id',
  verifyToken,
  authorizeRoles(ROLES.ADMIN, ROLES.MANAGER),
  controllers.updateUser);
userrouter.get('/userSelect',
  verifyToken,
  authorizeRoles(ROLES.ADMIN, ROLES.MANAGER),
  controllers.userSelect);


export default userrouter;