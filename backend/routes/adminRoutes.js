const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

// 🔐 Only ADMIN can access these routes
router.use(auth, role(["admin"]));

/* ================= DASHBOARD ================= */
router.get("/dashboard-counts", adminController.getDashboardCounts);

/* ================= USERS ================= */
router.get("/users", adminController.getAllUsers);
router.get("/users/:id", adminController.getUserById);
router.put("/users/:id/activate", adminController.activateUser);
router.put("/users/:id/deactivate", adminController.deactivateUser);
router.delete("/users/:id", adminController.deleteUser);

/* ================= LAWYERS ================= */
router.get("/lawyers", adminController.getAllLawyers);
/* ================= LAWYER APPROVAL (USERS) ================= */
router.get("/pending-lawyers", adminController.getPendingLawyerUsers);
router.put("/pending-lawyers/:id/approve", adminController.approveLawyerUser);
router.put("/pending-lawyers/:id/reject", adminController.rejectLawyerUser);


/* ================= CITY ================= */
router.post("/city", adminController.addCity);
router.get("/city", adminController.getCities);
router.delete("/city/:id", adminController.deleteCity);

/* ================= STATE ================= */
router.post("/state", adminController.addState);
router.get("/state", adminController.getStates);
router.delete("/state/:id", adminController.deleteState);

/* ================= CATEGORY ================= */
router.post("/category", adminController.addCategory);
router.get("/category", adminController.getCategories);
router.delete("/category/:id", adminController.deleteCategory);

module.exports = router;
