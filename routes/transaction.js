const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transaction");

router.post("/", transactionController.createTransaction);
router.get("/", transactionController.getQueryTransaction);
router.get("/all", transactionController.getAllTransaction);
router.get("/latest", transactionController.getLatestTransactions);
router.get("/:id", transactionController.getSingleTransaction);
router.patch("/:id", transactionController.updateTransaction);
router.delete("/:id", transactionController.deleteTransaction);

module.exports = router;


