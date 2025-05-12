import { Sequelize } from 'sequelize';

async function checkDatabase() {
  const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './labe_trytwo.sqlite',
    logging: console.log
  });

  try {
    await sequelize.authenticate();
    console.log('Коннект с базой есть');

   
    const tables = await sequelize.query(`
      SELECT name FROM sqlite_master 
      WHERE type='table' 
      AND name NOT LIKE 'sqlite_%';
    `);

    console.log('Available tables:', tables[0]);

    
    const cartItemsStructure = await sequelize.query(`
      PRAGMA table_info(cart_items);
    `);

    console.log('Cart итемы табличка структур', cartItemsStructure[0]);

  } catch (error) {
    console.error('КОннекта нет с базой ', error);
  } finally {
    await sequelize.close();
  }
}

checkDatabase(); 