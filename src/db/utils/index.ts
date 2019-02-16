const bcrypt = require('bcrypt');

interface dataWithTimestamp {
  created_at: string;
}
interface Article {
  username?: string;
  author?: string;
  article_id: number;
  belongs_to?: string;
  votes: number;
  created_at: string;
  topic: string;
  avatar_url?: string;
  body?: string;
  title: string;
  [index: string]: string | number;
}
interface User {
  username: string;
  name: string;
  password?: string;
  avatar_url?: string;
}

module.exports = {
  changeTimestampToDate(array: dataWithTimestamp[]) {
    return array.map((element: dataWithTimestamp) => {
      const timestamp = new Date(element.created_at);
      const day = timestamp.getDate();
      const month = timestamp.getMonth() + 1;
      const year = timestamp.getFullYear();
      const date = [year, month, day].join('-');
      element.created_at = date;
      return element;
    });
  },

  renameColumn(array: any[], before: string, after: string) {
    const mapFunc = (beforeCol: string, afterCol: string, { [beforeCol]: old, ...others }) => ({
      [afterCol]: old,
      ...others,
    });
    return array.map((obj: object) => mapFunc(before, after, obj));
  },

  getArticleIds(articles: Article[]) {
    const obj: any = {};
    articles.forEach(({ title, article_id }) => {
      obj[title] = article_id;
    });
    return obj;
  },

  setArticleIds(articles: Article[], object: any) {
    return articles.map((article: Article) => Object.keys(article).reduce(
      (obj: any, key: any) => {
        if (key !== 'belongs_to') obj[key] = article[key];
        return obj;
      },
      { article_id: object[article.belongs_to] },
    ));
  },
  reformatDate(arr: dataWithTimestamp[] | dataWithTimestamp) {
    if (Array.isArray(arr)) {
      arr.forEach((obj) => {
        obj.created_at = JSON.stringify(obj.created_at).slice(1, 11);
      });
    } else arr.created_at = JSON.stringify(arr.created_at).slice(1, 11);
  },

  formatUsers(rawUsers: User[] | User) {
    if (Array.isArray(rawUsers)) {
      return rawUsers.map(user => ({
        ...user,
        password: bcrypt.hashSync(user.password, 10),
      }));
    }
    const user = { ...rawUsers };
    user.password = bcrypt.hashSync(rawUsers.password, 10);
    return user;
  },
};
