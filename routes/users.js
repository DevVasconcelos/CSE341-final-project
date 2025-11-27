const routes = require('express').Router();
const users = require('../controllers/users.js');
const { isAuthenticated } = require('../middleware/auth.js');

routes.get('/', users.findAll);
routes.get('/:id', users.findOne);

// Protected routes - require OAuth authentication
routes.post('/', isAuthenticated, users.create);
routes.put('/:id', isAuthenticated, users.update);
routes.delete('/:id', isAuthenticated, users.delete);

module.exports = routes;
