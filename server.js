const express = require('express');
const app = express();

require('./data/reddit-db');

app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

require('./controllers/posts')(app);


const handlebars = require('express-handlebars');

const hbs = handlebars.create({
  helpers: {
    foo() { return 'FOO'; },
    bar() { return 'BAR'; }
  }
});



app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', 'views');

// routes

app.get('/', (req, res) => {
  res.render('posts-index', { layout: 'main' });
});


app.get('/posts/new', (req, res) => {
  res.render('posts-new', { layout: 'main' });
});



// listen

app.listen(5000, () => {
  console.log('Server listening on port 5000');
});