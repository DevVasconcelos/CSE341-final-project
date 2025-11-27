module.exports = (mongoose) => {
  const moviesSchema = mongoose.Schema(
    {
      title: { type: String, required: true },
      releaseYear: Number,
      genre: String,
    },
    { 
      timestamps: true,
      collection: 'movies'
    }
  );

  const Movies = mongoose.model('Movies', moviesSchema);

  return Movies;
};
