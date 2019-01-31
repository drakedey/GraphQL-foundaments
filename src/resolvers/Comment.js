const Comment = {
  user: (root, args, { db }) => {
    console.log(root);
    return db.users.find(({ id }) => root.user == id);
  },
  post: (root, args, { db }) => {
    return db.posts.find(({ id }) => root.post == id);
  }
};

export { Comment as default };