const express = require("express");
const { dashboard: dashboardRoute } = require("../constants/constant.route");
const DashboardController = require("../controllers/dashboard.controller");
const router = express.Router();

router.route(dashboardRoute.getStockAndAmountWithDalal).get(DashboardController.getStockAndAmountWithDalal);
router.route(dashboardRoute.getAccountSummary).get(DashboardController.getAccountSummary);

module.exports = router;
