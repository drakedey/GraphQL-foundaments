
const User = {
  publications: (root, args, { db }) => {
    return db.posts.filter(({ author }) => author === root.id.toString());
  },
  comments: (root, args, { db }) => db.comments.filter(({ user }) => root.id === user)
}

export default User;