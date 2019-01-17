exports.up = function (knex, Promise) {
  return knex.schema.createTable('authorisations', (table) => {
    table
      .string('username')
      .primary()
      .unique();
    table.string('password');
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('authorisations');
};
