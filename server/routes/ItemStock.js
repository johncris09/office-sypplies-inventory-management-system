import express from "express";
import db from "../db.js";
const router = express.Router();
const table = "item_stock";

router.get("/", async (req, res, next) => {
  const q =
    `SELECT
          p.id AS item_id,
          p.name AS item_name,
          COALESCE(SUM(ps.quantity_added), 0) AS total_quantity,
          p.unit AS unit
      FROM
          item AS p
      left JOIN
          item_stock AS ps ON p.id = ps.item_id
      GROUP BY
          p.id, p.name, p.unit
      ORDER BY  p.name`;
  db.query(q, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});



router.get("/item/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const q = ` 
      SELECT
          i.id,
          i.quantity_added,
          COALESCE(s.borrowed_quantity, 0) AS borrowed_quantity,
          COALESCE(s.borrowed_quantity, 0) + COALESCE(i.quantity_added, 0) AS total_quantity,
          i.date_added
      FROM
          item_stock AS i
      LEFT JOIN(
          SELECT item_stock_id,
              SUM(borrowed_quantity) AS borrowed_quantity
          FROM
              track_item_quantity
          GROUP BY
              item_stock_id
      ) AS s
      ON
          i.id = s.item_stock_id
      WHERE
          item_id = ?
      ORDER BY
          date_added
      DESC 
    `;

    db.query(q, [id], (err, results) => {
      if (err) {
        console.error("Error fetching data:", err);
        res.status(500).json({ error: "Error fetching data" });
        return;
      }

      res.json(results);
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error fetching data" });
  }
});


router.post("/", async (req, res, next) => {
  try {
    const { item_id, quantity_added, date_added } = req.body;
    const newData = {
      item_id: item_id.replace(/\s+/g, " ").trim(),
      quantity_added: quantity_added.replace(/\s+/g, " ").trim(),
      date_added: date_added.replace(/\s+/g, " ").trim(),
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
    const { id, quantity_added, item_id, date_added } = req.body;  

    // Perform the update operation
    const q = "UPDATE " + table + " SET quantity_added = ?, item_id = ?, date_added = ? WHERE id = ?";
    db.query(q, [quantity_added, item_id, date_added, id], (err, result) => {
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
