import jwt from 'jsonwebtoken';


export const verifyToken = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ message: "No token" });
  }

  const token = header.split(" ")[1];

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    console.log("JWT ERROR:", err.message); // 👈 ADD THIS
    return res.status(403).json({ message: "Invalid token" });
  }
};


export const ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
  ATTENDANT: "attendant",
  DRIVER: "driver"
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // 🔒 Safety check
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  };
};
