import express from "express";
import db from "../db.js";
const router = express.Router();
const table = "item";


// track item quantity by item id
router.get("/view/:item_id", async (req, res, next) => { 
  try {
    const id = req.params.item_id; 
    const q = `SELECT * FROM track_item_quantity, item_stock, borrower
    where track_item_quantity.item_stock_id = item_stock.id 
    and item_stock.item_id = ?
    and track_item_quantity.borrower_id = borrower.id
     order by track_item_quantity.date_borrowed desc , item_stock_id desc`

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



// track item quantity by stock item id
router.get("/track_quantity/:stock_item_id", async (req, res, next) => { 
  try {
    const id = req.params.stock_item_id; 
    const q = `SELECT * FROM track_item_quantity, item_stock, borrower
    where track_item_quantity.item_stock_id = item_stock.id 
    and  track_item_quantity.item_stock_id = ?
    and track_item_quantity.borrower_id = borrower.id
    order by track_item_quantity.date_borrowed desc , item_stock_id desc`

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


export default router;
