const Query = {
  loggedUser: () => {
    return { id: 1, username: 'Joskar', password: '12713697a' }
  },
  getPost: () => {
    return posts[0];
  },
  getUsers: (root, { query }, { db }) => {
    return !query ? db.users : db.users.filter((user) => user.username.toLowerCase().includes(query.toLowerCase()));
  },
  getPosts: (root, { query }, { db }) => {
    const result = (queryString, postsArray) => postsArray.filter(({ title, body }) => title.toLowerCase().includes(queryString.toLowerCase()) || body.toLowerCase().includes(queryString.toLowerCase()))
    return !query ? db.posts : result(query, db.posts);
  },
  getComments: (root, args, { db }) => {
    return db.comments;
  }
}

export default Query;