const routes = require('express').Router();
const movies = require('../controllers/movies.js');
const { isAuthenticated } = require('../middleware/auth.js');

routes.get('/', movies.findAll);
routes.get('/:id', movies.findOne);

// Protected routes - require OAuth authentication
routes.post('/', isAuthenticated, movies.create);
routes.put('/:id', isAuthenticated, movies.update);
routes.delete('/:id', isAuthenticated, movies.delete);

module.exports = routes;
