const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const proteced = require("../middleware/verifyToken.js");

router.get("/", proteced.verifyToken, userController.getAllUser);
router.patch("/budget/:id", proteced.verifyToken, userController.createBudget);
router.patch("/:id", proteced.verifyToken, userController.updateUser);
router.delete("/:id", proteced.verifyToken, userController.deleteUser);

module.exports = router;
