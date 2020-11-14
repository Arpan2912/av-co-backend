const uuidv4 = require("uuidv4");
const DbService = require("../services/db.service");
const { getValueToStore } = require("../services/common.service");

module.exports = class CompanyService {
  static async addCompany(req, res) {
    const {
      companyName,
      phone = null
    } = req.body;
    const { id } = req.userDetail;

    const obj = {
      uuid: uuidv4(),
      company_name: getValueToStore(companyName),
      phone: getValueToStore(phone),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: id,
      updated_by: id,
      is_active: true,
      is_deleted: false
    };

    await DbService.insertRecordToDb(obj, "company");
  }

  static async updateCompany(req, res) {
    try {
      const {
        companyName,
        phone = null,
        companyId: uuid
      } = req.body;
      const { id } = req.userDetail;

      if (!uuid) {
        throw { code: 409, msg: "please select company" };
      }

      // const companyObj = { uuid: uuid };
      // const companyDetail = await DbService.getIdFromUuid(companyObj, "company");
      // const companyId = companyDetail[0].id;

      const updateObj = {
        updated_at: new Date().toISOString(),
        updated_by: id,
        uuid
      };

      if (companyName) {
        updateObj.company_name = companyName;
      }
      if (phone) {
        updateObj.phone = phone;
      }

      return DbService.updateCompany(updateObj);
    } catch (e) {
      console.error("e", e);
      return Promise.reject(e);
    }
  }

  static async getCompanies(req, res) {
    try {
      let { search } = req.query;

      const replacementObj = {
        search:
          search === "" || search === undefined || search === null
            ? null
            : `%${search}%`,
        is_search: !(search === "" || search === undefined || search === null),
      };
      const companies = await DbService.getCompanies(replacementObj);

      let responseObj = {
        companies,
      };
      return Promise.resolve(responseObj);
    } catch (e) {
      return Promise.reject(e);
    }
  }
};
