const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transaction");

router.post("/", transactionController.createTransaction);
router.get("/", transactionController.getAllTransaction);
router.patch("/:id", transactionController.updateTransaction);
router.delete("/:id", transactionController.deleteTransaction);

module.exports = router;