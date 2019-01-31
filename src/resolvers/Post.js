
 const  Post = {
    author: (root, args, { db }) => {
      return db.users.find(({ id }) => id.toString() === root.author);
    },
    comments: (root, args, { db }) => db.comments.filter(({ post }) => root.id === post)
  }

  export default Post;