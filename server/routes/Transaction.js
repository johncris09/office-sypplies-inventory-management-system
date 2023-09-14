import express from "express";
import db from "../db.js";
const router = express.Router();
const table = "item";

// router.get("/", async (req, res, next) => {
//   const q =
//     `SELECT
//           p.id AS item_id,
//           p.name AS item_name,
//           COALESCE(SUM(ps.quantity_added), 0) AS total_quantity,
//           p.unit AS unit
//       FROM
//           item AS p
//       left JOIN
//           item_stock AS ps ON p.id = ps.item_id
//       GROUP BY
//           p.id, p.name, p.unit
//       ORDER BY  p.name`;
//   db.query(q, (err, result) => {
//     if (err) throw err;
//     res.json(result);
//   });
// });

router.post("/", async (req, res, next) => {
  try {
    // res.send(req.body)

    const currentDate = new Date();
    const date_added = currentDate.toISOString();

    req.body.forEach((item) => {
      let borrowedQuantity = item.quantity;
      const borrowQuery = `
      UPDATE item_stock
      SET quantity_added = CASE
        WHEN item_id = ? AND quantity_added >= ? THEN quantity_added - ?
        ELSE quantity_added
      END
      WHERE item_id = ?
      AND date_added = (
          SELECT MIN(date_added)
          FROM item_stock
          WHERE item_id = ?
      );
    `;

      db.query(
        borrowQuery,
        [
          item.item_id,
          item.quantity,
          item.quantity,
          item.item_id,
          item.item_id,
        ],
        (err, result) => {
          if (err) { 
            console.log("error");
          }

          // Check if the update affected any rows
          if (result.affectedRows === 0) { 
            console.log("No rows were updated");
          }

          const q =
            "INSERT INTO transaction SET item_id = ?, borrower_id = ?, quantity_borrowed = ?";

          db.query(
            q,
            [item.item_id, item.borrower, item.quantity, date_added],
            (err, result) => {
              if (err) {
                console.error("Error inserting data:", err);
                res.status(500).json({ error: err.sqlMessage });
                return;
              }

              console.log("Data inserted successfully:", result); 
            }
          ); 
          console.log("Borrow successful");
        }
      ); 
    });
    res.status(201).json({ message: "Data inserted successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error inserting data" });
  }
});

router.get("/borrowed_item", async (req, res, next) => {
  const q = `SELECT
        t.date_borrowed AS date_borrowed,
        b.name AS borrower_name,
        i.unit AS item_unit,
        i.name AS item_name,
        t.quantity_borrowed AS quantity_borrowed
    FROM
        transaction AS t
    INNER JOIN
        borrower AS b ON t.borrower_id = b.id
    INNER JOIN
        item AS i ON t.item_id = i.id
    order by t.date_borrowed desc;`;
  db.query(q, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

export default router;
