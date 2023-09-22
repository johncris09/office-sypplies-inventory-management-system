import express from "express";
import db from "../db.js";
import util from "util"; // To promisify MySQL queries
const router = express.Router();
const table = "item";

// Promisify MySQL queries
const query = util.promisify(db.query).bind(db);

router.get("/", async (req, res, next) => {
  const q = `
  SELECT
    t.date_borrowed,
    b.name AS borrower_name,
    item.name AS item_name,
    t.borrowed_quantity as quantity_borrowed,
    item.unit AS item_unit
  FROM
    track_item_quantity AS t,
    item_stock AS i,
    borrower AS b,
    item
  WHERE
    i.id = t.item_stock_id AND t.borrower_id = b.id AND i.item_id = item.id
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
    let borrowedItemDetails = req.body;

    for (const borrowedItem of borrowedItemDetails) {
      const { item_id, quantity, borrower } = borrowedItem;
      await updateItemStockAndTrack(item_id, quantity, borrower);

      const q = `INSERT INTO transaction 
      SET item_id = ?, borrower_id = ?, quantity_borrowed = ?`;

      db.query(q, [item_id, borrower, quantity], (err, result) => {
        if (err) {
          console.error("Error inserting data:", err);
          res.status(500).json({ error: err.sqlMessage });
          return;
        }

        // console.log("Data inserted successfully:", result);
      });
    }

    res.status(201).json({ message: "Data inserted successfully" });
    // console.log('Data inserted successfully')
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error inserting data" });
  }
});

async function updateItemStockAndTrack(
  item_id,
  borrowed_quantity,
  borrower_id
) {
  let remainingBorrowedQuantity = borrowed_quantity;

  while (remainingBorrowedQuantity > 0) {
    // Find the oldest stock for the item
    const queryStr = `SELECT id, quantity_added FROM item_stock WHERE item_id = ${item_id} AND quantity_added > 0 ORDER BY date_added ASC LIMIT 1`;

    try {
      const rows = await query(queryStr);

      if (rows.length > 0) {
        const oldestStock = rows[0];
        const borrowedFromOldestStock = Math.min(
          remainingBorrowedQuantity,
          oldestStock.quantity_added
        );

        // Update the track_item_quantity table
        const trackItemQuantityQuery = `INSERT INTO track_item_quantity (item_stock_id, borrowed_quantity, borrower_id, date_borrowed) VALUES (?, ?, ?, NOW())`;

        await query(trackItemQuantityQuery, [
          oldestStock.id,
          borrowedFromOldestStock,
          borrower_id,
        ]);

        // Update the item stock table
        const updateStockQuery = `UPDATE item_stock SET quantity_added = quantity_added - ? WHERE id = ?`;

        await query(updateStockQuery, [
          borrowedFromOldestStock,
          oldestStock.id,
        ]);

        remainingBorrowedQuantity -= borrowedFromOldestStock;
      } else {
        // No more available stock for this item
        break;
      }
    } catch (error) {
      throw error;
    }
  }
}

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
