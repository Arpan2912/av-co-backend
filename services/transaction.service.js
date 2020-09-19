const uuidv4 = require("uuidv4");
const fs = require("fs");
const json2xls = require("json2xls");

const DbService = require("../services/db.service");
const  { getValueToStore,getTodayDate }=require("../services/common.service");
const  CommonService =require("../services/common.service");

module.exports = class TransactionService {
  static async addTransactionApi(req, res) {
    const {
      personId,
      transactionDate=null,
      type=null,
      amount=null,
      note=null,
      mode=null
    } = req.body;
    const { id } = req.userDetail;
    let credit = null;
    let debit = null;
    if(type === 'credit'){
      credit = amount
    } 
    if(type === 'debit'){
      debit = amount;
    }
    let contactId = null;
    if(personId !== null){
        const contactObj = { uuid: personId };
        const contactDetail = await DbService.getIdFromUuid(contactObj, "contact");
        contactId = contactDetail[0].id;
    }

    const obj = {
      uuid: uuidv4(),
      person_id: contactId,
      transaction_date:getValueToStore(transactionDate),
      credit:getValueToStore(credit),
      debit:getValueToStore(debit),
      note:getValueToStore(note),
      mode:getValueToStore(mode),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: id,
      updated_by: id,
      is_active: true,
      is_deleted: false
    };

    return TransactionService.addTransaction(obj);
  }

  static async addOtherTransaction(req,res){
    const {
      debitPersonId,
      creditPersonId,
      transactionDate=null,
      amount=null,
      note=null,
      mode=null
    } = req.body;
    const { id } = req.userDetail;
    let debitContactId = 0;
    let creditContactId = 0;
    if(debitPersonId !== null){
      const contactObj = { uuid: debitPersonId };
      const contactDetail = await DbService.getIdFromUuid(contactObj, "contact");
      debitContactId = contactDetail[0].id;
    }

    if(creditPersonId !== null){
      const contactObj = { uuid: creditPersonId };
      const contactDetail = await DbService.getIdFromUuid(contactObj, "contact");
      creditContactId = contactDetail[0].id;
    }
    const transactionArr = [];
    let debitObj = {
      contactId : debitContactId,
      type: 'debit'
    }
    let creditObj = {
      contactId : creditContactId,
      type: 'credit'
    }
    transactionArr.push(debitObj);
    transactionArr.push(creditObj);
    for(let i=0;i<transactionArr.length;i++){
      let currentData = transactionArr[i];
      const { contactId, type } = currentData;
      let credit = null;
      let debit = null;
      if(type === 'credit'){
        credit = amount
      } 
      if(type === 'debit'){
        debit = amount;
      }
      const obj = {
        uuid: uuidv4(),
        person_id: contactId,
        transaction_date:getValueToStore(transactionDate),
        credit:getValueToStore(credit),
        debit:getValueToStore(debit),
        note:getValueToStore(note),
        mode:getValueToStore(mode),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: id,
        updated_by: id,
        is_active: true,
        is_deleted: false
      };
      await TransactionService.addTransaction(obj);
    }
  }

  static async addTransaction(obj,t){
    try {
      let transactionObj = await DbService.insertRecordToDb(obj, "transaction",t);
      return transactionObj[0][0].id;
      // return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  }

  static async updateTransactionApi(req, res) {
    try {
      const {
        personId,
        transactionDate=null,
        type=null,
        amount=null,
        note=null,
        mode = null,
        id:uuid
      } = req.body;
      const { id } = req.userDetail;

      if(!uuid) {
        throw { code: 409, msg: "please select transaction" };
      }

      const transactionObj = { uuid: uuid };
      const transactionDetail = await DbService.getIdFromUuid(transactionObj, "transaction");
      const transactionId = transactionDetail[0].id;

      let contactId = null;
      if(personId !== null){
          const contactObj = { uuid: personId };
          const contactDetail = await DbService.getIdFromUuid(contactObj, "contact");
          contactId = contactDetail[0].id;
      }
      
      let credit = null;
      let debit = null;
      if(type === 'credit'){
        credit = amount
      } 
      if(type === 'debit'){
        debit = amount;
      }

      const updateObj = {
        updated_at: new Date().toISOString(),
        updated_by: id,
        id: transactionId
      };

      if(contactId) {
        updateObj.person_id = contactId;
      }
      if(transactionDate) {
        updateObj.transaction_date = transactionDate;
      }
      if(credit || debit){
        if(credit) {
          updateObj.credit = credit;
          updateObj.debit = null;
        }
        if(debit) {
          updateObj.credit = null;
          updateObj.debit = debit;
        }
      }
      
      if(note) {
        updateObj.note = note;
      }
       if(mode) {
        updateObj.mode = mode;
      }

      await TransactionService.updateTransaction(updateObj)
      return Promise.resolve();
    } catch (e) {
      console.error("e", e);
      return Promise.reject(e);
    }
  }

  static async updateTransaction(obj){
    console.log("obj",obj);
    return DbService.updateTransaction(obj);
  }

  static async getTransactions(req, res) {
    try {
      let { page = "1", limit = "10", search, from = null,downloadExcel="false", u:contactUuid = null,mode='all' } = req.query;
      let {downloadExcelFields=[]}=req.body;
      if(mode === 'all'){
        mode = null;
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
      let contactId = null;
      
      if(contactUuid !== null){
        const contactObj = { uuid: contactUuid };
        const contactDetail = await DbService.getIdFromUuid(contactObj, "contact");
        contactId = contactDetail[0].id;
      }

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
        person_id:contactId,
        mode
      };
      const transaction = await DbService.getTransactions(replacementObj);
      const transactionCount = await DbService.getTransactionsCount(replacementObj);
      let responseObj = {
        transaction,
        count: transactionCount[0].count
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

  static async getFinalAmountForToday(){
    const todayDate = getTodayDate();
    const replacementObj = {
      date:todayDate
    }
    const finalAmountDbResponse = await DbService.getFinalAmountForDate(replacementObj);
    if(finalAmountDbResponse && finalAmountDbResponse[0]){
      return finalAmountDbResponse[0]
    } else {
      return null
    }
  }
};
