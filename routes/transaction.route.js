const express = require("express");
const { transaction: transactionRoute } = require("../constants/constant.route");
const TransactionController = require("../controllers/transaction.controller");
const CommonServies  = require("../services/common.service");
const router = express.Router();

router.route(transactionRoute.addTransaction).post(TransactionController.addTransaction);
router.route(transactionRoute.addOtherTransaction).post(TransactionController.addOtherTransaction);
router.route(transactionRoute.updateTransaction).post(TransactionController.updateTransaction);
router.route(transactionRoute.getTransactions).post(TransactionController.getTransactions);
router.route(transactionRoute.getCloseAmountForToday).get(TransactionController.getCloseAmountForToday);

module.exports = router;
