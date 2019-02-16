exports.up = function (knex, Promise) {
    return knex.schema.createTable('users', (table) => {
        table
            .string('username')
            .primary()
            .unique();
        table
            .string('avatar_url')
            .defaultTo('https://img.buzzfeed.com/buzzfeed-static/static/2016-12/14/15/asset/buzzfeed-prod-fastlane02/sub-buzz-29050-1481748759-4.jpg');
        table.string('name').notNullable();
        table.string('password').notNullable();
    });
};
exports.down = function (knex, Promise) {
    return knex.schema.dropTable('users');
};
