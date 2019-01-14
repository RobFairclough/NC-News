exports.up = function (knex, Promise) {
  return knex.schema.createTable('articles', (table) => {
    table
      .increments('article_id')
      .primary()
      .unique();
    table.string('title').notNullable();
    table.text('body').notNullable();
    table.integer('votes').defaultTo(0);
    table.string('topic').notNullable();
    table.foreign('topic').references('topics.slug');
    table.string('username').notNullable();
    table.foreign('username').references('users.username');
    table
      .date('created_at')
      .notNullable()
      .defaultTo(knex.fn.now());
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('articles');
};
