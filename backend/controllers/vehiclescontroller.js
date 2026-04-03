import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db/db.js';
import express from 'express';

export const addVehicle = async (req, res) => {
  try {

    const { NumberPlate, make, model, ChassisNumber } = req.body;

    /* ==============================
       BASIC VALIDATION
    ============================== */

    if (!NumberPlate || !make || !model || !ChassisNumber) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const numberPlate = NumberPlate.trim();
    const vehicleMake = make.trim();
    const vehicleModel = model.trim();
    const chassisNumber = ChassisNumber.trim();

    if (
      numberPlate === "" ||
      vehicleMake === "" ||
      vehicleModel === "" ||
      chassisNumber === ""
    ) {
      return res.status(400).json({
        success: false,
        message: "Fields cannot be empty"
      });
    }

    /* ==============================
       CHECK DUPLICATE VEHICLE
    ============================== */

    const [existing] = await db.query(
      "SELECT id FROM vehicles WHERE chassis_number = ? OR number_plate = ?",
      [chassisNumber, numberPlate]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Vehicle with this chassis number or number plate already exists"
      });
    }

    /* ==============================
       INSERT VEHICLE
    ============================== */

    const insertSql = `
      INSERT INTO vehicles (number_plate, make, model, chassis_number)
      VALUES (?, ?, ?, ?)
    `;

    const [result] = await db.query(insertSql, [
      numberPlate,
      vehicleMake,
      vehicleModel,
      chassisNumber
    ]);

    return res.status(201).json({
      success: true,
      message: "Vehicle added successfully",
      vehicleId: result.insertId
    });

  } catch (error) {

    console.error("Add vehicle error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });

  }
};

export const getVehicles = async (req, res) => {
    try {
       

        const [rows] = await db.query("SELECT * FROM vehicles");

        res.json({
            success: true,
            vehicles: rows
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const vehicleSelect = async (req, res) => {
  try {
    const sql = "SELECT id, number_plate as regNumber FROM vehicles";

    const [result] = await db.query(sql);

    res.json(result);
  } catch (err) {
    console.error("DB ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};