const OpeningBalanceService = require('../services/opening-balance.service');
const CommonService = require('../services/common.service');

module.exports = class OpeningBalanceController {
  static async addOpeningBalance(req, res) {
    try {
      await OpeningBalanceService.addOpeningBalance(req);
      const responseObj = CommonService.prepareSuccessResponse(
        "Opening balance added successfully",
        null
      );
      return res.status(200).send(responseObj);
    } catch (e) {
      CommonService.logErrorAndSendResponse(e, res, null);
    }
  }

  static async updateOpeningBalance(req, res) {
    try {
      await OpeningBalanceService.updateOpeningBalance(req);
      const responseObj = CommonService.prepareSuccessResponse(
        "Update opening balance successfully",
        null
      );
      return res.status(200).send(responseObj);
    } catch (e) {
      CommonService.logErrorAndSendResponse(e, res, null);
    }
  }

  static async getTodayOpeningBalance(req, res) {
    try {
      const data = await OpeningBalanceService.getTodayOpeningBalance(req);
      const responseObj = CommonService.prepareSuccessResponse(
        "Get today opening balance successfully",
        data
      );
      return res.status(200).send(responseObj);
    } catch (e) {
      CommonService.logErrorAndSendResponse(e, res, null);
    }
  }
}