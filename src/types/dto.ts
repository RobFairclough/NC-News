interface User  {
  username: string;
  name: string;
  password?: string;
  avatar_url?: string;
}

interface Comment {
  article_id: number;
  comment_id: number;
  votes: number;
  created_at: string;
  username?: string;
  author?: string;
  body: string;
}

interface Article {
  username?: string;
  author?: string;
  article_id: number;
  votes: number;
  created_at: string;
  topic: string;
  avatar_url?: string;
  body?: string;
  title: string;
}

interface Topic {
  slug: string;
  description: string;
}