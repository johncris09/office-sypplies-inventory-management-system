import express from "express";
import db from "../db.js";
const router = express.Router();
const table = "item";

router.get("/", async (req, res, next) => {
  const q =
    `SELECT
      n.id as item_id,
      n.name as item_name,
      n.unit as unit,
      COALESCE(s.available_stock, 0)  AS available_stock,
      COALESCE(t.quantity_borrowed, 0) AS quantity_borrowed,
      COALESCE(s.available_stock, 0) + COALESCE(t.quantity_borrowed, 0) AS total_quantity
  FROM
      item AS n
  LEFT JOIN
      (
          SELECT
              item_id,
              SUM(quantity_added) AS available_stock
          FROM
              item_stock
          GROUP BY
              item_id
      ) AS s ON n.id = s.item_id
  LEFT JOIN
      (
          SELECT
              item_id,
              SUM(quantity_borrowed) AS quantity_borrowed
          FROM
              transaction
          GROUP BY
              item_id
      ) AS t ON n.id = t.item_id
    Order by n.name;`;
  db.query(q, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

router.get("/userItem", async (req, res, next) => {
  const q =
    `SELECT
        p.id AS item_id,
        p.name AS item_name,
        COALESCE(SUM(ps.quantity_added),
        0) AS total_quantity,
        p.unit AS unit
    FROM
        item AS p
    LEFT JOIN item_stock AS ps
    ON
        p.id = ps.item_id
    GROUP BY
        p.id,
        p.name,
        p.unit
    HAVING
        total_quantity > 0
    ORDER BY
        p.name;`;
  db.query(q, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

router.post("/", async (req, res, next) => {
  try {
    const { name, unit } = req.body;
    const newData = {
      name: name.replace(/\s+/g, " ").trim(),
      unit: unit.replace(/\s+/g, " ").trim(),
    };
    const q = "INSERT INTO " + table + " SET ?";

    db.query(q, newData, (err, result) => {
      if (err) {
        console.error("Error inserting data:", err);
        res.status(500).json({ error: err.sqlMessage });
        return;
      }

      console.log("Data inserted successfully:", result);
      res.status(201).json({ message: "Data inserted successfully" });
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error inserting data" });
  }
});

router.put("/", async (req, res, next) => {
  try {
    const { id, name, unit } = req.body;  

    // Perform the update operation
    const q = "UPDATE " + table + " SET name = ?, unit = ? WHERE id = ?";
    db.query(q, [name, unit, id], (err, result) => {
      if (err) {
        console.error("Error updating data:", err);
        res.status(500).json({ error: "Error updating data" });
        return;
      }

      console.log("Data updated successfully:", result);
      res.status(200).json({ message: "Data updated successfully" });
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error updating data" });
  }
});

router.delete("/", async (req, res, next) => {
  try {
    const { id } = req.body;
    const q = "DELETE FROM " + table + " WHERE id = ?";
    db.query(q, [id], (err, result) => {
      if (err) {
        console.error("Error deleting data:", err);
        res.status(500).json({ error: "Error deleting data" });
        return;
      }

      console.log("Data deleted successfully:", result);
      res.status(200).json({ message: "Data deleted successfully" });
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error deleting data" });
  }
});

export default router;
