const routes = require('express').Router();
const genres = require('./genres');
const movies = require('./movies');
const reviews = require('./reviews');
const users = require('./users');
const swagger = require('./swagger');
const auth = require('./auth');

routes.use('/', swagger);
routes.use('/auth', auth);
routes.use('/genres', genres);
routes.use('/movies', movies);
routes.use('/reviews', reviews);
routes.use('/users', users);
routes.use(
  '/',
  (docData = (req, res) => {
    let docData = {
      // documentationURL: '#',
      documentationURL: null,
    };
    res.send(docData);
  })
);

module.exports = routes;