const Mutation = {
  createUser: (root, args, { db }) => {
    const newUser = {
      ...args.data,
      id: users.length++
    }
    db.users.push(newUser);
    return db.users[users.length - 1];
  },

  deleteUser: (root, { id }, { db }) => {
    const userInd = db.users.findIndex(({ id:uId }) => uId.toString() === id);
    if (userInd < 0) {
      throw new Error('User not found');
    }
    const [deletedUser] = users.splice(userInd, 1)
    // Deleting user's Posts
    console.log('POSTS BEFORE: ', posts);
    console.log('COMMENTS BEFORE: ',comments);
    db.posts = db.posts.filter((post) => {
      const match = post.author == deletedUser.id;
      if (match) {
        comments = db.comments.filter(comment => comment.post !== post.id);
      }
      return !match;
    })
    db.comments = db.comments.filter( comment => comment.user !== deletedUser.id);
    console.log('POSTS AFTER: ', posts);
    console.log('COMMENTS AFTER: ',comments);
    return deletedUser;
  },

  updateUser: (root, args, { db }) => {
   const { id:entryId, data } = args
    const { users } = db;
    let user = users.find(({ id }) => id == entryId);
    if(!user) throw new Error('User not found');
    if(data.username) user.username = data.username;
    if(data.password) user.password = data.password;
    console.log(user);
    return user;
  },

  createPost: (parent, args, { db, pubsub }, info) => {
    const { author: userID } = args.data;
    const userExist = db.users.some(({ id }) => id.toString() === userID);
    if (!userExist) {
      throw new Error('User does not exists!');
    }

    const post = {
      id: db.posts.length++,
      ...args.data,
      author: userID
    }
    db.posts.push(post);
    if (args.data.published) pubsub.publish('post', {
      post: { data: post, mutation: 'CREATED' }
    });
    return post;
  },

  deletePost: (parent, args, { db, pubsub }, info) => {
    const { id } = args;
    const postIndex = db.posts.findIndex(({ id:postID }) => postID == id);
    if(postIndex < 0) {
      throw new Error('Post does not extists');
    }
    const [deletedPost] = db.posts.splice(postIndex, 1);
    db.comments = db.comments.filter(({ post }) => post != deletedPost.id);
    if (deletedPost.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'DELETED',
          data: deletedPost
        }
      })
    }
    return deletedPost;
  },

  updatePost: (parent, args, { db, pubsub }, info) => {
    let mutation = 'UPDATED';
    const { id: entryId, data } = args;
    const { posts } = db;
    const { title, body, published } = data;
    const post = posts.find(({ id }) => id == entryId);
    const originalPost = { ...post };
    if (!post) {
      throw new Error('Post not found');
    }
    if(typeof title === 'string') post.title = title;
    if(typeof body === 'string') post.body = body;
    if(typeof published === 'boolean'){
      post.published = published;
      if (originalPost.published && !post.published) {
        // deleted
        mutation = 'DELETED';
      } else if (!originalPost.published && post.published) {
        //created
        mutation = 'CREATED';
      }
      pubsub.publish('post', {
        post: {
          mutation,
          data: post
        }
      })
    } else if (post.published) {
      //updated
      pubsub.publish('post', {
        post: {
          mutation,
          data: post
        }
      });
    }
    return post;
  },

  createComment: (parent, args, { db, pubsub }, info) => {
    const { user, post } = args.data;
    const elementExists = (elementId, elements, idLiteral) => elements.some((el) => el[idLiteral] == elementId);
    const postValidation = !elementExists(post, db.posts, 'id');
    const userValidation = !elementExists(user, db.users, 'id');
    if (postValidation || userValidation) {
      const errMsg = `${ postValidation ? 'Post' : 'User' } with the given ID does not exist`;
      throw new Error(errMsg);
    }

    const targetPost = db.posts.find(({ id }) => id.toString() === post);
    if (!targetPost.published) {
      throw new Error('You cant comment on a unpublished post');
    }
    const newComment = {
      ...args.data,
      id: ++db.comments.length
    };
    pubsub.publish(`commentPost${ post }`, { 
      comment: {
        data: newComment,
        mutation: 'CREATED'
      }});
    db.comments.push(newComment);
    return newComment;
  },

  deleteComment: (parent, args, { db, pubsub }, info) => {
    const { id } = args;
    console.log(db.comments);
    const comIndx = db.comments.findIndex(({ id:cmID }) => id == cmID);
    if (comIndx < 0) throw new Error ('Comment not found');
    const [deletedComment] = db.comments.splice(comIndx, 1);
    pubsub.publish(`commentPost${ id }`, { 
      comment: {
        data: deletedComment,
        mutation: 'DELETED'
      }});
    return deletedComment;
  },

  updateComment: (parent, args, { db, pubsub }, info) => {
    console.log(args);
    const { id:entryId, data } = args;
    const { title, body } = data;
    const { comments } = db;
    const comment = comments.find(({ id }) => id == entryId);
    if (!comment) {
      throw new Error('Comment not found');
    }
    const { id } = db.posts.find(({ id:postID }) => postID == comment.id);
    const titleSent = typeof title === 'string';
    const bodySent = typeof body === 'string'
    if(titleSent) comment.title = title;
    if(bodySent) comment.body = body;
    console.log(`commentPost${ id }`);
    if(titleSent || bodySent) {
      pubsub.publish(`commentPost${ id }`, { 
        comment: {
          data: comment,
          mutation: 'UPDATED'
        }});
    }
    return comment;
  }

}

export default Mutation;