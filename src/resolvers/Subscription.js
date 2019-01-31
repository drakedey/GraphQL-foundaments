const Subscription = {
  comment: {
    subscribe: (parent, { postId }, { pubsub, db }, info) => {
      const post = db.posts.find(({ id, published }) => postId == id && published);
      if(!post) throw new Error('Posts does not exists!');
      return pubsub.asyncIterator(`commentPost${ postId }`);
    }
  },
  post: {
    subscribe: (parent, args, { pubsub, db }, info) => {
      return pubsub.asyncIterator('post');
    }
  }
};

export default Subscription;