const routes = require('express').Router();
const reviews = require('../controllers/reviews.js');
const { isAuthenticated } = require('../middleware/auth.js');

routes.get('/', reviews.findAll);
routes.get('/:id', reviews.findOne);

// Protected routes - require OAuth authentication
routes.post('/', isAuthenticated, reviews.create);
routes.put('/:id', isAuthenticated, reviews.update);
routes.delete('/:id', isAuthenticated, reviews.delete);

module.exports = routes;
