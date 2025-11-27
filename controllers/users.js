const db = require("../models");
const dotenv = require("dotenv");
dotenv.config();
const Users = db.users;

const apiKey = process.env.API_KEY;

/******************************
 * POST - Create a User
 *******************************/
exports.create = (req, res) => {
  /*
    #swagger.summary = Adds a user to the database.
    #swagger.description = 'Creates a new user in the database.'
  */

  // Validate request - Check required fields
  if (!req.body.name) {
    return res.status(400).send({ 
      message: "Required field (name) cannot be empty!" 
    });
  }

  // Create a User
  const user = new Users({
    name: req.body.name,
    email: req.body.email,
  });
  
  // Save Users in the database
  user
    .save(user)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the User.",
      });
    });
};

/******************************************
 * GET - get all users from the database
 ******************************************/
exports.findAll = (req, res) => {
  /*
    #swagger.summary = Returns a list of all users in the database.
    #swagger.description = 'Returns all users stored in the database. Authentication may be required.'
  */
  console.log(req.header("apiKey"));
  if (req.header("apiKey") === apiKey) {
    Users.find({}).lean()
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Some error occurred while retrieving users.",
        });
      });
  } else {
    res.send("Invalid apiKey, please read the documentation.");
  }
};

/************************************************
 * GET - get a single user by ID
 ************************************************/
exports.findOne = (req, res) => {
  /*
    #swagger.summary = Returns a single user by ID.
    #swagger.description = 'Returns a single user from the database. Authentication may be required.'
  */
  const user_id = req.params.id;

  if (req.header("apiKey") === apiKey) {
    Users.findById(user_id)
      .then((data) => {
        if (!data) {
          res.status(404).send({ 
            message: "Not found Users with id " + user_id 
          });
        } else {
          res.send(data);
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: "Error retrieving User with id=" + user_id,
        });
      });
  } else {
    res.send("Invalid apiKey, please read the documentation.");
  }
};

// Update a User by the id in the request
exports.update = (req, res) => {
  /*
    #swagger.summary = Updates a user by ID.
    #swagger.description = 'Updates a user in the database by id.'
    #swagger.parameters['obj'] = {
      in: 'body',
      schema: {
        $name: 'any',
        $email: 'any',
      }
    }
  */
  // Validate request body
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).send({
      message: "Data to update cannot be empty!",
    });
  }

  const user_id = req.params.id;

  Users.findByIdAndUpdate(user_id, req.body, { new: true, runValidators: true })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update User with id=${user_id}. Maybe User was not found!`,
        });
      } else {
        res.send({ message: "User was updated successfully.", data: data });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating User with id=" + user_id,
        error: err.message,
      });
    });
};

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
  /*
    #swagger.summary = Deletes a user by ID.
    #swagger.description = 'Deletes a user from the database by id.'
  */
  const user_id = req.params.id;

  Users.findByIdAndDelete(user_id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete User with id=${user_id}. Maybe User was not found!`,
        });
      } else {
        res.send({
          message: "User was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete User with id=" + user_id,
        error: err.message,
      });
    });
};