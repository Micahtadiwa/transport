import express from "express";
import { verifyToken, authorizeRoles, ROLES } from "../middleware/auth.js";

const router = express.Router();

// Only Admin
router.get("/admin", verifyToken, authorizeRoles(ROLES.ADMIN), (req, res) => {
  res.json({ message: "Admin access granted" });
});

// Only Manager
router.get("/manager", verifyToken, authorizeRoles(ROLES.MANAGER), (req, res) => {
  res.json({ message: "Manager access granted" });
});

// Only Attendant
router.get("/attendant", verifyToken, authorizeRoles(ROLES.ATTENDANT), (req, res) => {
  res.json({ message: "Attendant access granted" });
});

// Only Driver
router.get("/driver", verifyToken, authorizeRoles(ROLES.DRIVER), (req, res) => {
  res.json({ message: "Driver access granted" });
});

// Multiple roles allowed
router.get(
  "/shared",
  verifyToken,
  authorizeRoles(ROLES.ADMIN, ROLES.MANAGER),
  (req, res) => {
    res.json({ message: "Admin or Manager access" });
  }
);

export default router;