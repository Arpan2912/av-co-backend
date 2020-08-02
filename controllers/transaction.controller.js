const TransactionService = require("../services/transaction.service");
const CommonService = require("../services/common.service");

module.exports = class TransactionController {
  static async addTransaction(req, res) {
    try {
      await TransactionService.addTransactionApi(req, res);
      const responseObj = CommonService.prepareSuccessResponse(
        "stock added successfully",
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
        "Get person successfully",
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
        "Update person successfully",
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