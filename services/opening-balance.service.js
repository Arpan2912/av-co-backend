const moment = require("moment");
const uuidv4 = require("uuidv4");
const DbService = require("../services/db.service");
const  { getValueToStore }=require("../services/common.service");

module.exports = class OpeningBalanceService {

  static async addOpeningBalance(req) {
    const {
      amount,
      note = null
    } = req.body;
    const { id } = req.userDetail;
    // const date = moment().format('YYYY-MM-DD');
    const obj = {
      uuid: uuidv4(),
      value:getValueToStore(amount),
      key:'base_amount',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: id,
      updated_by: id,
      is_active: true,
      is_deleted: false
    };
    await DbService.insertRecordToDb(obj, "user_settings");
    return Promise.resolve();
  }


  static async updateOpeningBalance(req) {
    try {
      const {
        amount,
        note = null,
        openingBalanceId : openingBalanceUuid
      } = req.body;
      const { id } = req.userDetail;

      if(!openingBalanceUuid) {
        throw { code: 409, msg: "please select opening balance" };
      }

      // const openingBalanceObj = { uuid: openingBalanceUuid };
      // const openingBalanceDetail = await DbService.getIdFromUuid(openingBalanceObj, "opening_balance");
      // const openingBalanceId = openingBalanceDetail[0].id;

      const updateObj = {
        updated_at: new Date().toISOString(),
        updated_by: id,
        value:amount,
        uuid: openingBalanceUuid
      }; 
      await DbService.updateUserSetting(updateObj);
      return Promise.resolve();
    } catch (e) {
      console.error("e", e);
      return Promise.reject(e);
    }
  }

  static async getTodayOpeningBalance(req){
    // const date = moment().format('YYYY-MM-DD');
    const replacementObj = {
      key:'base_amount'
    }
    const todayOpeningBalanceResponse = await DbService.getUserSettings(replacementObj);
    console.log(todayOpeningBalanceResponse);
    if(todayOpeningBalanceResponse && todayOpeningBalanceResponse[0]){
      return todayOpeningBalanceResponse[0];
    } else {
      return null;
    }
  }

  // static async getOpeningBalance(req) {
  //   try {
  //     let { page = "1", limit = "10", search, from = null,downloadExcel="false" } = req.query;
  //     let {downloadExcelFields=[]}=req.body;
  //     page = parseInt(page);
  //     if(page === "NaN") {
  //       page = 1;
  //     }
  //     limit = parseInt(limit);
  //     if(limit === "NaN") {
  //       limit = 1;
  //     }
  //     const offset = (page - 1) * limit;
  //     const replacementObj = {
  //       offset,
  //       limit,
  //       from,
  //       search:
  //         search === "" || search === undefined || search === null
  //           ? null
  //           : `%${search}%`,
  //       is_search: !(search === "" || search === undefined || search === null),
  //       download_excel:downloadExcel==='true'?true:false
  //     };
  //     const contacts = await DbService.getContacts(replacementObj);
  //     const countObj = await DbService.getContactsCount(replacementObj);
  //     let responseObj = {
  //       contacts,
  //       count: countObj[0].count
  //     };
  
  //     return Promise.resolve(responseObj);
  //   } catch (e) {
  //     return Promise.reject(e);
  //   }
  // }

}