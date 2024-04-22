const Post = require('../models/post');

module.exports = (app) => {

  // NEW
  app.get('/posts/new', (req, res) => {
    res.render('posts-new');
  });

  // CREATE

  app.post('/posts/new', async (req, res) => {
    try {
      const currentUser = await req.user;
      if (currentUser) {
        const post = new Post(req.body);
  
        post.save(() => res.redirect('/'));
      } else {
        return res.status(401); // UNAUTHORIZED
      }
    } catch (err) {
      console.log(err.message);
    }
  });

  // INDEX
  app.get('/', async (req, res) => {
    try {
      const currentUser = await req.user;
      const posts = await Post.find({}).lean();
      return res.render('posts-index', { posts, currentUser });
    } catch (err) {
      console.log(err.message);
    }
  });

  // SHOW
  app.get('/posts/:id', async (req, res) => {
    try {
      const post = await Post.findById(req.params.id).lean().populate('comments');
      res.render('posts-show', { post });
    } catch (err) {
      console.log(err.message);
    }
  });


  // SUBREDDIT
  app.get('/n/:subreddit', async (req, res) => {
    try {
      const posts = await Post.find({ subreddit: req.params.subreddit }).lean();
      res.render('posts-index', { posts });
    }
    catch (err) {
        console.log(err.message);
      };
  });
}; 


