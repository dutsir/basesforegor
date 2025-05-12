import { QueryInterface } from 'sequelize';

export async function up(queryInterface: QueryInterface) {
  await queryInterface.sequelize.query(`
    CREATE TRIGGER UpdateProductTimestamp
    AFTER UPDATE ON PRODUCTS
    BEGIN
      UPDATE PRODUCTS SET updated_at = CURRENT_TIMESTAMP WHERE product_id = OLD.product_id;
    END;
  `);
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.sequelize.query(`
    DROP TRIGGER IF EXISTS UpdateProductTimestamp;
  `);
} 