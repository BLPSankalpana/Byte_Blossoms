exports.up = function (knex) {
    return knex.schema.createTable('orders', function (table) {
      table.increments('id').primary();
      table.string('product').notNullable();
      table.integer('quantity').notNullable();
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable('orders');
  };