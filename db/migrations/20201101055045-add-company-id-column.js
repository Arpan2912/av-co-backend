'use strict';

module.exports = {
  up: async (queryInterface) => {
    try {
      await queryInterface.sequelize.query(
        `alter table contacts add column if not exists company_id integer`,
      );
      await queryInterface.sequelize.query(
        `alter table stocks add column if not exists company_id integer`,
      );
      await queryInterface.sequelize.query(
        `alter table transactions add column if not exists company_id integer`,
      );
      await queryInterface.sequelize.query(
        `alter table opening_balance add column if not exists company_id integer`,
      );
      await queryInterface.sequelize.query(
        `alter table user_settings add column if not exists company_id integer`,
      );
      Promise.resolve();
    } catch (err) {
      Promise.reject(err);
    }
  },
  down: async (queryInterface) => {
    try {
      
      await queryInterface.sequelize.query(
        `alter table contacts drop column if  exists company_id`,
      );
      await queryInterface.sequelize.query(
        `alter table stocks drop column if  exists company_id`,
      );
      await queryInterface.sequelize.query(
        `alter table transactions drop column if  exists company_id`,
      );
      await queryInterface.sequelize.query(
        `alter table opening_balance drop column if  exists company_id`,
      );
      await queryInterface.sequelize.query(
        `alter table user_settings drop column if  exists company_id`,
      );
     
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  },
};

