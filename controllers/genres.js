const db = require("../models");
const dotenv = require("dotenv");
dotenv.config();
const Genres = db.genres;

const apiKey = process.env.API_KEY;

/******************************
 * POST - Create a Genre
 *******************************/
exports.create = (req, res) => {
  /*
    #swagger.summary = Adds a genre to the database.
    #swagger.description = 'Creates a new genre in the database.'
  */

  // Validate request - Check required fields
  if (!req.body.name) {
    return res.status(400).send({ 
      message: "Required field (name) cannot be empty!" 
    });
  }

  // Create a Genre
  const genre = new Genres({
    name: req.body.name,
    description: req.body.description,
  });
  
  // Save Genre in the database
  genre
    .save(genre)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Genre.",
      });
    });
};

/******************************************
 * GET - get all genres from the database
 ******************************************/
exports.findAll = (req, res) => {
  /*
    #swagger.summary = Returns a list of all genres in the database.
    #swagger.description = 'Returns all genres stored in the database. Authentication may be required.'
  */
  console.log(req.header("apiKey"));
  if (req.header("apiKey") === apiKey) {
    Genres.find({}).lean()
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Some error occurred while retrieving genres.",
        });
      });
  } else {
    res.send("Invalid apiKey, please read the documentation.");
  }
};

/************************************************
 * GET - get a single genre by ID
 ************************************************/
exports.findOne = (req, res) => {
  /*
    #swagger.summary = Returns a single genre by ID.
    #swagger.description = 'Returns a single genre from the database. Authentication may be required.'
  */
  const genre_id = req.params.id;

  if (req.header("apiKey") === apiKey) {
    Genres.findById(genre_id)
      .then((data) => {
        if (!data) {
          res.status(404).send({ 
            message: "Not found Genre with id " + genre_id 
          });
        } else {
          res.send(data);
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: "Error retrieving Genre with id=" + genre_id,
        });
      });
  } else {
    res.send("Invalid apiKey, please read the documentation.");
  }
};

// Update a Genre by the id in the request
exports.update = (req, res) => {
  /*
    #swagger.summary = Updates a genre by ID.
    #swagger.description = 'Updates a genre in the database by id.'
    #swagger.parameters['obj'] = {
      in: 'body',
      schema: {
        $name: 'any',
        $description: 'any'
      }
    }
  */
  // Validate request body
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).send({
      message: "Data to update cannot be empty!",
    });
  }

  const genre_id = req.params.id;

  Genres.findByIdAndUpdate(genre_id, req.body, { new: true, runValidators: true })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Genre with id=${genre_id}. Maybe Genre was not found!`,
        });
      } else {
        res.send({ message: "Genre was updated successfully.", data: data });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Genre with id=" + genre_id,
        error: err.message,
      });
    });
};

// Delete a Genre with the specified id in the request
exports.delete = (req, res) => {
  /*
    #swagger.summary = Deletes a genre by ID.
    #swagger.description = 'Deletes a genre from the database by id.'
  */
  const genre_id = req.params.id;

  Genres.findByIdAndDelete(genre_id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Genre with id=${genre_id}. Maybe Genre was not found!`,
        });
      } else {
        res.send({
          message: "Genre was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Genre with id=" + genre_id,
        error: err.message,
      });
    });
};