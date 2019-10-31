const bcrypt = require('bcryptjs');

module.exports = {
  changeTimestampToDate(array) {
    return array.map((element) => {
      const timestamp = new Date(element.created_at);
      const day = timestamp.getDate();
      const month = timestamp.getMonth() + 1;
      const year = timestamp.getFullYear();
      const date = [year, month, day].join('-');
      element.created_at = date;
      return element;
    });
  },

  renameColumn(array, before, after) {
    const mapFunc = (beforeCol, afterCol, { [beforeCol]: old, ...others }) => ({
      [afterCol]: old,
      ...others,
    });
    return array.map(obj => mapFunc(before, after, obj));
  },

  getArticleIds(articles) {
    const obj = {};
    articles.forEach(({ title, article_id }) => {
      obj[title] = article_id;
    });
    return obj;
  },

  setArticleIds(articles, object) {
    return articles.map(article => Object.keys(article).reduce(
      (obj, key) => {
        if (key !== 'belongs_to') obj[key] = article[key];
        return obj;
      },
      { article_id: object[article.belongs_to] },
    ));
  },
  reformatDate(arr) {
    if (Array.isArray(arr)) {
      arr.forEach((obj) => {
        obj.created_at = JSON.stringify(obj.created_at).slice(1, 11);
      });
    } else arr.created_at = JSON.stringify(arr.created_at).slice(1, 11);
  },

  formatUsers(rawUsers) {
    if (Array.isArray(rawUsers)) {
      return rawUsers.map(user => ({
        ...user,
        password: bcrypt.hashSync(user.password),
      }));
    }
    const user = { ...rawUsers };
    user.password = bcrypt.hashSync(rawUsers.password);
    return user;
  },
};
