'use strict';

module.exports = {
  up: async (queryInterface) => {
    try {
      await queryInterface.sequelize.query(
        `alter table stocks add column if not exists buy_price_per varchar(255) not null default  'carat'`,
      );
      await queryInterface.sequelize.query(
        `alter table stocks add column if not exists sell_price_per varchar(255) not null default  'carat'`,
      );
      Promise.resolve();
    } catch (err) {
      Promise.reject(err);
    }
  },
  down: async (queryInterface) => {
    try {
      
      await queryInterface.sequelize.query(
        `alter table stocks drop column if  exists buy_price_per`,
      );
      await queryInterface.sequelize.query(
        `alter table stocks drop column if  exists sell_price_per`,
      );
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  },
};

