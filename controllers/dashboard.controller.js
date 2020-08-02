const DashboardService = require("../services/dashboard.service");
const CommonService = require("../services/common.service");

module.exports = class DashboardController {
  static async getStockAndAmountWithDalal(req, res) {
    try {
      const response = await DashboardService.getStockAndAmountWithDalal(req, res);
      const responseObj = CommonService.prepareSuccessResponse(
        "Get final amount successfully",
        response
      );
      return res.status(200).send(responseObj);
    } catch (e) {
      CommonService.logErrorAndSendResponse(e, res, null);
    }
  }

  static async getAccountSummary(req, res) {
    try {
      const response = await DashboardService.getAccountSummary(req, res);
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