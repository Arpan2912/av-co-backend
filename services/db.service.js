const Sequelize = require("sequelize");
const uuidv4 = require("uuidv4");
const db = require("../db");

const {
  getContactIdFromUuid,
  getStockDetailFromId,
  getStockIdFromUuid,
  insertStock,
  insertStockHistory,
  insertTransaction,
  insertTransactionHistory,
  updateStock,
  updateTransaction,
  insertContact,
  updateCotact,
  getContacts,
  getContactsCount,
  createUser,
  getUserDetail,
  insertActivityLog,
  getTransactionIdFromUuid,
  getStocks,
  getStocksCount,
  getTransactions,
  getTransactionsCount,
  getOpeningBalance,
  insertOpeningBalance,
  updateOpeningBalance,
  getOpeningBalanceIdFromUuid,
  getFinalAmountForDate,
  getStockAndAmountWithDalal,
  getStockAndAmountWithDalalCount,
  getAccountSummary,
  getAccountSummaryCount,
  getUserSettings,
  insertUserSettings,
  updateUserSetting,
  getUserSettingsIdFromUuid,
  getCompanyIdFromUuid,
  addCompany,
  updateCompany,
  getCompanies
} = require("../constants/constant.query");

module.exports = class DbService {
  static async executeSqlQuery(query, replacements, operation, tableName, transaction) {
    // return new Promise((resolve, reject) => {
    let queryType;
    if (operation === "insert") {
      queryType = Sequelize.QueryTypes.INSERT;
    } else if (operation === "update") {
      queryType = Sequelize.QueryTypes.UPDATE;
    } else if (operation === "select") {
      queryType = Sequelize.QueryTypes.SELECT;
    } else if (operation === "delete") {
      queryType = Sequelize.QueryTypes.DELETE;
    } else {
      queryType = Sequelize.QueryTypes.SELECT;
    }
    let optinObj = {
      replacements,
      type: queryType
    }
    if (transaction) {
      optinObj.transaction = transaction;
    }

    return db.sequelize
      .query(query, optinObj)
    // });
  }

  static excuteDbTransaction() {
    return db.sequelize.transaction();
  }

  static insertRecordToDb(replacemenObj, table, transaction) {
    let q = null;
    if (table === "contact") {
      q = insertContact;
    } else if (table === "user") {
      q = createUser;
    } else if (table === "stock") {
      q = insertStock;
    } else if (table === "transaction") {
      q = insertTransaction;
    } else if (table === "transaction_history") {
      q = insertTransactionHistory;
    } else if (table === "stock_history") {
      q = insertStockHistory;
    } else if (table === "opening_balance") {
      q = insertOpeningBalance;
    } else if (table === "user_settings") {
      q = insertUserSettings;
    } else if (table === "company") {
      q = addCompany;
    } else {
      return Promise.reject({ msg: "........" });
    }
    if (q === null) {
      return Promise.reject({ msg: "....." });
    }
    return DbService.executeSqlQuery(q, replacemenObj, "insert", table, transaction);
  }

  static getUserDetail(replacemenObj) {
    return DbService.executeSqlQuery(getUserDetail, replacemenObj, "select");
  }

  static updateContact(replacemenObj) {
    return DbService.executeSqlQuery(
      updateCotact(replacemenObj),
      replacemenObj,
      "update",
      "contacts"
    );
  }

  static getContacts(replacemenObj = {}) {
    return DbService.executeSqlQuery(
      getContacts(replacemenObj),
      replacemenObj,
      "select"
    );
  }

  static getContactsCount(replacemenObj = {}) {
    return DbService.executeSqlQuery(getContactsCount, replacemenObj, "select");
  }

  static getIdFromUuid(replacemenObj, table) {
    let q = null;
    if (table === "contact") {
      q = getContactIdFromUuid;
    } else if (table === "stock") {
      q = getStockIdFromUuid;
    } else if (table === "transaction") {
      q = getTransactionIdFromUuid;
    } else if (table === "opening_balance") {
      q = getOpeningBalanceIdFromUuid;
    } else if (table === "user_settings") {
      q = getUserSettingsIdFromUuid;
    } else if (table === "company") {
      q = getCompanyIdFromUuid;
    }
    else {
      return Promise.reject({ msg: "" });
    }
    if (q === null) {
      return Promise.reject({ msg: "" });
    }
    return DbService.executeSqlQuery(q, replacemenObj, "select");
  }

  static getStockDetailFromId(replacemenObj = {}) {
    return DbService.executeSqlQuery(
      getStockDetailFromId(replacemenObj),
      replacemenObj,
      "select"
    );
  }

  static updateStock(replacemenObj) {
    return DbService.executeSqlQuery(
      updateStock(replacemenObj),
      replacemenObj,
      "update",
      "stock"
    );
  }

  static getStocks(replacemenObj = {}) {
    return DbService.executeSqlQuery(
      getStocks(replacemenObj),
      replacemenObj,
      "select"
    );
  }

  static getStocksCount(replacemenObj = {}) {
    return DbService.executeSqlQuery(getStocksCount, replacemenObj, "select");
  }

  static updateTransaction(replacemenObj) {
    return DbService.executeSqlQuery(
      updateTransaction(replacemenObj),
      replacemenObj,
      "update",
      "stock"
    );
  }

  static getTransactions(replacemenObj = {}) {
    return DbService.executeSqlQuery(
      getTransactions(replacemenObj),
      replacemenObj,
      "select"
    );
  }

  static getTransactionsCount(replacemenObj = {}) {
    return DbService.executeSqlQuery(getTransactionsCount, replacemenObj, "select");
  }

  static updateOpeningBalance(replacemenObj) {
    return DbService.executeSqlQuery(
      updateOpeningBalance(replacemenObj),
      replacemenObj,
      "update",
      "opening_balance"
    );
  }

  static getOpeningBalance(replacemenObj = {}) {
    return DbService.executeSqlQuery(getOpeningBalance(replacemenObj), replacemenObj, "select");
  }

  static getFinalAmountForDate(replacemenObj = {}) {
    return DbService.executeSqlQuery(getFinalAmountForDate, replacemenObj, "select");
  }

  static getStockAndAmountWithDalal(replacemenObj = {}) {
    return DbService.executeSqlQuery(getStockAndAmountWithDalal, replacemenObj, "select");
  }

  static getStockAndAmountWithDalalCount(replacemenObj = {}) {
    return DbService.executeSqlQuery(getStockAndAmountWithDalalCount, replacemenObj, "select");
  }

  static getAccountSummary(replacemenObj = {}) {
    return DbService.executeSqlQuery(getAccountSummary, replacemenObj, "select");
  }

  static getAccountSummaryCount(replacemenObj = {}) {
    return DbService.executeSqlQuery(getAccountSummaryCount, replacemenObj, "select");
  }

  static updateUserSetting(replacemenObj) {
    return DbService.executeSqlQuery(
      updateUserSetting(replacemenObj),
      replacemenObj,
      "update",
      "user_settings"
    );
  }

  static getUserSettings(replacemenObj = {}) {
    return DbService.executeSqlQuery(getUserSettings(replacemenObj), replacemenObj, "select");
  }

  static updateCompany(replacemenObj) {
    return DbService.executeSqlQuery(
      updateCompany(replacemenObj),
      replacemenObj,
      "update",
      "company"
    );
  }

  static getCompanies(replacemenObj = {}) {
    return DbService.executeSqlQuery(getCompanies, replacemenObj, "select");
  }
};
