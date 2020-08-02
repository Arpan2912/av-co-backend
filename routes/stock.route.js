const express = require("express");
const { stock: stockRoute } = require("../constants/constant.route");
const StockController = require("../controllers/stock.controller");
const CommonServies  = require("../services/common.service");
const router = express.Router();

router.route(stockRoute.addStock).post(StockController.addStock);
router.route(stockRoute.updateStock).post(StockController.updateStock);
router.route(stockRoute.getStocks).post(StockController.getStocks);

module.exports = router;
