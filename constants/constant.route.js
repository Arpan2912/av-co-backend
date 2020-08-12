module.exports = {
  auth: {
    signup: "/signup",
    signin: "/signin"
  },
  contact: {
    addContact: "/add-contact",
    updateContact: "/update-contact",
    getContacts: "/get-contacts",
    uploadExcel:"/upload-excel"
  },
  stock: {
    addStock: "/add-stock",
    updateStock: "/update-stock",
    getStocks: "/get-stocks",
    deleteStock:"/delete-stock"
  },
  transaction: {
    addTransaction: "/add-transaction",
    updateTransaction: "/update-transaction",
    getTransactions: "/get-transactions",
    getCloseAmountForToday: "/get-close-amount-today"
  },
  openingBalance : {
    addOpeningBalance:"/add-opening-balance",
    updateOpeningBalance:"/update-opening-balance",
    getTodayOpeningBalance:"/get-today-opening-balance"
  },
  dashboard:{
    getStockAndAmountWithDalal:"/get-stock-and-amount-with-dalal",
    getAccountSummary:"/get-account-summary"
  }
};
