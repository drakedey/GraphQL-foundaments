const users = [
  {
    id: 1,
    username: 'Joskar',
    password: '12713697a'
  },
  {
    id: 2,
    username: 'Josber',
    password: '26618307a'

  },
  {
    id: 3,
    username: 'Joger',
    password: '1234'
  },
]

const comments = [
  {
    id: 1,
    user: 1,
    post: 1,
    title: 'Great Post',
    body: 'Thanks for the post'
  },
  {
    id: 2,
    user: 2,
    post: 2,
    title: 'Average Post',
    body: 'Thanks for the average post'
  },
  {
    id: 3,
    user: 3,
    post: 3,
    title: 'Bad Post',
    body: 'Thanks for the Bad post'
  },
  {
    id: 4,
    user: 1,
    post: 3,
    title: 'This post sucks',
    body: 'Fuck you bastard'
  },
]

const posts = [
  {
    id: 1,
    title: 'Post title average',
    body: 'Post Body average',
    published: false,
    author: '2',
  },
  {
    id: 2,
    title: 'Post title interesting',
    body: 'Post Body interesting',
    published: true,
    author: '1'
  },
  {
    id: 3,
    title: 'Post title non intentesting',
    body: 'Post Body non intentesting',
    published: false,
    author: '3'
  }
]

const db = {
  users,
  comments,
  posts
}

export default db;