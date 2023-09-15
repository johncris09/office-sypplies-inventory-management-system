import express from "express";
import db from "../db.js";
const router = express.Router();
const table = "item";

router.get("/", async (req, res, next) => {
  
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

router.get("/getBorrowerBorrowedItem/:borrower_id", async (req, res, next) => {
  try {
    const borrower_id = req.params.borrower_id;
    const q = `
      SELECT
          t.date_borrowed AS date_borrowed,
          b.name AS borrower_name,
          i.unit AS item_unit,
          i.name AS item_name,
          t.quantity_borrowed AS quantity_borrowed
      FROM transaction AS
          t
      INNER JOIN borrower AS b
      ON
          t.borrower_id = b.id
      INNER JOIN item AS i
      ON
          t.item_id = i.id
      WHERE
          t.borrower_id = ?
      ORDER BY
          t.date_borrowed
      DESC;`;
    db.query(q, [borrower_id], (err, results) => {
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

router.get("/fetchItemBorrowedByDate", async (req, res, next) => {
  try {
    let item_id = req.query.item_id;
    let target_month = req.query.month;
    let target_year = req.query.year;

    const q = `
  SELECT
  transaction.item_id,
      dates.date as date_borrowed,
      SUM(
          IFNULL(
              transaction.quantity_borrowed,
              0
          )
      ) AS quantity
  FROM
      (
      SELECT
          DATE_ADD(
              LAST_DAY(CONCAT(${target_year}, '-', LPAD(${target_month}, 2, '0'), '-01')),
              INTERVAL 1 DAY
          ) - INTERVAL n DAY AS DATE
      FROM
          (
          SELECT
              n + 1 AS n
          FROM
              (
              SELECT
                  units.n + tens.n * 10 AS n
              FROM
                  (
                  SELECT
                      0 AS n
                  UNION ALL
                  SELECT
                      1
                  UNION ALL
                  SELECT
                      2
                  UNION ALL
                  SELECT
                      3
                  UNION ALL
                  SELECT
                      4
                  UNION ALL
                  SELECT
                      5
                  UNION ALL
                  SELECT
                      6
                  UNION ALL
                  SELECT
                      7
                  UNION ALL
                  SELECT
                      8
                  UNION ALL
                  SELECT
                      9
                  ) units
                  CROSS JOIN(
                      SELECT
                          0 AS n
                      UNION ALL
                      SELECT
                          1
                      UNION ALL
                      SELECT
                          2
                      UNION ALL
                      SELECT
                          3
                      UNION ALL
                      SELECT
                          4
                      UNION ALL
                      SELECT
                          5
                      UNION ALL
                      SELECT
                          6
                      UNION ALL
                      SELECT
                          7
                      UNION ALL
                      SELECT
                          8
                      UNION ALL
                      SELECT
                          9
                  ) tens
              ) numbers
          WHERE
              n BETWEEN 0 
              AND DAY(LAST_DAY(CONCAT(${target_year}, '-', LPAD(${target_month}, 2, '0'), '-01')))
      ) date_series
  ) dates
  LEFT JOIN transaction ON dates.date = DATE(transaction.date_borrowed) 
  AND ${item_id ? `transaction.item_id = ${item_id}` : "true"}
  WHERE
      MONTH(dates.date) = ${target_month}
      AND YEAR(dates.date) = ${target_year}
  GROUP BY
      dates.date
  ORDER BY
      dates.date;`;

    db.query(q, (err, results) => {
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
