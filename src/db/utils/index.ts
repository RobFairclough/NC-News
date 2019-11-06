const bcrypt = require('bcrypt');

type IDLookupObject<T> = {
  [key: string]: T;
}

type DataWithTimestamp = Article | Comment;



  export function changeTimestampToDate(array: DataWithTimestamp[]): DataWithTimestamp[] {
    return array.map((element: DataWithTimestamp) => {
      const timestamp = new Date(element.created_at);
      const day = timestamp.getDate();
      const month = timestamp.getMonth() + 1;
      const year = timestamp.getFullYear();
      const date = [year, month, day].join('-');
      element.created_at = date;
      return element;
    });
  }

  export function renameColumn(array: DataWithTimestamp[], before: string, after: string): DataWithTimestamp[] {
    // @ts-ignore 
    const mapFunc = (beforeCol: string, afterCol: string, { [beforeCol]: old, ...others }): DataWithTimestamp => ({
      [afterCol]: old,
      ...others,
    });
    return array.map((obj: DataWithTimestamp) => mapFunc(before, after, obj));
  }

  export function getArticleIds(articles: Article[]): IDLookupObject<number> {
    const obj: IDLookupObject<number> = {};
    articles.forEach(({ title, article_id }) => {
      obj[title] = article_id;
    });
    return obj;
  }

  export function setArticleIds(comments: Comment[], object: IDLookupObject<number>): Comment[] {
    // @ts-ignore 
    return comments.map((comment: Comment) => ({...comment, article_id:object[comment.belongs_to]}));
  }
  // bad bad mutating
  export function reformatDate(arr: DataWithTimestamp[] | DataWithTimestamp): void {
    if (Array.isArray(arr)) {
      arr.forEach((obj) => {
        obj.created_at = JSON.stringify(obj.created_at).slice(1, 11);
      });
    } else arr.created_at = JSON.stringify(arr.created_at).slice(1, 11);
  }

  export function formatUsers(rawUsers: User | User[]): User | User[] {
    const formatUser = (user: User): User => ({...user, password: bcrypt.hashSync(user.password, 10)})
    if (Array.isArray(rawUsers)) return rawUsers.map(formatUser)
    return formatUser(rawUsers);
  }

module.exports = {changeTimestampToDate, renameColumn, getArticleIds, setArticleIds, reformatDate, formatUsers };

