const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');

module.exports = (app) => {

  // NEW
  app.get('/posts/new', (req, res) => {
    if (req.user) {
      return res.render('posts-new');
    } else {
      return res.status(401); // UNAUTHORIZED
    }
  });

  // CREATE

  app.post('/posts/new', async (req, res) => {
    if (req.user) {
      try  {
        const post = new Post(req.body);
        post.author = req.user._id;
        await post.save();
        const user = await User.findById(req.user._id);
        user.posts.unshift(post);
        await user.save();
        console.log(post);
        return res.redirect(`/posts/${post._id}`);
      } catch (err) {
        console.log(err.message);
      }
    } else {
      return res.status(401); // UNAUTHORIZED
    }
  });

  // INDEX
  app.get('/', async (req, res) => {
    try {
      const currentUser = req.user;
      console.log(req.cookies);
      const posts = await Post.find({}).lean().populate('author');
      return res.render('posts-index', { posts, currentUser });
    } catch (err) {
      console.log(err.message);
    }
  });

  // SHOW
  app.get('/posts/:id', async (req, res) => {
    try {
      const post = await Post.findById(req.params.id).lean().populate('comments').populate('author');
      res.render('posts-show', { post });
    } catch (err) {
      console.log(err.message);
    }
  });


  // SUBREDDIT
  app.get('/n/:subreddit', async (req, res) => {
    try {
      const posts = await Post.find({ subreddit: req.params.subreddit }).lean().populate('author');
      res.render('posts-index', { posts });
    }
    catch (err) {
        console.log(err.message);
      };
  });
}; 


