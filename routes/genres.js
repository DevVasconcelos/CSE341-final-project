const routes = require('express').Router();
const genres = require('../controllers/genres.js');
const { isAuthenticated } = require('../middleware/auth.js');

routes.get('/', genres.findAll);
routes.get('/:id', genres.findOne);

// Protected routes - require OAuth authentication
routes.post('/', isAuthenticated, genres.create);
routes.put('/:id', isAuthenticated, genres.update);
routes.delete('/:id', isAuthenticated, genres.delete);

module.exports = routes;
