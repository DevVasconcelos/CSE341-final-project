module.exports = (mongoose) => {
  const reviewsSchema = mongoose.Schema(
    {
      userId: { type: Number, required: true },
      movieId: Number,
      rating: Number,
      comment: String
    },
    { 
      timestamps: true,
      collection: 'reviews'
    }
  );

  const Reviews = mongoose.model('Reviews', reviewsSchema);

  return Reviews;
};
