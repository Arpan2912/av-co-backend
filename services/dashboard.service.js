const DbService = require('../services/db.service');
const CommonService = require("../services/common.service");
const {
  headers: {
    headerCompanyId
  }
} = require("../constants/constant.value");

module.exports = class DashboardService {
  static async getStockAndAmountWithDalal(req) {
    let { page = "1", limit = "10", search } = req.query;
    const { [headerCompanyId]: companyUuid } = req.headers;

    const companyDetail = await CommonService.getCompanyDetail(companyUuid);
    const companyId = companyDetail.id;

    page = parseInt(page);
    if (page === "NaN") {
      page = 1;
    }
    limit = parseInt(limit);
    if (limit === "NaN") {
      limit = 1;
    }
    const offset = (page - 1) * limit;

    const replacementObj = {
      offset,
      limit,
      search:
        search === "" || search === undefined || search === null
          ? null
          : `%${search}%`,
      is_search: !(search === "" || search === undefined || search === null),
      company_id: companyId
    };
    let total = 0;
    const dbResponse = await DbService.getStockAndAmountWithDalal(replacementObj);
    const totalDalals = await DbService.getStockAndAmountWithDalalCount(replacementObj);
    if (totalDalals && totalDalals[0] && totalDalals[0].count) {
      total = totalDalals[0].count
    }
    let responseObj = {
      data: dbResponse,
      count: total
    }
    return responseObj;
  }

  static async getAccountSummary(req) {
    let { page = "1", limit = "10", search } = req.query;
    const { [headerCompanyId]: companyUuid } = req.headers;

    const companyDetail = await CommonService.getCompanyDetail(companyUuid);
    const companyId = companyDetail.id;
    page = parseInt(page);
    if (page === "NaN") {
      page = 1;
    }
    limit = parseInt(limit);
    if (limit === "NaN") {
      limit = 1;
    }
    const offset = (page - 1) * limit;

    const replacementObj = {
      offset,
      limit,
      search:
        search === "" || search === undefined || search === null
          ? null
          : `%${search}%`,
      is_search: !(search === "" || search === undefined || search === null),
      company_id: companyId
    };
    let total = 0;
    const dbResponse = await DbService.getAccountSummary(replacementObj);
    const totalCount = await DbService.getAccountSummaryCount(replacementObj);
    if (totalCount && totalCount[0] && totalCount[0].count) {
      total = totalCount[0].count
    }
    let responseObj = {
      data: dbResponse,
      count: total
    }
    return responseObj;
  }
}