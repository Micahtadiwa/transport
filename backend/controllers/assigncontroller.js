import db from '../db/db.js';


export const assignVehicle = async (req, res) => {
  try {
    const { userId, vehicleId, notes } = req.body;

    if (!userId || !vehicleId) {
      return res.status(400).json({ error: "User and Vehicle are required" });
    }

    const sql = `
      INSERT INTO assignvehicles (user_id, vehicle_id,notes)
      VALUES (?, ?, ?)
    `;

    const [result] = await db.query(sql, [userId, vehicleId, notes]);

    res.status(201).json({
      message: "Vehicle assigned successfully",
      assignmentId: result.insertId,
    });

  } catch (err) {
    console.error("ASSIGN ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getAssignedVehicle = async (req, res) => {
  try {
    const sql = `
      SELECT 
        av.id,
        av.notes,
        av.created_at,
        av.assigned,   -- ✅ ADD THIS
        u.Username AS user,
        v.number_plate AS vehicle,
        v.make,
        v.model
      FROM assignvehicles av
      JOIN user u ON av.user_id = u.UserID
      JOIN vehicles v ON av.vehicle_id = v.id
      ORDER BY av.created_at DESC
    `;

    const [results] = await db.query(sql);

    res.status(200).json(results);

  } catch (err) {
    console.error("GET ASSIGN ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};


export const EditAssign=async (req, res) => {
  const { id } = req.params;
  const { assigned } = req.body;

  const sql = "UPDATE assignvehicles SET assigned = ? WHERE id = ?";
  const result = await db.query(sql, [assigned, id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Updated successfully" });
  });
};