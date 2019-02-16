exports.up = function (knex, Promise) {
  return knex.schema.createTable('comments', (table) => {
    table
      .increments('comment_id')
      .primary()
      .unique();
    table.string('username').notNullable();
    table
      .foreign('username')
      .references('users.username')
      .onDelete('CASCADE');
    table.integer('article_id').notNullable();
    table
      .foreign('article_id')
      .references('articles.article_id')
      .onDelete('CASCADE');
    table.integer('votes').defaultTo(0);
    table
      .date('created_at')
      .notNullable()
      .defaultTo(knex.fn.now(6));
    table.text('body').notNullable();
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('comments');
};
