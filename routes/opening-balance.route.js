const express = require("express");
const { openingBalance: openingBalanceRoute } = require("../constants/constant.route");
const OpeningBalanceController = require("../controllers/opening-balance.controller");
const router = express.Router();

router.route(openingBalanceRoute.addOpeningBalance).post(OpeningBalanceController.addOpeningBalance);
router.route(openingBalanceRoute.updateOpeningBalance).post(OpeningBalanceController.updateOpeningBalance);
router.route(openingBalanceRoute.getTodayOpeningBalance).get(OpeningBalanceController.getTodayOpeningBalance);


module.exports = router;
