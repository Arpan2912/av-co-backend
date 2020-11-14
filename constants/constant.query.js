// put all queries here
module.exports = {
  // qGetUserDetail: `select * from "users" where email=:email`,
  createUser: `insert into  users (uuid,first_name,last_name,email,
    phone,password,user_type,created_at,updated_at)
  values (:uuid,:first_name,:last_name,:email,
    :phone,:password,:user_type,:created_at,:updated_at)`,
  getUserDetail: `select * from users where phone=:phone`,

  insertActivityLog: `insert into activity_log 
  (u_uuid,table_name,replacement,result,operation,created_at,updated_at,
    created_by,updated_by)
  values (:u_uuid,:table_name,:replacement,:result,:operation,
    :created_at,:updated_at,:created_by,:updated_by)`,

  insertContact: `insert into contacts 
  (uuid,company_id,name,email,mobile1,mobile2,address,city,company,type,is_active,is_deleted,created_at,updated_at,created_by,updated_by) 
    values (
      :uuid,:company_id,:name,:email,:mobile1,:mobile2,:address,:city,:company,:type,
      :is_active,:is_deleted,:created_at,:updated_at,
      :created_by,:updated_by
    )`,
  getContactIdFromUuid: `select * from contacts where uuid=:uuid and is_active=true and is_deleted=false`,

  updateCotact: replacement => {
    let q = `update contacts set updated_at=:updated_at,updated_by=:updated_by`;
    if (replacement.name) {
      q += `,name=:name`;
    }
    if (replacement.company_id) {
      q += `,company_id=:company_id`;
    }
    // if(replacement.last_name) {
    if (replacement.email) {
      q += `,email=:email`;
    }
    if (replacement.mobile1) {
      q += `,mobile1=:mobile1`;
    }
    if (replacement.mobile2) {
      q += `,mobile2=:mobile2`;
    }
    if (replacement.address) {
      q += `,address=:address`;
    }
    if (replacement.city) {
      q += `,city=:city`;
    }
    if (replacement.company) {
      q += `,company=:company`;
    }
    if (replacement.type) {
      q += `,type=:type`;
    }
    q += ` where id=:contact_id`;
    return q;
  },

  getContacts: replacement => {
    let q = `select uuid as uuid,name,
    mobile1,mobile2,address,city,company,type,
    email from contacts 
    where 
    (
      case 
        when :is_search 
        then upper(name) like upper(:search) or 
           upper(mobile1) like upper(:search) or
           upper(mobile2) like upper(:search) 
       else true end
    )
    and is_active=true
    and is_deleted=false
    and company_id=:company_id
     order by name asc
    `;
    if (replacement.download_excel === false) {
      q += `offset :offset limit :limit `;
    }
    return q;
  },

  getContactsCount: `
    select count(*) from contacts
    where 
    (
      case 
      when :is_search 
      then upper(name) like upper(:search) or 
        upper(mobile1) like upper(:search) or
        upper(mobile2) like upper(:search) 
    else true end
    )
    and is_active=true
    and is_deleted=false
    and company_id=:company_id
  `,
  insertStock: `insert into stocks 
  (uuid,stock_id,company_id,buy_price,buy_price_per,buy_date,buy_person_id,buy_transaction_id,
    weight,status,sell_price,sell_price_per,sell_date,sell_person_id,sell_transaction_id,note,
    is_active,is_deleted,created_at,updated_at,created_by,updated_by) 
    values (
      :uuid,:stock_id,:company_id,:buy_price,:buy_price_per,:buy_date,:buy_person_id,:buy_transaction_id,
      :weight,:status,:sell_price,:sell_price_per,:sell_date,:sell_person_id,:sell_transaction_id,:note,
      :is_active,:is_deleted,:created_at,:updated_at,
      :created_by,:updated_by
    ) returning id`,
  getStockIdFromUuid: `select * from stocks where uuid=:uuid and is_active=true and is_deleted=false`,
  getStockDetailFromId: `select * from stocks where id=:id and is_active=true and is_deleted=false`,
  updateStock: replacement => {
    let q = `update stocks set updated_at=:updated_at,updated_by=:updated_by`;
    if (replacement.stock_id) {
      q += `,stock_id=:stock_id`;
    }
    if (replacement.company_id) {
      q += `,company_id=:company_id`;
    }
    // if(replacement.last_name) {
    if (replacement.buy_price) {
      q += `,buy_price=:buy_price`;
    }
    if (replacement.buy_price_per) {
      q += `,buy_price_per=:buy_price_per`;
    }
    if (replacement.buy_date) {
      q += `,buy_date=:buy_date`;
    }
    if (replacement.buy_person_id) {
      q += `,buy_person_id=:buy_person_id`;
    }
    if (replacement.buy_transaction_id) {
      q += `,buy_transaction_id=:buy_transaction_id`;
    }
    if (replacement.status) {
      q += `,status=:status`;
    }
    if (replacement.weight) {
      q += `,weight=:weight`;
    }
    if (replacement.sell_price) {
      q += `,sell_price=:sell_price`;
    }
    if (replacement.sell_price_per) {
      q += `,sell_price_per=:sell_price_per`;
    }
    if (replacement.sell_date) {
      q += `,sell_date=:sell_date`;
    }
    if (replacement.hasOwnProperty('sell_person_id')) {
      q += `,sell_person_id=:sell_person_id`;
    }
    if (replacement.sell_transaction_id) {
      q += `,sell_transaction_id=:sell_transaction_id`;
    }
    if (replacement.hasOwnProperty('is_active')) {
      q += `,is_active=:is_active`;
    }
    if (replacement.hasOwnProperty('is_deleted')) {
      q += `,is_deleted=:is_deleted`;
    }
    if (replacement.note) {
      q += `,note=:note`;
    }
    q += ` where id=:id`;
    return q;
  },

  getStocks: replacement => {
    let q = `select s.uuid as uuid,stock_id,
    buy_price,buy_price_per,buy_date,cb.name as buy_person_name,cb.uuid as buy_person_id,
    buy_transaction_id,weight,status,sell_price,sell_price_per,sell_date,cs.name as sell_person_name,cs.uuid as sell_person_id,
    sell_transaction_id,note,s.updated_at
    from stocks  as s
    left join contacts as cb on cb.id=s.buy_person_id
    left join contacts as cs on cs.id=s.sell_person_id
    where 
    (
      case 
        when :is_search 
        then upper(stock_id) like upper(:search) or
          upper(status) like upper(:search) or
         upper(cb.name) like upper(:search) or
         upper(cs.name) like upper(:search)
       else true end
    )
    and 
      case 
        when :status is not null 
        then status=:status 
        else true   
      end
    and s.is_active=true
    and s.is_deleted=false
    and s.company_id=:company_id
    order by s.updated_at desc`;
    if (replacement.download_excel === false) {
      q += ` offset :offset limit :limit `;
    }
    return q;
  },

  getStocksCount: `select count(*) from stocks as s
  left join contacts as cb on cb.id=s.buy_person_id
  left join contacts as cs on cs.id=s.sell_person_id
  where 
  (
    case 
      when :is_search 
      then upper(stock_id) like upper(:search) or
      upper(status) like upper(:search) or
       upper(cb.name) like upper(:search) or
       upper(cs.name) like upper(:search)
     else true end
  )
  and 
    case 
      when :status is not null 
      then status=:status 
      else true   
    end
  and s.is_active=true
  and s.is_deleted=false
  and s.company_id=:company_id
  `,

  insertStockHistory: `insert into stock_history
  (uuid,stock_id,action,action_date,person_id,note,
    is_active,is_deleted,created_at,updated_at,created_by,updated_by) 
    values (
      :uuid,:stock_id,:action,:action_date,:person_id,:note,
      :is_active,:is_deleted,:created_at,:updated_at,
      :created_by,:updated_by
    )`,

  insertTransaction: `insert into transactions 
    (uuid,person_id,company_id,transaction_date,credit,debit,mode,note,
      is_active,is_deleted,created_at,updated_at,created_by,updated_by) 
      values (
        :uuid,:person_id,:company_id,:transaction_date,:credit,:debit,:mode,:note,
        :is_active,:is_deleted,:created_at,:updated_at,
        :created_by,:updated_by
    ) returning id`,
  getTransactionIdFromUuid: `select id from transactions where uuid=:uuid`,

  updateTransaction: replacement => {
    let q = `update transactions set updated_at=:updated_at,updated_by=:updated_by`;
    if (replacement.stock_id) {
      q += `,stock_id=:stock_id`;
    }
    if (replacement.company_id) {
      q += `,company_id=:company_id`;
    }
    // if(replacement.last_name) {
    if (replacement.hasOwnProperty('person_id')) {
      q += `,person_id=:person_id`;
    }
    if (replacement.transaction_date) {
      q += `,transaction_date=:transaction_date`;
    }
    if (replacement.hasOwnProperty('credit')) {
      q += `,credit=:credit`;
    }
    if (replacement.hasOwnProperty('debit')) {
      q += `,debit=:debit`;
    }
    if (replacement.mode) {
      q += `,mode=:mode`;
    }
    if (replacement.note) {
      q += `,note=:note`;
    }
    if (replacement.hasOwnProperty('is_active')) {
      q += `,is_active=:is_active`;
    }
    if (replacement.hasOwnProperty('is_deleted')) {
      q += `,is_deleted=:is_deleted`;
    }
    q += ` where id=:id`;
    return q;
  },
  getTransactions: replacement => {
    let q = `select t.uuid as uuid,
      c.uuid as person_id,c.name as name,transaction_date,credit,debit,mode,note,t.updated_at
      from transactions  as t
      left join contacts as c on c.id=t.person_id
      where 
      (
        case 
          when :is_search
          then 
          --upper(stock_id) like upper(:search) or
           upper(c.name) like upper(:search) or 
           upper(mode) like upper(:search) 
         else true end
      ) 
      and 
        case 
          when :person_id is not null 
          then person_id=:person_id 
          else true 
        end
      and 
        case 
          when :mode is not null 
          then mode=:mode 
          else true 
        end
      and t.is_active=true
      and t.is_Deleted=false
      and t.company_id=:company_id
      order by t.updated_at desc
      `;
    if (replacement.download_excel === false) {
      q += ` offset :offset limit :limit `;
    }
    return q;
  },

  getTransactionsCount: `select count(*) from transactions as t
      left join contacts as c on c.id=t.person_id
      where 
      (
        case 
          when :is_search 
          then 
          --upper(stock_id) like upper(:search) or
            upper(c.name) like upper(:search)
        else true end
      ) and
      case when :person_id is not null then person_id=:person_id else true end
      and 
        case 
          when :mode is not null 
          then mode=:mode 
          else true 
        end
      and t.is_active=true
      and t.is_Deleted=false
      and t.company_id=:company_id
    `,

  insertTransactionHistory: `insert into transaction_history
      (uuid,action,action_date,person_id,note,
      is_active,is_deleted,created_at,updated_at,created_by,updated_by) 
      values (
        :uuid,:action,:action_date,:person_id,:note,
        :is_active,:is_deleted,:created_at,:updated_at,
        :created_by,:updated_by
      )`,

  insertOpeningBalance: `insert into opening_balance
      (uuid,date,company_id,amount,note,
      is_active,is_deleted,created_at,updated_at,created_by,updated_by) 
      values (
        :uuid,:date,:company_id,:amount,:note,
        :is_active,:is_deleted,:created_at,:updated_at,
        :created_by,:updated_by
      )`,

  updateOpeningBalance: replacement => {
    let q = `update opening_balance set updated_at=:updated_at,updated_by=:updated_by`;
    if (replacement.amount) {
      q += `,amount=:amount`;
    }
    if (replacement.company_id) {
      q += `,company_id=:company_id`;
    }
    if (replacement.note) {
      q += `,note=:note`;
    }
    q += ` where uuid=:uuid`;
    return q;
  },

  getOpeningBalance: replacement => {
    let q = `select amount,uuid from opening_balance where date=:date and is_active=true and is_deleted=false and company_id=:company_id`;
    return q;
  },
  getOpeningBalanceIdFromUuid: `select * from opening_balance where uuid=:uuid and is_active=true and is_deleted=false`,

  insertUserSettings: `insert into user_settings
      (uuid,key,value,company_id,
      is_active,is_deleted,created_at,updated_at,created_by,updated_by) 
      values (
        :uuid,:key,:value,:company_id,
        :is_active,:is_deleted,:created_at,:updated_at,
        :created_by,:updated_by
      )`,

  updateUserSetting: replacement => {
    let q = `update user_settings set updated_at=:updated_at,updated_by=:updated_by`;
    // if(replacement.key) {
    //   q += `,key=:key`;
    // }
    if (replacement.value) {
      q += `,value=:value`;
    }
    q += ` where uuid=:uuid`;
    return q;
  },

  getUserSettings: replacement => {
    let q = `select value,uuid from user_settings 
      where 
        key=:key 
        and is_active=true 
        and is_deleted=false
        and company_id=:company_id
        `;
    return q;
  },

  getUserSettingsIdFromUuid: `select * from user_settings 
    where 
      uuid=:uuid 
      and is_active=true 
      and is_deleted=false
      and company_id=:company_id  
    `,

  getFinalAmountForDate: `
      with transaction_data as (
        select sum(coalesce(credit,0)-coalesce(debit,0)) as transaction  
        from transactions 
        where mode='cash' 
        and is_active=true
        and is_deleted=false
        and company_id=:company_id
        ),

      opening_balance_data as (
        select value as opening_balance from user_settings 
        where key='base_amount'
        and is_active=true
        and is_deleted=false
        and company_id=:company_id
      )
      select opening_balance as "openingBalance", coalesce(opening_balance::integer,0)+coalesce(transaction::integer,0) as "total" from transaction_data inner join opening_balance_data on true
    `,
  getStockAndAmountWithDalal: `
      select 
      contacts.uuid,name,sum(weight) as weight,
      CASE 
        WHEN sell_price_per='carat' THEN sum(sell_price::integer * weight)
        ELSE sum(sell_price::integer)
      END as amount,
      count(*) as "totalStones",
      string_agg(stock_id,',') as stones
      from stocks 
      inner join contacts on sell_person_id=contacts.id
      where status ='jangad' 
      and (
        case 
          when :is_search 
          then upper(name) like upper(:search) 
         else true end
      )
      and stocks.is_active=true
      and stocks.is_deleted=false
      and stocks.company_id=:company_id
      and contacts.company_id=:company_id
      group by sell_person_id,contacts.uuid,name,sell_price_per
      order by name
      offset :offset limit :limit 
    `,

  getStockAndAmountWithDalalCount: `
      select count(distinct contacts.uuid) from stocks
      inner join contacts on sell_person_id=contacts.id
      where status ='jangad' 
      and (
        case 
          when :is_search 
          then upper(name) like upper(:search) 
         else true end
      )
      and stocks.is_active=true
      and stocks.is_deleted=false
      and stocks.company_id=:company_id
      and contacts.company_id=:company_id
    `
  ,
  getAccountSummary: `
      select c.name,c.uuid,sum(coalesce(credit,0)) as credit,sum(coalesce(debit,0)) as debit,sum(coalesce(debit,0)-coalesce(credit,0)) as total from transactions as t 
      inner join contacts as c on t.person_id=c.id 
      where  
        case 
          when :is_search 
          then upper(name) like upper(:search) 
         else true end
      and t.is_active=true
      and t.is_deleted=false
      and t.company_id=:company_id
      and c.company_id=:company_id 
      group by c.uuid,c.name
      order by name
      offset :offset limit :limit 
    `,

  getAccountSummaryCount: `
      select count(distinct contacts.uuid) from transactions
      inner join contacts on person_id=contacts.id
      where  
        case 
          when :is_search 
          then upper(name) like upper(:search) 
         else true end
        and transactions.is_active=true
        and transactions.is_deleted=false
        and contacts.company_id=:company_id
        and transactions.company_id=:company_id 
    `,

  addCompany: `
      insert into company (uuid,company_name,phone,created_by,updated_by,created_at,updated_at)
      values (:uuid,:company_name,:phone,:created_by,:updated_by,:created_at,:updated_at)
    `,

  updateCompany: replacement => {
    let q = `update company set updated_at=:updated_at,updated_by=:updated_by`;
    // if(replacement.key) {
    //   q += `,key=:key`;
    // }
    if (replacement.company_name) {
      q += `,company_name=:company_name`;
    }
    if (replacement.phone) {
      q += `,phone=:phone`;
    }
    q += ` where uuid=:uuid`;
    return q;
  },

  getCompanies: `
    select 
      uuid,company_name from company 
    where 
      case 
        when :is_search 
        then upper(company_name) like upper(:search) 
        else true end

      and is_active=true 
      and is_deleted=false
  `,
  getCompanyIdFromUuid: `select * from company where uuid=:uuid and is_active=true and is_deleted=false`,
};
