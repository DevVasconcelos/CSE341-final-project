const db = require("../models");
const dotenv = require("dotenv");
dotenv.config();
const Movies = db.movies;

const apiKey = process.env.API_KEY;

/******************************
 * POST - Create a Movie
 *******************************/
exports.create = (req, res) => {
  /*
    #swagger.summary = Adds a movie to the database.
    #swagger.description = 'Creates a new movie in the database.'
  */

  // Validate request - Check required fields
  if (!req.body.name) {
    return res.status(400).send({ 
      message: "Required field (name) cannot be empty!" 
    });
  }

  // Create a Movie
  const movie = new Movies({
    title: req.body.title,
    realeaseYear: req.body.realeaseYear,
    genre: req.body.genre
  });
  
  // Save Movie in the database
  movie
    .save(movie)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Movie.",
      });
    });
};

/******************************************
 * GET - get all movies from the database
 ******************************************/
exports.findAll = (req, res) => {
  /*
    #swagger.summary = Returns a list of all movies in the database.
    #swagger.description = 'Returns all movies stored in the database. Authentication may be required.'
  */
  console.log(req.header("apiKey"));
  if (req.header("apiKey") === apiKey) {
    Movies.find({}).lean()
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Some error occurred while retrieving movies.",
        });
      });
  } else {
    res.send("Invalid apiKey, please read the documentation.");
  }
};

/************************************************
 * GET - get a single movie by ID
 ************************************************/
exports.findOne = (req, res) => {
  /*
    #swagger.summary = Returns a single movie by ID.
    #swagger.description = 'Returns a single movie from the database. Authentication may be required.'
  */
  const movie_id = req.params.id;

  if (req.header("apiKey") === apiKey) {
    Movies.findById(movie_id)
      .then((data) => {
        if (!data) {
          res.status(404).send({ 
            message: "Not found Movie with id " + movie_id 
          });
        } else {
          res.send(data);
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: "Error retrieving Movie with id=" + movie_id,
        });
      });
  } else {
    res.send("Invalid apiKey, please read the documentation.");
  }
};

// Update a Movie by the id in the request
exports.update = (req, res) => {
  /*
    #swagger.summary = Updates a movie by ID.
    #swagger.description = 'Updates a movie in the database by id.'
    #swagger.parameters['obj'] = {
      in: 'body',
      schema: {
        $title: 'any',
        $releaseYear: 'any',
        $genre: 'any'
      }
    }
  */
  // Validate request body
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).send({
      message: "Data to update cannot be empty!",
    });
  }

  const movie_id = req.params.id;

  Movies.findByIdAndUpdate(movie_id, req.body, { new: true, runValidators: true })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Movie with id=${movie_id}. Maybe Movie was not found!`,
        });
      } else {
        res.send({ message: "Movie was updated successfully.", data: data });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Movie with id=" + movie_id,
        error: err.message,
      });
    });
};

// Delete a Movie with the specified id in the request
exports.delete = (req, res) => {
  /*
    #swagger.summary = Deletes a movie by ID.
    #swagger.description = 'Deletes a movie from the database by id.'
  */
  const movie_id = req.params.id;

  Movies.findByIdAndDelete(movie_id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Movie with id=${movie_id}. Maybe Movie was not found!`,
        });
      } else {
        res.send({
          message: "Movie was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Movie with id=" + movie_id,
        error: err.message,
      });
    });
};