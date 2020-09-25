const uuidv4 = require("uuidv4");
const fs = require("fs");
const json2xls = require("json2xls");

const DbService = require("../services/db.service");
const  { getValueToStore } = require("../services/common.service");
const  CommonService = require("../services/common.service");
const TransactionService= require("./transaction.service");


module.exports = class StockService {
  static async addStock(req, res) {
    let {
      stockId,
      buyPrice=null,
      buyDate=null,
      buyPersonId=null,
      status=null,
      weight=null,
      sellPrice=null,
      sellDate=null,
      sellPersonId=null,
      note=null,
      mode= null,
      buyPricePer=null,
      sellPricePer=null
    } = req.body;
    const { id } = req.userDetail;
    const t = await DbService.excuteDbTransaction();
    try {
      let contactDetail = null;
      if(buyPersonId){
        const contactObj = { uuid: buyPersonId };
        contactDetail = await DbService.getIdFromUuid(contactObj, "contact");
        buyPersonId = contactDetail[0].id;
      }
      let transactionId = null;
      let amoutToAddInTransaction = buyPrice;
      if(buyPricePer === 'carat'){
        amoutToAddInTransaction = buyPrice * weight;
      }
      const transactionObj={
        uuid:uuidv4(),
        person_id:buyPersonId,
        debit:0,
        credit: amoutToAddInTransaction,
        note: `Buy Stock No ${stockId}`,
        mode:'stock',
        transaction_date:new Date().toISOString(),
        created_at:new Date().toISOString(),
        updated_at:new Date().toISOString(),
        is_active:true,
        is_deleted:false,
        created_by:id,
        updated_by:id
      }
      transactionId = await TransactionService.addTransaction(transactionObj,t);

      const obj = {
        uuid: uuidv4(),
        stock_id: stockId,
        buy_price:getValueToStore(buyPrice),
        buy_price_per:getValueToStore(buyPricePer),
        buy_date:getValueToStore(buyDate),
        buy_person_id:getValueToStore(buyPersonId),
        buy_transaction_id:getValueToStore(transactionId),
        weight:getValueToStore(weight),
        status:getValueToStore('current-stock'),
        sell_price:getValueToStore(sellPrice),
        sell_price_per:getValueToStore(sellPricePer),
        sell_date:getValueToStore(sellDate),
        sell_person_id:null,
        sell_transaction_id:null,
        note:getValueToStore(note),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: id,
        updated_by: id,
        is_active: true,
        is_deleted: false
      };

   
      let stockDetail = await DbService.insertRecordToDb(obj, "stock",t);
      let historyNote=`Stock Purchased from ${contactDetail.name} on ${new Date().toDateString()} with price ${buyPrice}`
      let StockHistoryObj={
        uuid:uuidv4(),
        stock_id:stockDetail[0][0].id,
        action:'add',
        action_date:new Date().toISOString(),
        weight:weight,
        status:status,
        person_id:buyPersonId,
        note:historyNote,
        is_active:true,
        is_deleted:false,
        created_at:new Date().toISOString(),
        updated_at:new Date().toISOString(),
        created_by:id,
        updated_by:id
      }
      await DbService.insertRecordToDb(StockHistoryObj, "stock_history");
      await t.commit();
      return Promise.resolve();
    } catch (e) {
      console.log("e",e);
      await t.rollback();
      return Promise.reject(e);
    }
  }

  static async updateStock(req, res) {
    try {
      let {
        stockId,
        buyPrice=null,
        buyDate=null,
        buyPersonId=null,
        buyTransactionId=null,
        weight=null,
        status=null,
        sellPrice=null,
        sellDate=null,
        sellPersonId=null,
        sellTransactionId=null,
        note=null,
        buyPricePer=null,
        sellPricePer=null,
        id:uuid
      } = req.body;
      const { id } = req.userDetail;

      if(!uuid) {
        throw { code: 409, msg: "please select stock" };
      }

      let updateTransactionObj = false;
      let addTransactionObj = false;
      let buyContactDetail=null;
      let sellContactDetail=null;
      let transactionId=null;

      const stockObj = { uuid: uuid };
      let stockDetail = await DbService.getIdFromUuid(stockObj, "stock");
      stockDetail=stockDetail[0];
      const stockMainId = stockDetail.id;

      if(buyPersonId){
        const contactObj = { uuid: buyPersonId };
        buyContactDetail = await DbService.getIdFromUuid(contactObj, "contact");
        buyPersonId = buyContactDetail[0].id;
      }

      if(sellPersonId){
        const contactObj = { uuid: sellPersonId };
        sellContactDetail = await DbService.getIdFromUuid(contactObj, "contact");
        sellPersonId = sellContactDetail[0].id;
      }

      const updateObj = {
        updated_at: new Date().toISOString(),
        updated_by: id,
        id: stockMainId
      };
      let historyNote=`Stock ${stockDetail.stock_id}'s `;
      if(buyPrice && stockDetail.buy_price !== buyPrice) {
        historyNote+= `buy price updated to ${buyPrice} from ${stockDetail.buy_price}`
        updateObj.buy_price = buyPrice;
        updateTransactionObj=true;
      }

      if(buyPricePer && stockDetail.buy_price_per !== buyPricePer) {
        updateObj.buy_price_per = buyPricePer;
        historyNote+= `buy price updated to ${buyPrice} from ${stockDetail.buy_price}`
        updateObj.buy_price = buyPrice;
        updateTransactionObj=true;
      }

      if(buyDate) {
        updateObj.buy_date = buyDate;
      }
      if(buyPersonId && stockDetail.buy_person_id !== buyPersonId) {
        historyNote+= `buy person updated to ${buyContactDetail.name}`
        updateObj.buy_person_id = buyPersonId;
        updateTransactionObj=true;
      }
      if(buyTransactionId) {
        updateObj.buy_transaction_id = buyTransactionId;
      }
      if(sellPrice){
        updateObj.sell_price = sellPrice;
        if(stockDetail.sell_transaction_id && stockDetail.sell_price !== sellPrice){
          updateTransactionObj=true;
        } else if(!stockDetail.sell_transaction_id){
          addTransactionObj=true;
        }
      }

      if(sellPricePer && stockDetail.sell_price_per !== sellPricePer){
        updateObj.sell_price_per = sellPricePer;
        if(!stockDetail.sell_transaction_id){
          addTransactionObj=true;
        } else {
          updateTransactionObj=true;
        }
      }
      // if(sellPrice && stockDetail.sell_price !== sellPrice) {
      //   if(stockDetail.sell_price){
      //     historyNote+= `sell price changed to ${sellPrice}`
      //     updateTransactionObj=true;
      //   } else {
      //     // historyNote+= `stone sold to ${sellContactDetail.name} on ${new Date().toDateString()}`
      //     addTransactionObj=true;
      //   }
      //   updateObj.sell_price = sellPrice;
      // }
      if(weight){
        updateObj.weight=weight;
        updateTransactionObj=true;
      }
      if(sellDate) {
        updateObj.sell_date = sellDate;
      }
      if(sellPersonId){
        if(stockDetail.sell_person_id){
          historyNote+= `sell person changed to ${sellContactDetail.name}`
        }
        if(stockDetail.sell_person_id !== sellPersonId){
          updateObj.sell_person_id = sellPersonId;
        }
      } else {
        updateObj.sell_person_id = null;
      }
      // if(sellPersonId && stockDetail.sell_person_id !== sellPersonId) {
      //   if(stockDetail.sell_person_id){
      //     historyNote+= `sell person changed to ${sellContactDetail.name}`
      //   }
      //   updateObj.sell_person_id = sellPersonId;
      // }
      if(status && stockDetail.status !== status) {
        historyNote+= `status changed to ${status}`
        updateObj.status = status;
      }
      if(note && stockDetail.note !== note) {
        historyNote+= `note updated`
        updateObj.note = note;
      }
      if(addTransactionObj === true && status !== 'jangad'){
        let mode = 'stock';
        let credit = 0;
        let debit = sellPrice;
        if(sellPricePer === 'carat'){
           debit = sellPrice * weight;
        }
        if(!sellPersonId){
          mode = 'cash';
          credit = debit;
          debit = 0;
        }
        const transactionObj={
          uuid:uuidv4(),
          person_id:sellPersonId,
          credit,
          debit,
          note: `Sell Stock No ${stockDetail.stock_id}`,
          mode,
          transaction_date:new Date().toISOString(),
          is_active:true,
          is_deleted:false,
          created_at:new Date().toISOString(),
          updated_at:new Date().toISOString(),
          created_by:id,
          updated_by:id
        }
        transactionId = await TransactionService.addTransaction(transactionObj);
      } 
      
      if(updateTransactionObj === true){

        let updateBuyTransactionObj={
          updated_at:new Date().toISOString(),
          updated_by:id
        }

        let updateSellTransactionObj={
          updated_at:new Date().toISOString(),
          updated_by:id
        }
        if((buyPrice && stockDetail.buy_price !== buyPrice) || stockDetail.weight != weight || stockDetail.buy_price_per !== buyPricePer){
          updateBuyTransactionObj.id=stockDetail.buy_transaction_id;
          updateBuyTransactionObj.credit=buyPrice;
          if(buyPricePer === 'carat'){
            updateBuyTransactionObj.credit=buyPrice * weight;
          }
          updateBuyTransactionObj.debit=0;
        }

        if(buyPersonId && stockDetail.buy_person_id !== buyPersonId){
          updateBuyTransactionObj.id=stockDetail.buy_transaction_id;
          updateBuyTransactionObj.person_id=buyPersonId;
        }

        if((sellPrice && stockDetail.sell_price !== sellPrice)|| stockDetail.weight != weight || stockDetail.sell_price_per !== sellPricePer){
          updateSellTransactionObj.id=stockDetail.sell_transaction_id;
          updateSellTransactionObj.debit=sellPrice;
          if(sellPricePer === 'carat'){
            updateSellTransactionObj.debit=sellPrice * weight;
          }
          updateSellTransactionObj.credit=0;
          if(!sellPersonId){
            updateSellTransactionObj.credit=sellPrice;
            if(sellPricePer === 'carat'){
              updateSellTransactionObj.credit=sellPrice * weight;
            }
            updateSellTransactionObj.debit=0;
          } 
        }

        if(stockDetail.sell_person_id !== sellPersonId){
          updateSellTransactionObj.id=stockDetail.sell_transaction_id;
          updateSellTransactionObj.person_id=sellPersonId;
        }
        if(updateBuyTransactionObj.id){
          await TransactionService.updateTransaction(updateBuyTransactionObj)
        }
        if(updateSellTransactionObj.id){
          updateSellTransactionObj.mode = 'stock';
          if(!sellPersonId){
            updateSellTransactionObj.mode = 'cash';
          }
          await TransactionService.updateTransaction(updateSellTransactionObj)
        }
      }
      
      if(transactionId){
        updateObj.sell_transaction_id=transactionId;
      }
      
      await DbService.updateStock(updateObj);
      let StockHistoryObj={
        uuid:uuidv4(),
        stock_id:stockDetail.id,
        action:addTransactionObj ? 'sell' :'update',
        action_date:new Date().toISOString(),
        status:status,
        weight:weight,
        person_id:buyPersonId,
        note:historyNote,
        is_active:true,
        is_deleted:false,
        created_at:new Date().toISOString(),
        updated_at:new Date().toISOString(),
        created_by:id,
        updated_by:id
      }
      await DbService.insertRecordToDb(StockHistoryObj, "stock_history");
      return Promise.resolve();
    } catch (e) {
      console.error("e", e);
      return Promise.reject(e);
    }
  }

  static async getStocks(req, res) {
    try {
      let { page = "1", limit = "10", search, from = null,downloadExcel="false",status ="all" } = req.query;
      let {downloadExcelFields=[]}=req.body;
      if(status === 'all'){
        status = null;
      }
      page = parseInt(page);
      if(page === "NaN") {
        page = 1;
      }
      limit = parseInt(limit);
      if(limit === "NaN") {
        limit = 1;
      }
      const offset = (page - 1) * limit;
      const replacementObj = {
        offset,
        limit,
        from,
        search:
          search === "" || search === undefined || search === null
            ? null
            : `%${search}%`,
        is_search: !(search === "" || search === undefined || search === null),
        download_excel:downloadExcel==='true'?true:false,
        status
      };
      const stocks = await DbService.getStocks(replacementObj);
      const stockCountObj = await DbService.getStocksCount(replacementObj);
      let responseObj = {
        stocks,
        count: stockCountObj[0].count
      };
      if(downloadExcel === 'true'){
        let excelArray = await ContactService.prepareArrayToGenerateExcel(contacts,downloadExcelFields);
        const uploadPath = `${__dirname}/../public/`;
        const fileName = `${uuidv4().toString()}.xlsx`;
        const xls = json2xls(excelArray);
        fs.writeFileSync(`${uploadPath}${fileName}`, xls, "binary");
        responseObj = {
          file: `http://localhost:3001/${fileName}`
        };
      }
      return Promise.resolve(responseObj);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  static async deleteStock(req){
    try {
      let {
        u:uuid
      } = req.query;
      const { id } = req.userDetail;

      if(!uuid) {
        throw { code: 409, msg: "please select stock" };
      }

      const stockObj = { uuid: uuid };
      let stockDetail = await DbService.getIdFromUuid(stockObj, "stock");
      stockDetail=stockDetail[0];
      if(stockDetail.sell_price || stockDetail.sell_person_id || stockDetail.sell_transaction_id){
        throw { msg: 'Cannot be delete',code:409 };
      }
      const stockMainId = stockDetail.id;

      const updateObj = {
        updated_at: new Date().toISOString(),
        updated_by: id,
        is_active: false,
        is_deleted: true,
        id: stockMainId
      };
      let transactionId = stockDetail.buy_transaction_id;

      let updateBuyTransactionObj={
        updated_at:new Date().toISOString(),
        updated_by:id,
        id: transactionId,
        is_active: false,
        is_deleted: true,
      }

      await TransactionService.updateTransaction(updateBuyTransactionObj)
      
      await DbService.updateStock(updateObj);
      return Promise.resolve();
    } catch (e) {
      console.error("e", e);
      return Promise.reject(e);
    }
  }

  static async prepareArrayToGenerateExcel(data,fieldsToAdd){
    let excelArr=[];
    let arrLength = data.length;
    return new Promise((resolve,reject)=>{
      if(arrLength===0){
        return resolve();
      }
      for(let i=0;i<data.length;i++){
        let obj={};
        let currentData=data[i];
        if(fieldsToAdd && Array.isArray(fieldsToAdd) && (fieldsToAdd.includes('all')||fieldsToAdd.length===0)){
          obj['Name']=currentData.name;
          obj['Mobile']='';
          if(currentData.mobile1){
            if(obj['Mobile']){
              obj['Mobile']=obj['Mobile']+','+currentData.mobile1;
            } else {
              obj['Mobile']=obj['Mobile']+currentData.mobile1;
            }
          }
          if(currentData.mobile2){
            if(obj['Mobile']){
              obj['Mobile']=obj['Mobile']+','+currentData.mobile2;
            } else {
              obj['Mobile']=obj['Mobile']+currentData.mobile2;
            }
          }
          obj['Address']=currentData.address;
        } else {
          if(fieldsToAdd.includes('name')){
            obj['Name']=currentData.name;
          }
          if(fieldsToAdd.includes('mobile')){
            obj['Mobile']='';
            if(currentData.mobile1){
              if(obj['Mobile']){
                obj['Mobile']=obj['Mobile']+','+currentData.mobile1;
              } else {
                obj['Mobile']=obj['Mobile']+currentData.mobile1;
              }
            }
            if(currentData.mobile2){
              if(obj['Mobile']){
                obj['Mobile']=obj['Mobile']+','+currentData.mobile2;
              } else {
                obj['Mobile']=obj['Mobile']+currentData.mobile2;
              }
            }
          }
          
        }
        excelArr.push(obj);
        if(i===arrLength-1){
          return resolve();
        }
      }
    })
    .then(()=>{
      return Promise.resolve(excelArr);
    })
    .catch(e=>{
      return Promise.reject(e);
    })
  }
};
