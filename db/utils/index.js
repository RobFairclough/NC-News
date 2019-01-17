const bcrypt = require('bcrypt');

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
    const newArr = [];
    array.forEach(obj => newArr.push(JSON.parse(JSON.stringify(obj))));
    newArr.forEach((obj) => {
      obj[after] = obj[before];
      delete obj[before];
    });
    return newArr;
  },

  getArticleIds(articles) {
    const obj = {};
    articles.forEach(({ title, article_id }) => {
      obj[title] = article_id;
    });
    return obj;
  },

  setArticleIds(articles, object) {
    const newArr = [];
    articles.forEach(article => newArr.push(JSON.parse(JSON.stringify(article))));
    return newArr.map((article) => {
      article.article_id = object[article.belongs_to];
      delete article.belongs_to;
      return article;
    });
  },
  reformatDate(arr) {
    if (Array.isArray(arr)) {
      arr.forEach((obj) => {
        obj.created_at = JSON.stringify(obj.created_at).slice(1, 11);
      });
    } else arr.created_at = JSON.stringify(arr.created_at).slice(1, 11);
  },

  formatUsers(rawUsers) {
    return rawUsers.map(user => ({
      ...user,
      password: bcrypt.hashSync(user.password, 10),
    }));
  },
};
