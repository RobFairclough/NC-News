var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
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
        const mapFunc = (beforeCol, afterCol, _a) => {
            var _b = beforeCol, old = _a[_b], others = __rest(_a, [typeof _b === "symbol" ? _b : _b + ""]);
            return (Object.assign({ [afterCol]: old }, others));
        };
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
        return articles.map(article => Object.keys(article).reduce((obj, key) => {
            if (key !== 'belongs_to')
                obj[key] = article[key];
            return obj;
        }, { article_id: object[article.belongs_to] }));
    },
    reformatDate(arr) {
        if (Array.isArray(arr)) {
            arr.forEach((obj) => {
                obj.created_at = JSON.stringify(obj.created_at).slice(1, 11);
            });
        }
        else
            arr.created_at = JSON.stringify(arr.created_at).slice(1, 11);
    },
    formatUsers(rawUsers) {
        if (Array.isArray(rawUsers)) {
            return rawUsers.map(user => (Object.assign({}, user, { password: bcrypt.hashSync(user.password, 10) })));
        }
        const user = Object.assign({}, rawUsers);
        user.password = bcrypt.hashSync(rawUsers.password, 10);
        return user;
    },
};
