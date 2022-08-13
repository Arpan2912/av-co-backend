const TransactionService = require("../services/transaction.service");
const CommonService = require("../services/common.service");

module.exports = class TransactionController {
  static async addTransaction(req, res) {
    try {
      await TransactionService.addTransactionApi(req, res);
      const responseObj = CommonService.prepareSuccessResponse(
        "Transaction added successfully",
        null
      );
      return res.status(200).send(responseObj);
    } catch (e) {
      CommonService.logErrorAndSendResponse(e, res, null);
    }
  }

  static async addOtherTransaction(req, res) {
    try {
      await TransactionService.addOtherTransaction(req, res);
      const responseObj = CommonService.prepareSuccessResponse(
        "Transaction added successfully",
        null
      );
      return res.status(200).send(responseObj);
    } catch (e) {
      CommonService.logErrorAndSendResponse(e, res, null);
    }
  }

  static async getTransactions(req, res) {
    try {
      const contacts = await TransactionService.getTransactions(req, res);
     
      const responseObj = CommonService.prepareSuccessResponse(
        "Get Transaction successfully",
        contacts
      );
      return res.status(200).send(responseObj);
    } catch (e) {
      CommonService.logErrorAndSendResponse(e, res, null);
    }
  }

  static async updateTransaction(req, res) {
    try {
      await TransactionService.updateTransactionApi(req, res);
      const responseObj = CommonService.prepareSuccessResponse(
        "Transaction updated successfully",
        null
      );
      return res.status(200).send(responseObj);
    } catch (e) {
      CommonService.logErrorAndSendResponse(e, res, null);
    }
  }

  static async getCloseAmountForToday(req, res) {
    try {
      const response = await TransactionService.getFinalAmountForToday(req, res);
      const responseObj = CommonService.prepareSuccessResponse(
        "Get final amount successfully",
        response
      );
      return res.status(200).send(responseObj);
    } catch (e) {
      CommonService.logErrorAndSendResponse(e, res, null);
    }
  }
}