const CompanyService = require("../services/company.service");
const CommonService = require("../services/common.service");

module.exports = class CompanyController {
  static async addCompany(req, res) {
    try {
      await CompanyService.addCompany(req, res);
      const responseObj = CommonService.prepareSuccessResponse(
        "Company added successfully",
        null
      );
      return res.status(200).send(responseObj);
    } catch (e) {
      CommonService.logErrorAndSendResponse(e, res, null);
    }
  }

  static async getCompanies(req, res) {
    try {
      const response = await CompanyService.getCompanies(req, res);
     
      const responseObj = CommonService.prepareSuccessResponse(
        "Get Companies successfully",
        response
      );
      return res.status(200).send(responseObj);
    } catch (e) {
      CommonService.logErrorAndSendResponse(e, res, null);
    }
  }

  static async updateCompany(req, res) {
    try {
      await CompanyService.updateCompany(req, res);
      const responseObj = CommonService.prepareSuccessResponse(
        "Company detail updated successfully",
        null
      );
      return res.status(200).send(responseObj);
    } catch (e) {
      CommonService.logErrorAndSendResponse(e, res, null);
    }
  }
}