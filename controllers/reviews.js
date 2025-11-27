const db = require("../models");
const dotenv = require("dotenv");
dotenv.config();
const Reviews = db.reviews;

const apiKey = process.env.API_KEY;

/******************************
 * POST - Create a Review
 *******************************/
exports.create = (req, res) => {
  /*
    #swagger.summary = Adds a review to the database.
    #swagger.description = 'Creates a new review in the database.'
  */

  // Validate request - Check required fields
  if (!req.body.userId) {
    return res.status(400).send({ 
      message: "Required field (userId) cannot be empty!" 
    });
  }

  // Create a Review
  const review = new Reviews({
    userId: req.body.userId,
    movieId: req.body.movieId,
    rating : req.body.rating,
    comment: req.body.comment
  });
  
  // Save Reviews in the database
  review
    .save(review)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Review.",
      });
    });
};

/******************************************
 * GET - get all reviews from the database
 ******************************************/
exports.findAll = (req, res) => {
  /*
    #swagger.summary = Returns a list of all reviews in the database.
    #swagger.description = 'Returns all reviews stored in the database. Authentication may be required.'
  */
  console.log(req.header("apiKey"));
  if (req.header("apiKey") === apiKey) {
    Reviews.find({}).lean()
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Some error occurred while retrieving reviews.",
        });
      });
  } else {
    res.send("Invalid apiKey, please read the documentation.");
  }
};

/************************************************
 * GET - get a single review by ID
 ************************************************/
exports.findOne = (req, res) => {
  /*
    #swagger.summary = Returns a single review by ID.
    #swagger.description = 'Returns a single review from the database. Authentication may be required.'
  */
  const review_id = req.params.id;

  if (req.header("apiKey") === apiKey) {
    Reviews.findById(review_id)
      .then((data) => {
        if (!data) {
          res.status(404).send({ 
            message: "Not found Reviews with id " + review_id 
          });
        } else {
          res.send(data);
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: "Error retrieving Review with id=" + review_id,
        });
      });
  } else {
    res.send("Invalid apiKey, please read the documentation.");
  }
};

// Update a Review by the id in the request
exports.update = (req, res) => {
  /*
    #swagger.summary = Updates a review by ID.
    #swagger.description = 'Updates a review in the database by id.'
    #swagger.parameters['obj'] = {
      in: 'body',
      schema: {
        $userId: 'any',
        $movieId: 'any',
        $rating: 'any',
        $comment: 'any'
      }
    }
  */
  // Validate request body
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).send({
      message: "Data to update cannot be empty!",
    });
  }

  const review_id = req.params.id;

  Reviews.findByIdAndUpdate(review_id, req.body, { new: true, runValidators: true })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Review with id=${review_id}. Maybe Review was not found!`,
        });
      } else {
        res.send({ message: "Review was updated successfully.", data: data });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Review with id=" + review_id,
        error: err.message,
      });
    });
};

// Delete a Review with the specified id in the request
exports.delete = (req, res) => {
  /*
    #swagger.summary = Deletes a review by ID.
    #swagger.description = 'Deletes a review from the database by id.'
  */
  const review_id = req.params.id;

  Reviews.findByIdAndDelete(review_id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Review with id=${review_id}. Maybe Review was not found!`,
        });
      } else {
        res.send({
          message: "Review was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Review with id=" + review_id,
        error: err.message,
      });
    });
};