const StockService = require("../services/stock.service");
const CommonService = require("../services/common.service");

module.exports = class StockController {
  static async addStock(req, res) {
    try {
      await StockService.addStock(req, res);
      const responseObj = CommonService.prepareSuccessResponse(
        "stock added successfully",
        null
      );
      return res.status(200).send(responseObj);
    } catch (e) {
      console.log("e",e);
      CommonService.logErrorAndSendResponse(e, res, null);
    }
  }

  static async getStocks(req, res) {
    try {
      const contacts = await StockService.getStocks(req, res);
     
      const responseObj = CommonService.prepareSuccessResponse(
        "Get person successfully",
        contacts
      );
      return res.status(200).send(responseObj);
    } catch (e) {
      CommonService.logErrorAndSendResponse(e, res, null);
    }
  }

  static async updateStock(req, res) {
    try {
      await StockService.updateStock(req, res);
      const responseObj = CommonService.prepareSuccessResponse(
        "Update person successfully",
        null
      );
      return res.status(200).send(responseObj);
    } catch (e) {
      CommonService.logErrorAndSendResponse(e, res, null);
    }
  }
}