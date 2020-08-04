module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("stocks", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uuid: {
        allowNull: false,
        type: Sequelize.UUID
      },
      stock_id:{
        type: Sequelize.STRING,
        allowNull: false
      },
      weight:{
        type: Sequelize.FLOAT,
        allowNull: false
      },
      buy_price: {
        type: Sequelize.STRING,
        allowNull: true
      },
      buy_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      buy_person_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      buy_transaction_id:{
        type: Sequelize.INTEGER,
        allowNull: true
      },
      status: {
        type: Sequelize.STRING,
        allowNull: true
      },
      sell_price: {
        type: Sequelize.STRING,
        allowNull: true
      },
      sell_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      sell_person_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      sell_transaction_id:{
        type: Sequelize.INTEGER,
        allowNull: true
      },
      note: {
        type: Sequelize.STRING,
        allowNull: true
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      is_deleted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      updated_by: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("stocks");

    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
