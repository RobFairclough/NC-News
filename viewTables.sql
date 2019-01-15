\c nc_knews_dev
-- SELECT * FROM topics;
-- SELECT * FROM users;
SELECT article_id, comment_id, username, created_at FROM comments;
SELECT article_id, votes FROM articles;