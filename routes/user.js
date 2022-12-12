const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");

router.get("/", userController.getAllUser)
router.patch("/budget/:id", userController.createBudget)
router.patch("/:id", userController.updateUser)
router.delete("/:id", userController.deleteUser)

module.exports = router;