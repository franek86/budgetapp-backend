const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transaction");
const proteced = require("../middleware/verifyToken.js");

router.post("/", proteced.verifyToken, transactionController.createTransaction);
router.get("/", proteced.verifyToken, transactionController.getQueryTransaction);
router.get("/all", transactionController.getAllTransaction);
router.get("/latest", proteced.verifyToken, transactionController.getLatestTransactions);
router.get("/:id", transactionController.getSingleTransaction);
router.patch("/:id", transactionController.updateTransaction);
router.delete("/:id", transactionController.deleteTransaction);

module.exports = router;
