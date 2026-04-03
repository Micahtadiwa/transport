import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db/db.js';



export const signup = async (req, res) => {
  try {
    const { Username, Email, Password, TermsAccepted } = req.body;
        
    // ✅ Validation
    if (!Username || !Email || !Password || TermsAccepted === undefined) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(Email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format"
      });
    }

    if (!TermsAccepted) {
      return res.status(400).json({
        success: false,
        message: "Terms must be accepted"
      });
    }

    // ✅ Always assign default role
    const userRole = "driver";

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(Password, 10);

    // ✅ Check if user exists
    const [existing] = await db.query(
      "SELECT * FROM `user` WHERE Email = ?",
      [Email]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email already registered"
      });
    }

    // ✅ Insert user with default role
    const [result] = await db.query(
      `INSERT INTO \`user\` (Username, Email, Password, TermsAccepted, Role) 
       VALUES (?, ?, ?, ?, ?)`,
      [Username, Email, hashedPassword, TermsAccepted, userRole]
    );

    // ✅ Generate JWT
    const token = jwt.sign(
      {
        userId: result.insertId,
        email: Email,
        Role: userRole
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        user_id: result.insertId,
        username: Username,
        email: Email,
        Role: userRole,
        token
      }
    });

  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Missing email or password",
      });
    }


    const sql = "SELECT * FROM User WHERE Email = ?";
    const [results] = await db.query(sql, [email]);

    if (results.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const user = results[0];

    const isMatch = await bcrypt.compare(password, user.Password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        userId: user.UserID,
        email: user.Email,
        Role: user.Role || "Driver",
      },
      process.env.JWT_SECRET,
      { expiresIn: "5m" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.UserID,
        email: user.Email,
        username: user.Username,
      },
    });

  } catch (error) {
    console.error("Login error:", error);   // 🔴 VERY IMPORTANT
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getUsers = async (req, res) => {
  try {
    const sql = "SELECT UserID, Username, Email, Role,IsActive FROM user";
    const [results] = await db.query(sql);

    res.json({
      success: true,
      stats: {
        user: results.length,
        active: results.filter(user => user.IsActive === 1).length,
        inactive: results.filter(user => user.IsActive === 0).length,
        pending: results.filter(user => user.Role === 'Pending').length,
        declined: results.filter(user => user.Role === 'Declined').length,
      },
      users: results
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const userList = async (req, res) => {
  try {
    const sql = "SELECT UserID, Username, Email, Role, IsActive FROM user";
    const [results] = await db.query(sql);

    res.status(200).json({
      success: true,
      users: results
    });

  } catch (error) {

    console.error("Error fetching users:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error"
    });

  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const sql = `
      SELECT UserID, Username, Email, Role, IsActive 
      FROM user 
      WHERE UserID = ?
    `;

    const [result] = await db.query(sql, [id]);

    if (result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(result[0]);

  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, role, isActive } = req.body;

    const sql = `
      UPDATE user 
      SET Username = ?, Email = ?, Role = ?, IsActive = ?
      WHERE UserID = ?
    `;

    const [result] = await db.query(sql, [
      username,
      email,
      role,
      isActive ? 1 : 0,
      id
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User updated successfully" });

  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const userSelect = async (req, res) => {
  try {
    const sql = "SELECT UserID AS id, UserName AS name FROM `user` WHERE IsActive = 1";

    const [result] = await db.query(sql);

    res.json(result);
  } catch (err) {
    console.error("DB ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};