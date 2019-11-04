const bcrypt = require('bcrypt');

type IDLookupObject<T> = {
  [key: string]: T;
}
interface DataWithTimestamp {
  created_at: string;
  [key: string]: any;
}



module.exports = {
  changeTimestampToDate(array: DataWithTimestamp[]): DataWithTimestamp[] {
    return array.map((element: DataWithTimestamp) => {
      const timestamp = new Date(element.created_at);
      const day = timestamp.getDate();
      const month = timestamp.getMonth() + 1;
      const year = timestamp.getFullYear();
      const date = [year, month, day].join('-');
      element.created_at = date;
      return element;
    });
  },

  renameColumn(array: object[], before: string, after: string): object[] {
    const mapFunc = (beforeCol: string, afterCol: string, { [beforeCol]: old, ...others }): object => ({
      [afterCol]: old,
      ...others,
    });
    return array.map((obj: object) => mapFunc(before, after, obj));
  },

  getArticleIds(articles: Article[]): object {
    const obj: IDLookupObject<number> = {};
    articles.forEach(({ title, article_id }) => {
      obj[title] = article_id;
    });
    return obj;
  },

  setArticleIds(articles: Article[], object: object): Article[] {
    return articles.map((article: Article) => Object.keys(article).reduce(
      (obj: any, key: string) => {
        if (key !== 'belongs_to') obj[key] = article[key];
        return obj;
      },
      { article_id: object[article.belongs_to] },
    ));
  },
  // bad bad mutating
  reformatDate(arr: DataWithTimestamp[] | DataWithTimestamp): void {
    if (Array.isArray(arr)) {
      arr.forEach((obj) => {
        obj.created_at = JSON.stringify(obj.created_at).slice(1, 11);
      });
    } else arr.created_at = JSON.stringify(arr.created_at).slice(1, 11);
  },

  // bad bad bad
  formatUsers(rawUsers: User[] | User): User | User[] {
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
