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
  getAccountSummaryCount
} = require("../constants/constant.query");

module.exports = class DbService {
  static executeSqlQuery(query, replacements, operation, tableName) {
    return new Promise((resolve, reject) => {
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
      db.sequelize
        .query(query, { replacements, type: queryType })
        .then(data => {
          // if (
          //   ["insert", "update", "delete"].includes(operation) &&
          //   tableName !== "activity_log"
          // ) {
          //   const replacemenObj = {
          //     u_uuid: uuidv4(),
          //     replacement: JSON.stringify(replacements),
          //     table_name: tableName,
          //     result: JSON.stringify(data),
          //     operation,
          //     created_at: new Date().toISOString(),
          //     updated_at: new Date().toISOString(),
          //     created_by: replacements.updated_by
          //       ? replacements.updated_by
          //       : null,
          //     updated_by: replacements.updated_by
          //       ? replacements.updated_by
          //       : null
          //   };
          //   // try {
          //   //   DbService.executeSqlQuery(
          //   //     insertActivityLog,
          //   //     replacemenObj,
          //   //     "insert",
          //   //     "activity_log"
          //   //   );
          //   // } catch (e) {
          //   //   console.error("e", e);
          //   // }
          // }
          return resolve(data);
        })
        .catch(err => {
          console.error("err", err);
          return reject(err);
        });
    });
  }

  static insertRecordToDb(replacemenObj, table) {
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
    }  else if (table === "stock_history") {
      q = insertStockHistory;
    } else if (table === "opening_balance") {
      q = insertOpeningBalance;
    }  else {
      return Promise.reject({ msg: "" });
    }
    if (q === null) {
      return Promise.reject({ msg: "" });
    }
    return DbService.executeSqlQuery(q, replacemenObj, "insert", table);
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
    }  else if (table === "transaction") {
      q = getTransactionIdFromUuid;
    } else if (table === "opening_balance") {
      q = getOpeningBalanceIdFromUuid;
    } else {
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

};
