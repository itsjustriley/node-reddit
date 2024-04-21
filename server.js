const express = require('express');
const app = express();
app.use(express.static('public'));

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
  res.render('index', { layout: 'main' });
});

// listen

app.listen(5000, () => {
  console.log('Server listening on port 5000');
});