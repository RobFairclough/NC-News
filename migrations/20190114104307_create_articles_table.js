exports.up = function (knex, Promise) {
  return knex.schema.createTable('articles', (table) => {
    table
      .increments('article_id')
      .primary()
      .unique();
    table.text('title').notNullable();
    table.text('body').notNullable();
    table.integer('votes').defaultTo(0);
    table.text('topic').notNullable();
    table.foreign('topic').references('topics.slug');
    table.text('username').notNullable();
    table
      .foreign('username')
      .references('users.username')
      .onDelete('CASCADE');
    table
      .date('created_at')
      .notNullable()
      .defaultTo(knex.fn.now(6));
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('articles');
};
