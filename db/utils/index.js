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
    array.forEach((obj) => {
      obj[after] = obj[before];
      delete obj[before];
    });
    return array;
  },

  getArticleIds(articles) {
    const obj = {};
    articles.forEach(({ title, article_id }) => {
      obj[title] = article_id;
    });
    return obj;
  },

  setArticleIds(articles, object) {
    // have the column belongs to, change to article id
    return articles.map((article) => {
      article.article_id = object[article.belongs_to];
      delete article.belongs_to;
      return article;
    });
  },
};
